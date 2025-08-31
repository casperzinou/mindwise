// Mindwise Chatbot Widget
// Powered by Mindwise - https://mindwise-demo.pages.dev/
(function() {
  // Configuration
  const config = window.mindwiseBot || {};
  const botId = config.botId;
  const apiUrl = config.apiUrl || 'http://localhost:3001/api';
  
  if (!botId) {
    console.error('[Mindwise Chatbot]: botId is required');
    return;
  }
  
  // State variables
  let chatbotInfo = null;
  let isChatOpen = false;
  
  // Create chatbot container
  const chatContainer = document.createElement('div');
  chatContainer.id = 'mindwise-chat-container';
  chatContainer.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 350px;
    height: 500px;
    border: 1px solid #e5e7eb;
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
    background: white;
    display: flex;
    flex-direction: column;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    z-index: 10000;
    overflow: hidden;
  `;
  
  // Create chat header
  const chatHeader = document.createElement('div');
  chatHeader.style.cssText = `
    background: #2563EB;
    color: white;
    padding: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  chatHeader.innerHTML = `
    <div style="font-weight: 600; font-size: 16px;">Chat Assistant</div>
    <button id="mindwise-close-btn" style="
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">&times;</button>
  `;
  
  // Create chat messages area
  const chatMessages = document.createElement('div');
  chatMessages.id = 'mindwise-chat-messages';
  chatMessages.style.cssText = `
    flex: 1;
    padding: 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: #f9fafb;
  `;
  
  // Create chat input area
  const chatInputArea = document.createElement('div');
  chatInputArea.style.cssText = `
    padding: 16px;
    border-top: 1px solid #e5e7eb;
    background: white;
  `;
  
  // Create input field
  const chatInputContainer = document.createElement('div');
  chatInputContainer.style.cssText = `
    display: flex;
    gap: 8px;
  `;
  
  const chatInput = document.createElement('input');
  chatInput.type = 'text';
  chatInput.placeholder = 'Type your message...';
  chatInput.style.cssText = `
    flex: 1;
    padding: 12px 16px;
    border: 1px solid #d1d5db;
    border-radius: 20px;
    outline: none;
    font-size: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  `;
  
  chatInput.addEventListener('focus', () => {
    chatInput.style.borderColor = '#2563EB';
    chatInput.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
  });
  
  chatInput.addEventListener('blur', () => {
    chatInput.style.borderColor = '#d1d5db';
    chatInput.style.boxShadow = 'none';
  });
  
  // Create send button
  const sendButton = document.createElement('button');
  sendButton.textContent = 'Send';
  sendButton.style.cssText = `
    background: #2563EB;
    color: white;
    border: none;
    border-radius: 20px;
    padding: 12px 15px;
    cursor: pointer;
    font-weight: 500;
    font-size: 14px;
    transition: background 0.2s ease;
    min-width: 80px;
  `;
  
  sendButton.addEventListener('mouseenter', () => {
    sendButton.style.background = '#1D4ED8';
  });
  
  sendButton.addEventListener('mouseleave', () => {
    sendButton.style.background = '#2563EB';
  });
  
  // Create toggle button (chat icon)
  const toggleButton = document.createElement('div');
  toggleButton.id = 'mindwise-toggle-btn';
  toggleButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    background: #2563EB;
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
    font-size: 24px;
    z-index: 10001;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  `;
  toggleButton.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
      <path d="M11 10H13V8H11V10ZM11 6H13V4H11V6ZM7 10H9V8H7V10ZM7 6H9V4H7V6ZM15 10H17V8H15V10ZM15 6H17V4H15V6Z" fill="white"/>
    </svg>
  `;
  
  toggleButton.addEventListener('mouseenter', () => {
    toggleButton.style.transform = 'scale(1.05)';
    toggleButton.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
  });
  
  toggleButton.addEventListener('mouseleave', () => {
    toggleButton.style.transform = 'scale(1)';
    toggleButton.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
  });
  
  // Create powered by footer
  const poweredBy = document.createElement('div');
  poweredBy.style.cssText = `
    text-align: center;
    padding: 5px;
    font-size: 10px;
    color: #6B7280;
    background: #f8f9fa;
    border-top: 1px solid #eee;
  `;
  poweredBy.innerHTML = 'Powered by <a href="https://mindwise-demo.pages.dev/" target="_blank" style="color: #2563EB; text-decoration: none;">Mindwise</a>';
  
  // Assemble the chat interface
  chatInputContainer.appendChild(chatInput);
  chatInputContainer.appendChild(sendButton);
  chatInputArea.appendChild(chatInputContainer);
  chatContainer.appendChild(chatHeader);
  chatContainer.appendChild(chatMessages);
  chatContainer.appendChild(chatInputArea);
  chatContainer.appendChild(poweredBy);
  
  // Add elements to the page
  document.body.appendChild(chatContainer);
  document.body.appendChild(toggleButton);
  
  // Hide chat container by default
  chatContainer.style.display = 'none';
  
  // Toggle chat visibility
  toggleButton.addEventListener('click', () => {
    if (isChatOpen) {
      chatContainer.style.display = 'none';
      isChatOpen = false;
    } else {
      chatContainer.style.display = 'flex';
      isChatOpen = true;
      
      // Focus on input when chat opens
      setTimeout(() => {
        chatInput.focus();
      }, 100);
    }
  });
  
  // Close chat
  document.getElementById('mindwise-close-btn').addEventListener('click', () => {
    chatContainer.style.display = 'none';
    isChatOpen = false;
  });
  
  // Add message to chat
  function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
      max-width: 85%;
      padding: 12px 16px;
      border-radius: 18px;
      font-size: 14px;
      line-height: 1.4;
      ${isUser ? 
        'align-self: flex-end; background: #2563EB; color: white; border-bottom-right-radius: 4px;' : 
        'align-self: flex-start; background: white; color: #1F2937; border: 1px solid #e5e7eb; border-bottom-left-radius: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);'
      }
    `;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Show typing indicator
  function showTypingIndicator() {
    const typingIndicator = document.createElement('div');
    typingIndicator.id = 'typing-indicator';
    typingIndicator.style.cssText = `
      align-self: flex-start;
      background: white;
      color: #1F2937;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 12px 16px;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 4px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
      border-bottom-left-radius: 4px;
    `;
    typingIndicator.innerHTML = `
      <div style="display: flex; gap: 4px;">
        <div style="width: 8px; height: 8px; background: #6B7280; border-radius: 50%; animation: typing 1s infinite 0s;"></div>
        <div style="width: 8px; height: 8px; background: #6B7280; border-radius: 50%; animation: typing 1s infinite 0.2s;"></div>
        <div style="width: 8px; height: 8px; background: #6B7280; border-radius: 50%; animation: typing 1s infinite 0.4s;"></div>
      </div>
    `;
    
    // Add animation style
    if (!document.getElementById('typing-animation-style')) {
      const style = document.createElement('style');
      style.id = 'typing-animation-style';
      style.textContent = `
        @keyframes typing {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    chatMessages.appendChild(typingIndicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Hide typing indicator
  function hideTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
      indicator.remove();
    }
  }
  
  // Send message to backend
  async function sendMessage(message) {
    try {
      // Add user message immediately
      addMessage(message, true);
      chatInput.value = '';
      
      // Show typing indicator
      showTypingIndicator();
      
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          botId: botId,
          query: message
        })
      });
      
      // Hide typing indicator
      hideTypingIndicator();
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      const data = await response.json();
      
      // For now, we'll just use the first context as the response
      // In a real implementation, you would use an AI to generate a response
      // based on the contexts
      if (data.contexts && data.contexts.length > 0) {
        // Extract a relevant portion from the context
        const responseText = data.contexts[0].substring(0, 200) + '...';
        addMessage(responseText);
      } else {
        addMessage("I'm sorry, I don't have information about that.");
      }
    } catch (error) {
      console.error('[Mindwise Chatbot]: Error sending message:', error);
      // Hide typing indicator if it exists
      hideTypingIndicator();
      addMessage("Sorry, I'm having trouble connecting. Please try again.");
    }
  }
  
  // Handle send button click
  sendButton.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
      sendMessage(message);
    }
  });
  
  // Handle Enter key in input
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendButton.click();
    }
  });
  
  // Initialize chatbot
  async function initializeChatbot() {
    try {
      // Get chatbot info including language
      const response = await fetch(`${apiUrl}/chatbot/${botId}`);
      if (response.ok) {
        const data = await response.json();
        chatbotInfo = data;
        
        // Add welcome message in the website's language
        setTimeout(() => {
          addMessage(data.greeting || "Hello! I'm your AI assistant. How can I help you today?");
        }, 500);
      } else {
        // Fallback welcome message
        setTimeout(() => {
          addMessage("Hello! I'm your AI assistant. How can I help you today?");
        }, 500);
      }
    } catch (error) {
      console.error('[Mindwise Chatbot]: Error initializing chatbot:', error);
      // Fallback welcome message
      setTimeout(() => {
        addMessage("Hello! I'm your AI assistant. How can I help you today?");
      }, 500);
    }
  }
  
  // Initialize the chatbot when the script loads
  initializeChatbot();
  
  console.log('[Mindwise Chatbot]: Widget loaded successfully - Powered by Mindwise');
})();