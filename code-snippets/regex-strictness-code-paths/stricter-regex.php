// Strictest: No optional anything
public const string DATA_URI_REGEX = '%^
    data:                           # Required "data:" prefix
    ([a-z]+\/[a-z0-9.+-]+)          # Required MIME type (type/subtype)
    ;base64,                        # Required ";base64," marker (no params)
    ([A-Za-z0-9+/]{4})+             # Base64 data (at least one group of 4)
    (                               # Required padding:
        [A-Za-z0-9+/]{2}==          #   - 2 chars + == (for length % 4 == 2)
        |                           #   OR
        [A-Za-z0-9+/]{3}=           #   - 3 chars + = (for length % 4 == 3)
    )
$%ix';