/**
 * パフォーマンスメトリクス
 */
interface PerformanceMetric {
  name: string;
  duration: number;
}

/**
 * パフォーマンストラッカー
 *
 * 処理時間を計測し、レポートを生成する
 */
export class PerformanceTracker {
  private metrics: PerformanceMetric[] = [];

  /**
   * 処理を計測して実行
   *
   * @param name - メトリクス名
   * @param fn - 計測対象の処理
   * @returns 処理結果
   */
  async track<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const startTime = Date.now();

    try {
      return await fn();
    } finally {
      const duration = Date.now() - startTime;
      this.metrics.push({ name, duration });
    }
  }

  /**
   * 同期処理を計測して実行
   *
   * @param name - メトリクス名
   * @param fn - 計測対象の処理
   * @returns 処理結果
   */
  trackSync<T>(name: string, fn: () => T): T {
    const startTime = Date.now();

    try {
      return fn();
    } finally {
      const duration = Date.now() - startTime;
      this.metrics.push({ name, duration });
    }
  }

  /**
   * パフォーマンスレポートを出力
   *
   * 処理時間の降順でソートして表示
   */
  report(): void {
    if (this.metrics.length === 0) {
      console.log("\n=== Performance Report ===");
      console.log("No metrics collected");
      console.log("==========================\n");
      return;
    }

    const sorted = [...this.metrics].sort((a, b) => b.duration - a.duration);
    const total = this.metrics.reduce((sum, m) => sum + m.duration, 0);

    console.log("\n=== Performance Report ===");
    console.log(`Total: ${total}ms`);
    console.log(`Metrics: ${this.metrics.length}`);
    console.log("\nTop 10 slowest:");
    sorted.slice(0, 10).forEach(({ name, duration }) => {
      console.log(`  ${name}: ${duration}ms`);
    });
    console.log("==========================\n");
  }

  /**
   * メトリクスをクリア
   */
  clear(): void {
    this.metrics = [];
  }

  /**
   * メトリクスを取得
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }
}
