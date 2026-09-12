// What gets assembled for EVERY single request
const contextSentToLLM = {
  // Fixed instructions (stays constant ~2,000 tokens)
  systemPrompt: "You are Claude Code, an AI assistant...",

  // THIS BECOMES MASSIVE! (grows with every message)
  conversationHistory: [
    { role: "user", content: "Help me debug this function" },
    { role: "assistant", content: "I'll analyse your function..." },
    { role: "user", content: "It's still not working" },
    { role: "assistant", content: "Let me check the error..." },
    // ... 50 more messages later ...
    { role: "user", content: "npm test\n[500 lines of output]" },
    { role: "assistant", content: "[2000 token response]" },
    { role: "user", content: "git diff\n[300 lines of changes]" },
    // ... another 30 messages ...
    { role: "user", content: "Can you read these 5 files?" },
    { role: "assistant", content: "[10,000 tokens of file content]" },
    // By now: 50,000+ tokens of conversation history
  ],

  // Your innocent new message (but processed with ALL the above)
  currentMessage: { role: "user", content: "What about line 42?" }
}
