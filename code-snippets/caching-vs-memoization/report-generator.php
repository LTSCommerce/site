class ReportGenerator
{
    private array $memo = [];
    private Redis $redis;

    // Memoized helper - fast within single request
    private function calculateMetric(array $data): float
    {
        $key = md5(serialize($data));

        if (isset($this->memo[$key])) {
            return $this->memo[$key];
        }

        // Expensive calculation
        $result = $this->performComplexCalculation($data);
        $this->memo[$key] = $result;

        return $result;
    }

    private function performComplexCalculation(array $data): float
    {
        // ... expensive, deterministic work on $data
        return array_sum($data);
    }

    // Cached result - shared across requests
    public function generateReport(int $reportId): array
    {
        $cacheKey = "report:{$reportId}";

        // Check cache first
        $cached = $this->redis->get($cacheKey);
        if ($cached !== false) {
            return json_decode($cached, true);
        }

        $data1 = $this->loadDataSet($reportId, 'metric1');
        $data2 = $this->loadDataSet($reportId, 'metric2');

        // Generate report using memoized helpers
        $report = [
            'metric1' => $this->calculateMetric($data1),
            'metric2' => $this->calculateMetric($data2),
            // Memoization prevents duplicate calculations within this request
        ];

        // Cache for other requests
        $this->redis->setex($cacheKey, 3600, json_encode($report));

        return $report;
    }

    private function loadDataSet(int $reportId, string $metric): array
    {
        // ... load the raw data set for this metric
        return [];
    }
}
