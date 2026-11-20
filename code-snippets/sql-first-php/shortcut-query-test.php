<?php

declare(strict_types=1);

namespace SqlFirstDemo\Tests\Scratch;

use PHPUnit\Framework\TestCase;
use SqlFirstDemo\Testing\FakeDbService;

final class ShortcutQueryTest extends TestCase
{
    public function testShortcuts(): void
    {
        $db  = new FakeDbService()->onQuery('SELECT stock FROM product WHERE id = 1', [['stock' => '3']]);
        $row = $db->queryRows('SELECT stock FROM product WHERE id = 1')->single();

        self::assertSame(3, $row->int('stock'));
    }
}
