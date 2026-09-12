// ✅ PASSES RULE - Query created once, batched execution
$userIds = array_map(fn($u) => $u->id, $users);
$query = new ProductQuery();  // Create once before loop
$allProducts = $query->whereIn('user_id', $userIds)->execute();

// Map products back to users
foreach ($users as $user) {
    $userProducts = array_filter($allProducts, fn($p) => $p->user_id === $user->id);
    // Process products...
}
