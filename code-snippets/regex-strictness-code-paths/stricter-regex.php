// Strictest: No optional anything, named capture groups, filename embedded
public const string ATTACHMENT_REGEX = '%^
    (?<filename>                        # Filename (named: filename)
        (?!\.)                          #   - Cannot start with dot
        (?!.*\.\.)                      #   - No ".." path traversal
        [^\/\s]+                        #   - No slashes or whitespace
        \.                              #   - Extension separator
        [A-Za-z0-9]{3,5}                #   - 3-5 char extension
    )
    :                                   # Separator between filename and data URI
    data:                               # Required "data:" prefix
    (?<mime>[a-z]+\/[a-z0-9.+-]+)       # Required MIME type (named: mime)
    ;base64,                            # Required ";base64," marker (no params)
    (?<data>                            # Base64 data (named: data)
        ([A-Za-z0-9+/]{4})+             #   - At least one group of 4 chars
        (                               #   - Required padding:
            [A-Za-z0-9+/]{2}==          #     * 2 chars + ==
            |                           #     OR
            [A-Za-z0-9+/]{3}=           #     * 3 chars + =
        )
    )
$%ix';