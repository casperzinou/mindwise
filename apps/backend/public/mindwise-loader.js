// Mindwise Chatbot Widget Loader
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
  
  // Create loader container
  const loaderContainer = document.createElement('div');
  loaderContainer.id = 'mindwise-loader-container';
  loaderContainer.style.cssText = `
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
  loaderContainer.innerHTML = `
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="white"/>
      <path d="M11 10H13V8H11V10ZM11 6H13V4H11V6ZM7 10H9V8H7V10ZM7 6H9V4H7V6ZM15 10H17V8H15V10ZM15 6H17V4H15V6Z" fill="white"/>
    </svg>
  `;
  
  loaderContainer.addEventListener('mouseenter', () => {
    loaderContainer.style.transform = 'scale(1.05)';
    loaderContainer.style.boxShadow = '0 6px 16px rgba(37, 99, 235, 0.4)';
  });
  
  loaderContainer.addEventListener('mouseleave', () => {
    loaderContainer.style.transform = 'scale(1)';
    loaderContainer.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.3)';
  });
  
  // Add loader to the page
  document.body.appendChild(loaderContainer);
  
  // Load the main chat widget
  function loadChatWidget() {
    // Remove loader
    if (loaderContainer.parentNode) {
      loaderContainer.parentNode.removeChild(loaderContainer);
    }
    
    // Create script element for main widget
    const script = document.createElement('script');
    script.src = `${apiUrl.replace('/api', '')}/mindwise-chat.js`;
    script.onload = function() {
      console.log('[Mindwise Chatbot]: Main widget loaded successfully');
    };
    script.onerror = function() {
      console.error('[Mindwise Chatbot]: Error loading main widget');
      // Show error message
      const errorContainer = document.createElement('div');
      errorContainer.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        padding: 16px;
        background: #fee2e2;
        color: #b91c1c;
        border: 1px solid #fecaca;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        z-index: 10001;
        font-size: 14px;
      `;
      errorContainer.innerHTML = `
        <strong>Mindwise Chatbot Error</strong><br>
        Failed to load chat widget. Please check your connection and try again.
        <button onclick="this.parentElement.remove()" style="
          float: right;
          background: none;
          border: none;
          color: #b91c1c;
          cursor: pointer;
          font-weight: bold;
        ">&times;</button>
      `;
      document.body.appendChild(errorContainer);
    };
    document.head.appendChild(script);
  }
  
  // Load widget when loader is clicked
  loaderContainer.addEventListener('click', loadChatWidget);
  
  console.log('[Mindwise Chatbot]: Loader initialized successfully');
})();