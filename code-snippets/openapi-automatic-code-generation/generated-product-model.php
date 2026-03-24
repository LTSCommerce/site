<?php

declare(strict_types=1);

namespace App\ApiClient\Model;

class Product
{
    protected ?string $id = null;
    protected ?string $name = null;
    protected ?float $price = null;
    protected ?string $category = null;
    protected ?\DateTimeInterface $createdAt = null;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(array $data = [])
    {
        if (isset($data['id'])) {
            $this->id = $data['id'];
        }
        if (isset($data['name'])) {
            $this->name = $data['name'];
        }
        if (isset($data['price'])) {
            $this->price = (float) $data['price'];
        }
        if (isset($data['category'])) {
            $this->category = $data['category'];
        }
        if (isset($data['createdAt'])) {
            $this->createdAt = new \DateTimeImmutable($data['createdAt']);
        }
    }

    public function getId(): ?string
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    /**
     * @return array<string, mixed>
     */
    public function jsonSerialize(): array
    {
        return array_filter([
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'category' => $this->category,
            'createdAt' => $this->createdAt?->format('c'),
        ], fn($v) => $v !== null);
    }
}
