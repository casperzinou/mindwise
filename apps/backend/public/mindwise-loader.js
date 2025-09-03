// Mindwise Chatbot Loader
// Powered by Mindwise - https://mindwise-demo.pages.dev/
(function() {
  // Configuration
  const config = window.mindwiseBot || {};
  const botId = config.botId;
  const apiUrl = config.apiUrl || 'http://localhost:3001/api';
  const scriptSrc = config.scriptSrc || 'http://localhost:3001/mindwise-chat.js';
  
  if (!botId) {
    console.error('[Mindwise Chatbot]: botId is required');
    return;
  }
  
  // Create a promise to handle initialization
  window.mindwiseBotReady = new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (document.getElementById('mindwise-chat-script')) {
      console.warn('[Mindwise Chatbot]: Script already loaded');
      resolve();
      return;
    }
    
    // Create script element
    const script = document.createElement('script');
    script.id = 'mindwise-chat-script';
    script.src = scriptSrc;
    script.async = true;
    
    // Set up event listeners
    script.onload = function() {
      console.log('[Mindwise Chatbot]: Script loaded successfully');
      resolve();
    };
    
    script.onerror = function(error) {
      console.error('[Mindwise Chatbot]: Failed to load script', error);
      reject(new Error('Failed to load chat widget script'));
    };
    
    // Append script to head
    document.head.appendChild(script);
  });
  
  // Expose initialization function
  window.mindwiseBotInit = function() {
    return window.mindwiseBotReady;
  };
  
  console.log('[Mindwise Chatbot]: Loader initialized');
})();