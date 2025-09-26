// Lenient: allows spaces, path traversal, hidden files
public const string ATTACHMENT_FILENAME_REGEX = '%^[^ /]+\.\w{3,5}%';

// Strict: rejects dangerous patterns up front
public const string FILENAME_REGEX = '%^(?!\.)(?!.*\.\.)([^\/\s]+)\.[A-Za-z0-9]{3,5}$%';