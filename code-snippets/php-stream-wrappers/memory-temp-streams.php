<?php
// Create in-memory stream (faster for small data)
$memory = fopen('php://memory', 'r+');
fwrite($memory, "Temporary data");
rewind($memory);
$data = fread($memory, 1024);
fclose($memory);

// Create temporary file stream (better for large data)
$temp = fopen('php://temp/maxmemory:1048576', 'r+'); // 1MB memory limit
fwrite($temp, str_repeat('Large data chunk ', 1000));

// Stream automatically switches to filesystem when memory limit exceeded
echo "Stream metadata: ";
var_dump(stream_get_meta_data($temp));
fclose($temp);

// Using php://temp for CSV processing
function processLargeCsv(array $data): string
{
    $temp = fopen('php://temp', 'r+');

    foreach ($data as $row) {
        fputcsv($temp, $row);
    }

    rewind($temp);
    $csvContent = stream_get_contents($temp);
    fclose($temp);

    return $csvContent;
}
?>