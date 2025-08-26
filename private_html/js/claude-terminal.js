// Claude Code Terminal Animation
(function() {
    const terminalContainer = document.getElementById('claude-terminal');
    if (!terminalContainer) return;

    const conversations = [
        {
            user: "Help me integrate AI into my tech business",
            thinking: true,
            response: "I see you're looking to leverage AI for competitive advantage. Let me analyze your needs...\n\nBased on my experience with enterprise teams, here are the key areas where AI can transform your business:\n\n1. **Development Velocity**: Claude Code can accelerate your team's output by 40-60% on routine tasks\n2. **Code Quality**: Automated reviews catch bugs before they reach production\n3. **Knowledge Management**: AI can help document and share institutional knowledge\n4. **Customer Support**: Intelligent automation for technical inquiries\n\nThe real power comes from strategic implementation. That's where my consultancy helps - ensuring you adopt AI in ways that actually move the needle for your specific challenges."
        },
        {
            user: "What makes your approach different from generic AI training?",
            thinking: false,
            response: "Great question. Here's what sets my consultancy apart:\n\n**Real-world experience**: I've been coding professionally for 20+ years. I understand the challenges your team faces because I've faced them too.\n\n**Tailored to YOUR stack**: No generic examples. We work with your actual codebase, your tools, your deployment pipeline.\n\n**Beyond the basics**: While others teach \"how to prompt\", I show you how to architect AI-augmented workflows that scale.\n\n**Strategic focus**: I help CTOs and tech leads make informed decisions about AI adoption, not just tactical implementation.\n\nThink of me as a bridge between cutting-edge AI capabilities and practical, production-ready solutions."
        },
        {
            user: "How quickly can my team see results?",
            thinking: true,
            response: "Most teams see immediate productivity gains within the first session. Here's a typical timeline:\n\n**Day 1**: Your team learns to delegate routine tasks to Claude Code\n**Week 1**: Custom commands built for your specific workflows\n**Month 1**: 30-40% reduction in time spent on boilerplate and repetitive code\n**Quarter 1**: Fully integrated AI workflow with measurable ROI\n\nThe key is starting with high-impact, low-risk implementations. We identify quick wins first, build confidence, then tackle more complex integrations.\n\nI provide ongoing support throughout this journey, ensuring sustainable adoption rather than just initial excitement."
        },
        {
            user: "What about data security and compliance?",
            thinking: false,
            response: "Security is non-negotiable. My consultancy covers:\n\n• **Data governance frameworks** for AI tool usage\n• **Self-hosting options** for sensitive environments\n• **Compliance strategies** for GDPR, HIPAA, SOC2\n• **Code review processes** to catch AI-generated vulnerabilities\n• **Team policies** for responsible AI usage\n\nI help you leverage AI's power while maintaining enterprise-grade security. We'll establish clear guidelines on what can and cannot be processed by AI tools.\n\nFor highly regulated industries, I can design fully air-gapped AI workflows that keep your data completely on-premise."
        }
    ];

    let currentConversation = 0;
    let currentChar = 0;
    let isTyping = false;
    let isPaused = false;

    function initTerminal() {
        terminalContainer.innerHTML = `
            <div class="terminal-window">
                <div class="terminal-header">
                    <div class="terminal-controls">
                        <span class="terminal-control close"></span>
                        <span class="terminal-control minimize"></span>
                        <span class="terminal-control maximize"></span>
                    </div>
                    <div class="terminal-title">claude-code</div>
                </div>
                <div class="terminal-body">
                    <div class="terminal-content"></div>
                    <div class="terminal-input-line">
                        <span class="terminal-prompt">$</span>
                        <span class="terminal-input"></span>
                        <span class="terminal-cursor"></span>
                    </div>
                </div>
            </div>
        `;
        
        const terminalContent = terminalContainer.querySelector('.terminal-content');
        const terminalInput = terminalContainer.querySelector('.terminal-input');
        const terminalCursor = terminalContainer.querySelector('.terminal-cursor');
        
        // Start animation when terminal is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !isTyping) {
                    startConversation();
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(terminalContainer);
    }

    function typeText(element, text, callback, speed = 30) {
        if (isPaused) return;
        
        isTyping = true;
        let index = 0;
        const lines = text.split('\n');
        let currentLine = 0;
        let currentLineChar = 0;
        
        function typeChar() {
            if (isPaused) {
                isTyping = false;
                return;
            }
            
            if (currentLine < lines.length) {
                if (currentLineChar < lines[currentLine].length) {
                    // Handle markdown bold
                    if (lines[currentLine].substr(currentLineChar, 2) === '**') {
                        const endIndex = lines[currentLine].indexOf('**', currentLineChar + 2);
                        if (endIndex > -1) {
                            const boldText = lines[currentLine].substring(currentLineChar + 2, endIndex);
                            element.innerHTML += `<strong>${boldText}</strong>`;
                            currentLineChar = endIndex + 2;
                        } else {
                            element.innerHTML += lines[currentLine][currentLineChar];
                            currentLineChar++;
                        }
                    } else if (lines[currentLine][currentLineChar] === '•') {
                        element.innerHTML += '• ';
                        currentLineChar++;
                    } else {
                        element.innerHTML += lines[currentLine][currentLineChar];
                        currentLineChar++;
                    }
                    setTimeout(typeChar, speed);
                } else {
                    // Move to next line
                    currentLine++;
                    currentLineChar = 0;
                    if (currentLine < lines.length) {
                        element.innerHTML += '<br>';
                        setTimeout(typeChar, speed);
                    } else {
                        isTyping = false;
                        if (callback) callback();
                    }
                }
            }
        }
        
        typeChar();
    }

    function showThinkingAnimation(callback) {
        const terminalContent = terminalContainer.querySelector('.terminal-content');
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'terminal-thinking';
        thinkingDiv.innerHTML = '<span class="thinking-text">🤔 Thinking</span><span class="thinking-dots"></span>';
        terminalContent.appendChild(thinkingDiv);
        
        let dots = 0;
        const dotsElement = thinkingDiv.querySelector('.thinking-dots');
        const thinkingInterval = setInterval(() => {
            dots = (dots + 1) % 4;
            dotsElement.textContent = '.'.repeat(dots);
        }, 500);
        
        setTimeout(() => {
            clearInterval(thinkingInterval);
            thinkingDiv.remove();
            callback();
        }, 2000);
    }

    function startConversation() {
        if (currentConversation >= conversations.length || isTyping) return;
        
        const terminalContent = terminalContainer.querySelector('.terminal-content');
        const terminalInput = terminalContainer.querySelector('.terminal-input');
        const conv = conversations[currentConversation];
        
        // Clear input
        terminalInput.textContent = '';
        
        // Type user command
        typeText(terminalInput, `claude "${conv.user}"`, () => {
            // Move command to content area
            const commandDiv = document.createElement('div');
            commandDiv.className = 'terminal-command';
            commandDiv.innerHTML = `<span class="terminal-prompt">$</span> claude "${conv.user}"`;
            terminalContent.appendChild(commandDiv);
            terminalInput.textContent = '';
            
            // Scroll to bottom
            terminalContent.scrollTop = terminalContent.scrollHeight;
            
            // Show thinking or response
            if (conv.thinking) {
                showThinkingAnimation(() => {
                    const responseDiv = document.createElement('div');
                    responseDiv.className = 'terminal-response';
                    terminalContent.appendChild(responseDiv);
                    
                    typeText(responseDiv, conv.response, () => {
                        currentConversation++;
                        if (currentConversation < conversations.length) {
                            setTimeout(startConversation, 2000);
                        } else {
                            // Reset and loop
                            setTimeout(() => {
                                currentConversation = 0;
                                terminalContent.innerHTML = '';
                                startConversation();
                            }, 5000);
                        }
                    });
                });
            } else {
                setTimeout(() => {
                    const responseDiv = document.createElement('div');
                    responseDiv.className = 'terminal-response';
                    terminalContent.appendChild(responseDiv);
                    
                    typeText(responseDiv, conv.response, () => {
                        currentConversation++;
                        if (currentConversation < conversations.length) {
                            setTimeout(startConversation, 2000);
                        } else {
                            // Reset and loop
                            setTimeout(() => {
                                currentConversation = 0;
                                terminalContent.innerHTML = '';
                                startConversation();
                            }, 5000);
                        }
                    });
                }, 500);
            }
        }, 50); // Faster typing for user input
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTerminal);
    } else {
        initTerminal();
    }
})();