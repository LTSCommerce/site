class User
{
    public string $name {
        get => $this->firstName . ' ' . $this->lastName;
        set => [$this->firstName, $this->lastName] = explode(' ', $value, 2);
    }
}
