import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Float "mo:base/Float";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat64 "mo:base/Nat64";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Timer "mo:base/Timer";
import Bool "mo:base/Bool";

shared ({ caller = initializer }) actor class YieldBTC() = {
    // Types
    type UserId = Principal;
    type StakeId = Nat;
    type PoolId = Text;
    type Amount = Nat64;
    type Timestamp = Int;
    type APY = Float;

    // Stake record
    type Stake = {
        id: StakeId;
        userId: UserId;
        amount: Amount;
        poolId: PoolId;
        startTime: Timestamp;
        lastClaimTime: Timestamp;
        isActive: Bool;
    };

    // Pool record
    type Pool = {
        id: PoolId;
        name: Text;
        apy: APY;
        totalStaked: Amount;
        maxCapacity: Amount;
        isActive: Bool;
    };

    // User portfolio
    type Portfolio = {
        userId: UserId;
        totalStaked: Amount;
        totalEarned: Amount;
        activeStakes: [StakeId];
    };

    // Stable storage
    private stable var stakeCounter: Nat = 0;
    private stable var stakesEntries: [(StakeId, Stake)] = [];
    private stable var poolsEntries: [(PoolId, Pool)] = [];
    private stable var portfoliosEntries: [(UserId, Portfolio)] = [];

    // Mutable storage
    private var stakes = HashMap.HashMap<StakeId, Stake>(0, Nat.equal, Hash.hash);
    private var pools = HashMap.HashMap<PoolId, Pool>(0, Text.equal, Text.hash);
    private var portfolios = HashMap.HashMap<UserId, Portfolio>(0, Principal.equal, Principal.hash);

    // System state
    private stable var isInitialized: Bool = false;
    private stable var owner: Principal = initializer;

    // Initialize pools
    private func initializePools() {
        let stablePool = {
            id = "stable";
            name = "Stable Pool";
            apy = 5.0;
            totalStaked = 0 : Nat64;
            maxCapacity = 100_000_000_000 : Nat64; // 1 BTC in satoshis
            isActive = true;
        };

        let balancedPool = {
            id = "balanced";
            name = "Balanced Pool";
            apy = 10.0;
            totalStaked = 0 : Nat64;
            maxCapacity = 100_000_000_000 : Nat64;
            isActive = true;
        };

        let aggressivePool = {
            id = "aggressive";
            name = "Aggressive Pool";
            apy = 15.0;
            totalStaked = 0 : Nat64;
            maxCapacity = 100_000_000_000 : Nat64;
            isActive = true;
        };

        pools.put("stable", stablePool);
        pools.put("balanced", balancedPool);
        pools.put("aggressive", aggressivePool);
    };

    // System functions
    public shared ({ caller }) func initialize() : async Result.Result<Text, Text> {
        if (isInitialized) {
            return #err("Already initialized");
        };
        if (caller != owner) {
            return #err("Only owner can initialize");
        };

        initializePools();
        isInitialized := true;
        #ok("System initialized successfully")
    };

    // Stake management
    public shared ({ caller }) func stake(amount: Amount, poolId: PoolId) : async Result.Result<StakeId, Text> {
        if (not isInitialized) {
            return #err("System not initialized");
        };

        if (amount == 0) {
            return #err("Amount must be greater than 0");
        };

        let pool = switch (pools.get(poolId)) {
            case (?p) p;
            case null return #err("Pool not found");
        };

        if (not pool.isActive) {
            return #err("Pool is not active");
        };

        if (pool.totalStaked + amount > pool.maxCapacity) {
            return #err("Pool capacity exceeded");
        };

        // Create new stake
        let stakeId = stakeCounter;
        stakeCounter += 1;

        let newStake: Stake = {
            id = stakeId;
            userId = caller;
            amount = amount;
            poolId = poolId;
            startTime = Time.now();
            lastClaimTime = Time.now();
            isActive = true;
        };

        // Update pool
        let updatedPool: Pool = {
            id = pool.id;
            name = pool.name;
            apy = pool.apy;
            totalStaked = pool.totalStaked + amount;
            maxCapacity = pool.maxCapacity;
            isActive = pool.isActive;
        };

        // Update or create portfolio
        let portfolio = switch (portfolios.get(caller)) {
            case (?p) (
                {
                    userId = p.userId;
                    totalStaked = p.totalStaked + amount;
                    totalEarned = p.totalEarned;
                    activeStakes = Array.append(p.activeStakes, [stakeId]);
                }
            );
            case null (
                {
                    userId = caller;
                    totalStaked = amount;
                    totalEarned = 0 : Nat64;
                    activeStakes = [stakeId];
                }
            );
        };

        // Save to storage
        stakes.put(stakeId, newStake);
        pools.put(poolId, updatedPool);
        portfolios.put(caller, portfolio);

        #ok(stakeId)
    };

    public shared ({ caller }) func unstake(stakeId: StakeId) : async Result.Result<Amount, Text> {
        let stake = switch (stakes.get(stakeId)) {
            case (?s) s;
            case null return #err("Stake not found");
        };

        if (stake.userId != caller) {
            return #err("Not authorized");
        };

        if (not stake.isActive) {
            return #err("Stake is not active");
        };

        // Calculate earned yield
        let earned = calculateYield(stake);
        let totalAmount = stake.amount + earned;

        // Update stake
        let updatedStake: Stake = {
            id = stake.id;
            userId = stake.userId;
            amount = stake.amount;
            poolId = stake.poolId;
            startTime = stake.startTime;
            lastClaimTime = Time.now();
            isActive = false;
        };

        // Update pool
        let pool = switch (pools.get(stake.poolId)) {
            case (?p) p;
            case null return #err("Pool not found");
        };

        let updatedPool: Pool = {
            id = pool.id;
            name = pool.name;
            apy = pool.apy;
            totalStaked = pool.totalStaked - stake.amount;
            maxCapacity = pool.maxCapacity;
            isActive = pool.isActive;
        };

        // Update portfolio
        let portfolio = switch (portfolios.get(caller)) {
            case (?p) (
                {
                    userId = p.userId;
                    totalStaked = p.totalStaked - stake.amount;
                    totalEarned = p.totalEarned + earned;
                    activeStakes = Array.filter(p.activeStakes, func(id: StakeId) : Bool { id != stakeId });
                }
            );
            case null return #err("Portfolio not found");
        };

        // Save to storage
        stakes.put(stakeId, updatedStake);
        pools.put(stake.poolId, updatedPool);
        portfolios.put(caller, portfolio);

        #ok(totalAmount)
    };

    // Yield calculation
    private func calculateYield(stake: Stake) : Amount {
        let pool = switch (pools.get(stake.poolId)) {
            case (?p) p;
            case null return 0 : Nat64;
        };

        let timeDiff = Time.now() - stake.lastClaimTime;
        let daysDiff = Float.fromInt(timeDiff) / Float.fromInt(24 * 60 * 60 * 1_000_000_000); // Convert to days
        let apyRate = pool.apy / 100.0;
        let dailyRate = apyRate / 365.0;
        
        let yieldAmount = Float.fromInt(Nat64.toNat(stake.amount)) * dailyRate * daysDiff;
        Nat64.fromNat(Int.abs(Float.toInt(yieldAmount)))
    };

    // Query functions
    public query func getPools() : async [Pool] {
        Iter.toArray(pools.vals())
    };

    public query func getPool(poolId: PoolId) : async Result.Result<Pool, Text> {
        switch (pools.get(poolId)) {
            case (?pool) #ok(pool);
            case null #err("Pool not found");
        }
    };

    public query func getUserStakes(userId: UserId) : async [Stake] {
        let userStakes = Array.filter(Iter.toArray(stakes.vals()), func(stake: Stake) : Bool {
            stake.userId == userId
        });
        userStakes
    };

    public query func getPortfolio(userId: UserId) : async Result.Result<Portfolio, Text> {
        switch (portfolios.get(userId)) {
            case (?portfolio) #ok(portfolio);
            case null #err("Portfolio not found");
        }
    };

    public query func getStake(stakeId: StakeId) : async Result.Result<Stake, Text> {
        switch (stakes.get(stakeId)) {
            case (?stake) #ok(stake);
            case null #err("Stake not found");
        }
    };

    // System info
    public query func getSystemInfo() : async { owner: Principal; isInitialized: Bool; totalStakes: Nat } {
        {
            owner = owner;
            isInitialized = isInitialized;
            totalStakes = stakes.size();
        }
    };

    // System functions
    public shared ({ caller }) func whoami() : async Principal {
        caller
    };

    // System upgrade hooks
    system func preupgrade() {
        stakesEntries := Iter.toArray(stakes.entries());
        poolsEntries := Iter.toArray(pools.entries());
        portfoliosEntries := Iter.toArray(portfolios.entries());
    };

    system func postupgrade() {
        stakes := HashMap.fromIter<StakeId, Stake>(stakesEntries.vals(), stakesEntries.size(), Nat.equal, Hash.hash);
        pools := HashMap.fromIter<PoolId, Pool>(poolsEntries.vals(), poolsEntries.size(), Text.equal, Text.hash);
        portfolios := HashMap.fromIter<UserId, Portfolio>(portfoliosEntries.vals(), portfoliosEntries.size(), Principal.equal, Principal.hash);
        stakesEntries := [];
        poolsEntries := [];
        portfoliosEntries := [];
    };
}; 