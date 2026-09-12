// ❌ VIOLATES RULE - Query created inside loop (N+1 problem)
foreach ($users as $user) {
    $query = new ProductQuery();  // PHPStan error!
    $products = $query->where('user_id', $user->id)->execute();
    // Process products...
}
