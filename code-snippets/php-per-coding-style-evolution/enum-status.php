enum Status: string
{
    case Draft = 'draft';
    case Published = 'published';
    case Archived = 'archived';

    public function isActive(): bool
    {
        return $this === self::Published;
    }
}
