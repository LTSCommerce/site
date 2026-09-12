<?php

declare(strict_types=1);

namespace App\Tests\OpenApi\Response;

use App\Dto\UserDto;
use App\OpenApi\Response\SuccessResponse;
use Nelmio\ApiDocBundle\Annotation\Model;
use PHPUnit\Framework\TestCase;

final class SuccessResponseTest extends TestCase
{
    public function testGeneratesCorrectStructure(): void
    {
        $response = new SuccessResponse(UserDto::class);

        $this->assertSame(200, $response->response);
        $this->assertSame('Successful operation', $response->description);
        $this->assertInstanceOf(Model::class, $response->content);
    }

    public function testAcceptsCustomDescription(): void
    {
        $response = new SuccessResponse(UserDto::class, 'Custom message');

        $this->assertSame('Custom message', $response->description);
    }
}
