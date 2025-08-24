/**
 * Input validation utilities for Xonora backend service
 * Provides comprehensive validation for all user inputs and business rules
 */

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationRule {
  test: (value: any) => boolean;
  message: string;
}

export class Validator {
  private errors: string[] = [];

  /**
   * Validate stake amount
   */
  static validateStakeAmount(amount: bigint | number | string): ValidationResult {
    const errors: string[] = [];
    
    try {
      const numAmount = typeof amount === 'bigint' ? Number(amount) : Number(amount);
      
      if (isNaN(numAmount)) {
        errors.push('Amount must be a valid number');
      } else if (numAmount <= 0) {
        errors.push('Amount must be greater than 0');
      } else if (numAmount < 0.001) {
        errors.push('Minimum stake amount is 0.001 ckBTC');
      } else if (numAmount > 1000) {
        errors.push('Maximum stake amount is 1000 ckBTC');
      }
      
      // Check for reasonable precision (8 decimal places max)
      const decimalPlaces = numAmount.toString().split('.')[1]?.length || 0;
      if (decimalPlaces > 8) {
        errors.push('Amount cannot have more than 8 decimal places');
      }
    } catch (error) {
      errors.push('Invalid amount format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate pool ID
   */
  static validatePoolId(poolId: string): ValidationResult {
    const errors: string[] = [];
    
    if (!poolId || typeof poolId !== 'string') {
      errors.push('Pool ID is required');
    } else if (poolId.trim().length === 0) {
      errors.push('Pool ID cannot be empty');
    } else if (!['stable', 'balanced', 'aggressive'].includes(poolId)) {
      errors.push('Invalid pool ID. Must be one of: stable, balanced, aggressive');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user ID (Principal)
   */
  static validateUserId(userId: string): ValidationResult {
    const errors: string[] = [];
    
    if (!userId || typeof userId !== 'string') {
      errors.push('User ID is required');
    } else if (userId.trim().length === 0) {
      errors.push('User ID cannot be empty');
    } else if (!/^[a-z0-9-]+$/.test(userId)) {
      errors.push('Invalid user ID format');
    } else if (userId.length < 10 || userId.length > 63) {
      errors.push('User ID must be between 10 and 63 characters');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate stake ID
   */
  static validateStakeId(stakeId: number | string): ValidationResult {
    const errors: string[] = [];
    
    try {
      const numStakeId = Number(stakeId);
      
      if (isNaN(numStakeId)) {
        errors.push('Stake ID must be a valid number');
      } else if (numStakeId < 0) {
        errors.push('Stake ID must be non-negative');
      } else if (!Number.isInteger(numStakeId)) {
        errors.push('Stake ID must be an integer');
      }
    } catch (error) {
      errors.push('Invalid stake ID format');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate portfolio data
   */
  static validatePortfolio(portfolio: any): ValidationResult {
    const errors: string[] = [];
    
    if (!portfolio || typeof portfolio !== 'object') {
      errors.push('Portfolio data is required');
      return { isValid: false, errors };
    }

    if (!portfolio.userId) {
      errors.push('Portfolio must have a user ID');
    }

    if (typeof portfolio.totalStaked !== 'bigint' && typeof portfolio.totalStaked !== 'number') {
      errors.push('Total staked amount must be a number');
    }

    if (typeof portfolio.totalEarned !== 'bigint' && typeof portfolio.totalEarned !== 'number') {
      errors.push('Total earned amount must be a number');
    }

    if (!Array.isArray(portfolio.activeStakes)) {
      errors.push('Active stakes must be an array');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate pool data
   */
  static validatePool(pool: any): ValidationResult {
    const errors: string[] = [];
    
    if (!pool || typeof pool !== 'object') {
      errors.push('Pool data is required');
      return { isValid: false, errors };
    }

    if (!pool.id || typeof pool.id !== 'string') {
      errors.push('Pool must have a valid ID');
    }

    if (!pool.name || typeof pool.name !== 'string') {
      errors.push('Pool must have a name');
    }

    if (typeof pool.apy !== 'number' || isNaN(pool.apy)) {
      errors.push('Pool APY must be a valid number');
    } else if (pool.apy < 0 || pool.apy > 100) {
      errors.push('Pool APY must be between 0 and 100');
    }

    if (typeof pool.totalStaked !== 'bigint' && typeof pool.totalStaked !== 'number') {
      errors.push('Pool total staked must be a number');
    }

    if (typeof pool.maxCapacity !== 'bigint' && typeof pool.maxCapacity !== 'number') {
      errors.push('Pool max capacity must be a number');
    }

    if (typeof pool.isActive !== 'boolean') {
      errors.push('Pool active status must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate stake data
   */
  static validateStake(stake: any): ValidationResult {
    const errors: string[] = [];
    
    if (!stake || typeof stake !== 'object') {
      errors.push('Stake data is required');
      return { isValid: false, errors };
    }

    if (typeof stake.id !== 'number' || isNaN(stake.id)) {
      errors.push('Stake must have a valid ID');
    }

    if (!stake.userId || typeof stake.userId !== 'string') {
      errors.push('Stake must have a user ID');
    }

    if (typeof stake.amount !== 'bigint' && typeof stake.amount !== 'number') {
      errors.push('Stake amount must be a number');
    }

    if (!stake.poolId || typeof stake.poolId !== 'string') {
      errors.push('Stake must have a pool ID');
    }

    if (typeof stake.startTime !== 'bigint' && typeof stake.startTime !== 'number') {
      errors.push('Stake start time must be a number');
    }

    if (typeof stake.lastClaimTime !== 'bigint' && typeof stake.lastClaimTime !== 'number') {
      errors.push('Stake last claim time must be a number');
    }

    if (typeof stake.isActive !== 'boolean') {
      errors.push('Stake active status must be a boolean');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate business rules for staking
   */
  static validateStakingRules(amount: bigint, poolId: string, userStakes: any[]): ValidationResult {
    const errors: string[] = [];
    
    // Validate amount
    const amountValidation = this.validateStakeAmount(amount);
    if (!amountValidation.isValid) {
      errors.push(...amountValidation.errors);
    }

    // Validate pool ID
    const poolValidation = this.validatePoolId(poolId);
    if (!poolValidation.isValid) {
      errors.push(...poolValidation.errors);
    }

    // Check user stake limits
    const totalUserStakes = userStakes.reduce((total, stake) => {
      return total + (typeof stake.amount === 'bigint' ? Number(stake.amount) : stake.amount);
    }, 0);
    
    const newTotal = totalUserStakes + Number(amount);
    if (newTotal > 10000) { // 10 BTC limit per user
      errors.push('Total staked amount cannot exceed 10 BTC per user');
    }

    // Check daily stake limit (simplified - in real implementation would track daily totals)
    const todayStakes = userStakes.filter(stake => {
      const stakeDate = new Date(Number(stake.startTime) / 1_000_000);
      const today = new Date();
      return stakeDate.toDateString() === today.toDateString();
    });
    
    const todayTotal = todayStakes.reduce((total, stake) => {
      return total + (typeof stake.amount === 'bigint' ? Number(stake.amount) : stake.amount);
    }, 0);
    
    if (todayTotal + Number(amount) > 1000) { // 1 BTC daily limit
      errors.push('Daily stake limit exceeded (1 BTC per day)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize string input
   */
  static sanitizeString(input: string): string {
    if (typeof input !== 'string') {
      return '';
    }
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .substring(0, 1000); // Limit length
  }

  /**
   * Validate and sanitize all inputs for a staking operation
   */
  static validateStakingInputs(amount: any, poolId: any, userId: string): ValidationResult {
    const errors: string[] = [];
    
    // Sanitize inputs
    const sanitizedPoolId = this.sanitizeString(poolId);
    const sanitizedUserId = this.sanitizeString(userId);
    
    // Validate amount
    const amountValidation = this.validateStakeAmount(amount);
    if (!amountValidation.isValid) {
      errors.push(...amountValidation.errors);
    }
    
    // Validate pool ID
    const poolValidation = this.validatePoolId(sanitizedPoolId);
    if (!poolValidation.isValid) {
      errors.push(...poolValidation.errors);
    }
    
    // Validate user ID
    const userValidation = this.validateUserId(sanitizedUserId);
    if (!userValidation.isValid) {
      errors.push(...userValidation.errors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(validation: ValidationResult): string {
    if (validation.isValid) {
      return '';
    }
    return validation.errors.join(', ');
  }
}

// Export commonly used validation functions
export const validateStakeAmount = Validator.validateStakeAmount;
export const validatePoolId = Validator.validatePoolId;
export const validateUserId = Validator.validateUserId;
export const validateStakeId = Validator.validateStakeId;
export const validatePortfolio = Validator.validatePortfolio;
export const validatePool = Validator.validatePool;
export const validateStake = Validator.validateStake;
export const validateStakingRules = Validator.validateStakingRules;
export const validateStakingInputs = Validator.validateStakingInputs;
export const sanitizeString = Validator.sanitizeString;
export const getErrorMessage = Validator.getErrorMessage;
