/**
 * Monitoring utilities for Xonora backend service
 * Provides comprehensive logging, metrics, and health monitoring
 */

export interface PerformanceMetric {
  operation: string;
  duration: number;
  timestamp: number;
  success: boolean;
  error?: string;
}

export interface ErrorLog {
  error: string;
  stack?: string;
  timestamp: number;
  operation: string;
  userId?: string;
  context?: Record<string, any>;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: HealthCheck[];
  timestamp: number;
}

export interface HealthCheck {
  name: string;
  status: 'pass' | 'fail' | 'warn';
  duration: number;
  message?: string;
}

export interface CacheMetrics {
  hitRate: number;
  size: number;
  maxSize: number;
  expiredCount: number;
  totalAccessCount: number;
}

export class MonitoringService {
  private static instance: MonitoringService;
  private performanceMetrics: PerformanceMetric[] = [];
  private errorLogs: ErrorLog[] = [];
  private maxMetrics = 1000;
  private maxErrors = 500;

  private constructor() {}

  static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  /**
   * Log performance metric
   */
  logPerformance(operation: string, duration: number, success: boolean, error?: string): void {
    const metric: PerformanceMetric = {
      operation,
      duration,
      timestamp: Date.now(),
      success,
      error
    };

    this.performanceMetrics.push(metric);

    // Keep only recent metrics
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      const status = success ? '✅' : '❌';
      console.log(`${status} ${operation}: ${duration}ms${error ? ` - ${error}` : ''}`);
    }
  }

  /**
   * Log error
   */
  logError(error: string, operation: string, userId?: string, context?: Record<string, any>): void {
    const errorLog: ErrorLog = {
      error,
      stack: new Error().stack,
      timestamp: Date.now(),
      operation,
      userId,
      context
    };

    this.errorLogs.push(errorLog);

    // Keep only recent errors
    if (this.errorLogs.length > this.maxErrors) {
      this.errorLogs = this.errorLogs.slice(-this.maxErrors);
    }

    // Log to console
    console.error(`❌ ${operation}: ${error}`, {
      userId,
      context,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Get performance metrics
   */
  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  /**
   * Get error logs
   */
  getErrorLogs(): ErrorLog[] {
    return [...this.errorLogs];
  }

  /**
   * Get performance statistics
   */
  getPerformanceStats(): Record<string, any> {
    const successful = this.performanceMetrics.filter(m => m.success);
    const failed = this.performanceMetrics.filter(m => !m.success);

    const stats: Record<string, any> = {
      totalOperations: this.performanceMetrics.length,
      successfulOperations: successful.length,
      failedOperations: failed.length,
      successRate: this.performanceMetrics.length > 0 ? 
        (successful.length / this.performanceMetrics.length) * 100 : 0,
      averageDuration: successful.length > 0 ? 
        successful.reduce((sum, m) => sum + m.duration, 0) / successful.length : 0,
      maxDuration: successful.length > 0 ? 
        Math.max(...successful.map(m => m.duration)) : 0,
      minDuration: successful.length > 0 ? 
        Math.min(...successful.map(m => m.duration)) : 0
    };

    // Group by operation
    const operationStats: Record<string, any> = {};
    const operationGroups = this.groupBy(this.performanceMetrics, 'operation');

    for (const [operation, metrics] of Object.entries(operationGroups)) {
      const opSuccessful = metrics.filter((m: PerformanceMetric) => m.success);
      const opFailed = metrics.filter((m: PerformanceMetric) => !m.success);

      operationStats[operation] = {
        total: metrics.length,
        successful: opSuccessful.length,
        failed: opFailed.length,
        successRate: metrics.length > 0 ? (opSuccessful.length / metrics.length) * 100 : 0,
        averageDuration: opSuccessful.length > 0 ? 
          opSuccessful.reduce((sum: number, m: PerformanceMetric) => sum + m.duration, 0) / opSuccessful.length : 0
      };
    }

    stats.operations = operationStats;
    return stats;
  }

  /**
   * Get error statistics
   */
  getErrorStats(): Record<string, any> {
    const errorCounts: Record<string, number> = {};
    const operationErrors: Record<string, number> = {};

    this.errorLogs.forEach(log => {
      // Count by error message
      errorCounts[log.error] = (errorCounts[log.error] || 0) + 1;
      
      // Count by operation
      operationErrors[log.operation] = (operationErrors[log.operation] || 0) + 1;
    });

    return {
      totalErrors: this.errorLogs.length,
      uniqueErrors: Object.keys(errorCounts).length,
      errorCounts,
      operationErrors,
      recentErrors: this.errorLogs.slice(-10) // Last 10 errors
    };
  }

  /**
   * Check system health
   */
  async checkSystemHealth(): Promise<SystemHealth> {
    const checks: HealthCheck[] = [];
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Check performance
    const perfStats = this.getPerformanceStats();
    const avgDuration = perfStats.averageDuration;
    
    checks.push({
      name: 'Performance',
      status: avgDuration < 1000 ? 'pass' : avgDuration < 3000 ? 'warn' : 'fail',
      duration: avgDuration,
      message: `Average response time: ${avgDuration.toFixed(2)}ms`
    });

    // Check error rate
    const errorStats = this.getErrorStats();
    const errorRate = perfStats.totalOperations > 0 ? 
      (errorStats.totalErrors / perfStats.totalOperations) * 100 : 0;
    
    checks.push({
      name: 'Error Rate',
      status: errorRate < 1 ? 'pass' : errorRate < 5 ? 'warn' : 'fail',
      duration: 0,
      message: `Error rate: ${errorRate.toFixed(2)}%`
    });

    // Check success rate
    const successRate = perfStats.successRate;
    checks.push({
      name: 'Success Rate',
      status: successRate > 95 ? 'pass' : successRate > 90 ? 'warn' : 'fail',
      duration: 0,
      message: `Success rate: ${successRate.toFixed(2)}%`
    });

    // Determine overall status
    const failedChecks = checks.filter(c => c.status === 'fail').length;
    const warnChecks = checks.filter(c => c.status === 'warn').length;

    if (failedChecks > 0) {
      overallStatus = 'unhealthy';
    } else if (warnChecks > 0) {
      overallStatus = 'degraded';
    }

    return {
      status: overallStatus,
      checks,
      timestamp: Date.now()
    };
  }

  /**
   * Clear old metrics and logs
   */
  clearOldData(maxAgeMs: number = 24 * 60 * 60 * 1000): void {
    const cutoff = Date.now() - maxAgeMs;

    this.performanceMetrics = this.performanceMetrics.filter(m => m.timestamp > cutoff);
    this.errorLogs = this.errorLogs.filter(e => e.timestamp > cutoff);
  }

  /**
   * Get monitoring summary
   */
  getSummary(): Record<string, any> {
    return {
      performance: this.getPerformanceStats(),
      errors: this.getErrorStats(),
      health: this.checkSystemHealth(),
      timestamp: Date.now()
    };
  }

  /**
   * Helper function to group arrays by property
   */
  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  }
}

// Performance monitoring decorator
export function monitorPerformance(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const operation = operationName || `${target.constructor.name}.${propertyName}`;
      const startTime = Date.now();
      let success = true;
      let error: string | undefined;

      try {
        const result = await method.apply(this, args);
        return result;
      } catch (err) {
        success = false;
        error = err instanceof Error ? err.message : String(err);
        throw err;
      } finally {
        const duration = Date.now() - startTime;
        MonitoringService.getInstance().logPerformance(operation, duration, success, error);
      }
    };

    return descriptor;
  };
}

// Error monitoring decorator
export function monitorErrors(operationName?: string) {
  return function (target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const method = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const operation = operationName || `${target.constructor.name}.${propertyName}`;
      
      try {
        return await method.apply(this, args);
      } catch (err) {
        const error = err instanceof Error ? err.message : String(err);
        MonitoringService.getInstance().logError(error, operation);
        throw err;
      }
    };

    return descriptor;
  };
}

// Export singleton instance
export const monitoring = MonitoringService.getInstance();
