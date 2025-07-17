<?php

$finder = PhpCsFixer\Finder::create()
    ->in('../code-snippets')
    ->name('*.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

$config = new PhpCsFixer\Config();
return $config->setRules([
    '@PSR12' => true,
    '@PHP80Migration' => true,
    'array_syntax' => ['syntax' => 'short'],
    'binary_operator_spaces' => [
        'default' => 'single_space',
        'operators' => ['=>' => 'align', '=' => 'align']
    ],
    'blank_line_after_namespace' => true,
    'blank_line_after_opening_tag' => true,
    'blank_line_before_statement' => [
        'statements' => ['return', 'throw', 'try']
    ],
    'cast_spaces' => ['space' => 'single'],
    'class_attributes_separation' => [
        'elements' => [
            'method' => 'one',
            'property' => 'one'
        ]
    ],
    'concat_space' => ['spacing' => 'one'],
    'declare_strict_types' => true,
    'fully_qualified_strict_types' => true,
    'function_typehint_space' => true,
    'general_phpdoc_tag_rename' => true,
    'heredoc_to_nowdoc' => true,
    'include' => true,
    'increment_style' => ['style' => 'post'],
    'linebreak_after_opening_tag' => true,
    'magic_constant_casing' => true,
    'magic_method_casing' => true,
    'method_argument_space' => [
        'on_multiline' => 'ensure_fully_multiline'
    ],
    'native_function_casing' => true,
    'native_function_type_declaration_casing' => true,
    'no_alias_functions' => true,
    'no_blank_lines_after_class_opening' => true,
    'no_blank_lines_after_phpdoc' => true,
    'no_empty_comment' => true,
    'no_empty_phpdoc' => true,
    'no_empty_statement' => true,
    'no_extra_blank_lines' => [
        'tokens' => [
            'curly_brace_block',
            'extra',
            'parenthesis_brace_block',
            'square_brace_block',
            'throw',
            'use'
        ]
    ],
    'no_leading_import_slash' => true,
    'no_leading_namespace_whitespace' => true,
    'no_mixed_echo_print' => ['use' => 'echo'],
    'no_multiline_whitespace_around_double_arrow' => true,
    'no_short_bool_cast' => true,
    'no_singleline_whitespace_before_semicolons' => true,
    'no_spaces_around_offset' => true,
    'no_trailing_comma_in_singleline' => true,
    'no_unneeded_control_parentheses' => true,
    'no_unused_imports' => true,
    'no_whitespace_before_comma_in_array' => true,
    'normalize_index_brace' => true,
    'object_operator_without_whitespace' => true,
    'ordered_imports' => ['sort_algorithm' => 'alpha'],
    'phpdoc_align' => ['align' => 'left'],
    'phpdoc_annotation_without_dot' => true,
    'phpdoc_indent' => true,
    'phpdoc_inline_tag_normalizer' => true,
    'phpdoc_no_access' => true,
    'phpdoc_no_alias_tag' => true,
    'phpdoc_no_empty_return' => true,
    'phpdoc_no_package' => true,
    'phpdoc_no_useless_inheritdoc' => true,
    'phpdoc_return_self_reference' => true,
    'phpdoc_scalar' => true,
    'phpdoc_separation' => true,
    'phpdoc_single_line_var_spacing' => true,
    'phpdoc_summary' => true,
    'phpdoc_tag_type' => true,
    'phpdoc_trim' => true,
    'phpdoc_trim_consecutive_blank_line_separation' => true,
    'phpdoc_types' => true,
    'phpdoc_types_order' => [
        'null_adjustment' => 'always_last',
        'sort_algorithm' => 'none'
    ],
    'phpdoc_var_without_name' => true,
    'return_type_declaration' => true,
    'semicolon_after_instruction' => true,
    'short_scalar_cast' => true,
    'single_class_element_per_statement' => true,
    'single_line_comment_style' => ['comment_types' => ['hash']],
    'single_quote' => true,
    'space_after_semicolon' => ['remove_in_empty_for_expressions' => true],
    'standardize_increment' => true,
    'standardize_not_equals' => true,
    'ternary_operator_spaces' => true,
    'trailing_comma_in_multiline' => true,
    'trim_array_spaces' => true,
    'unary_operator_spaces' => true,
    'whitespace_after_comma_in_array' => true,
])
    ->setFinder($finder)
    ->setRiskyAllowed(true);