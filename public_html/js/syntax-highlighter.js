/**
 * Lightweight syntax highlighter for PHP code blocks
 * Optimized for modern PHP 8.3+ syntax
 */
class SyntaxHighlighter {
    constructor() {
        this.patterns = {
            // PHP tags
            phpTags: /(&lt;\?php|&lt;\?=|\?&gt;)/g,
            
            // Keywords
            keywords: /\b(abstract|and|array|as|break|callable|case|catch|class|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|new|or|print|private|protected|public|readonly|require|require_once|return|static|switch|throw|trait|try|unset|use|var|while|xor|yield|from)\b/g,
            
            // Types
            types: /\b(string|int|float|bool|array|object|mixed|never|void|null|false|true|self|parent|static|iterable|callable)\b/g,
            
            // Attributes
            attributes: /#\[\s*[\w\\]+[^\]]*\]/g,
            
            // Strings
            strings: /(["'])((?:\\.|(?!\1)[^\\])*?)\1/g,
            
            // Comments
            comments: /(\/\/.*$|\/\*[\s\S]*?\*\/|#.*$)/gm,
            
            // Variables
            variables: /\$[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/g,
            
            // Numbers
            numbers: /\b(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g,
            
            // Operators
            operators: /(\+\+|--|===|!==|==|!=|<=|>=|<=>|&&|\|\||[+\-*\/%<>=!&|^~])/g,
            
            // Functions
            functions: /\b([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\s*(?=\()/g,
            
            // Class names
            classes: /\b([A-Z][a-zA-Z0-9_]*)\b/g,
            
            // Constants
            constants: /\b([A-Z_][A-Z0-9_]*)\b/g,
            
            // Namespaces
            namespaces: /\\?([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*\\)+/g
        };
        
        this.init();
    }
    
    init() {
        // Find all code blocks and highlight them
        document.querySelectorAll('pre code').forEach(block => {
            this.highlightBlock(block);
        });
        
        // Also handle plain pre blocks
        document.querySelectorAll('pre:not(:has(code))').forEach(block => {
            this.highlightBlock(block);
        });
    }
    
    highlightBlock(block) {
        let code = block.innerHTML;
        
        // Escape HTML entities first
        code = code.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;');
        
        // Apply syntax highlighting
        code = this.applyHighlighting(code);
        
        block.innerHTML = code;
        block.classList.add('syntax-highlighted');
    }
    
    applyHighlighting(code) {
        // Apply highlighting in specific order to avoid conflicts
        
        // 1. Comments (do first to avoid highlighting inside them)
        code = code.replace(this.patterns.comments, '<span class="comment">$1</span>');
        
        // 2. Strings
        code = code.replace(this.patterns.strings, '<span class="string">$1$2$1</span>');
        
        // 3. PHP tags
        code = code.replace(this.patterns.phpTags, '<span class="php-tag">$1</span>');
        
        // 4. Attributes
        code = code.replace(this.patterns.attributes, '<span class="attribute">$&</span>');
        
        // 5. Keywords
        code = code.replace(this.patterns.keywords, '<span class="keyword">$1</span>');
        
        // 6. Types
        code = code.replace(this.patterns.types, '<span class="type">$1</span>');
        
        // 7. Variables
        code = code.replace(this.patterns.variables, '<span class="variable">$&</span>');
        
        // 8. Numbers
        code = code.replace(this.patterns.numbers, '<span class="number">$1</span>');
        
        // 9. Functions
        code = code.replace(this.patterns.functions, '<span class="function">$1</span>');
        
        // 10. Classes
        code = code.replace(this.patterns.classes, '<span class="class">$1</span>');
        
        // 11. Constants
        code = code.replace(this.patterns.constants, '<span class="constant">$1</span>');
        
        // 12. Namespaces
        code = code.replace(this.patterns.namespaces, '<span class="namespace">$1</span>');
        
        // 13. Operators
        code = code.replace(this.patterns.operators, '<span class="operator">$1</span>');
        
        return code;
    }
}

// Initialize syntax highlighter when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SyntaxHighlighter();
});