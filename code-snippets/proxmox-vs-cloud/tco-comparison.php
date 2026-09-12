<?php

// TCO comparison framework: illustrative example figures, replace with your own numbers

// Private infrastructure costs
$hardwareCost = 45000; // initial investment (GBP)
$electricityPerYear = 6000;
$maintenancePerYear = 4000;
$staffTimePerYear = 8000;
$years = 5;

$totalPrivate = $hardwareCost + ($electricityPerYear + $maintenancePerYear + $staffTimePerYear) * $years;

// Public cloud costs
$monthlyCloudCost = 3500;
$months = $years * 12;

$totalCloud = $monthlyCloudCost * $months;

// Break-even analysis: months until the hardware investment is offset by the
// monthly saving versus cloud spend
$monthlyPrivateOperatingCost = ($electricityPerYear + $maintenancePerYear + $staffTimePerYear) / 12;
$breakEvenMonths = $hardwareCost / ($monthlyCloudCost - $monthlyPrivateOperatingCost);
