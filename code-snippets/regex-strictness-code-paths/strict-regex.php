public const string DATA_URI_REGEX = '%^
    data:                           # Required "data:" prefix
    (?<mime>[a-z]+\/[a-z0-9.+-]+)   # Required MIME type (named: mime)
    (                               # Optional parameters group
        ;[a-z0-9.+-]+=              # Parameter name (;key=)
        (                           # Parameter value can be:
            ([a-z0-9.+-]+)          #   - Unquoted value
            |                       #   OR
            "(([^"\\]|\\.)*)"       #   - Quoted value with escape support
        )
    )*                              # Zero or more parameters
    ;base64,                        # Required ";base64," marker
    (?<data>                        # Base64 data (named: data)
        ([A-Za-z0-9+/]{4})*         #   - Groups of 4 chars
        (                           #   - Optional padding:
            [A-Za-z0-9+/]{2}==      #     * 2 chars + ==
            |                       #     OR
            [A-Za-z0-9+/]{3}=       #     * 3 chars + =
        )?                          #   - Padding is optional
    )
$%ix';