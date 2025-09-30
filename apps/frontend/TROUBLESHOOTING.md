# Troubleshooting Chatbot Widget Issues

## Common Widget Problems and Solutions

### 1. Widget Not Appearing

**Symptoms:**
- Script is loaded but widget doesn't appear
- No errors in console
- Widget container exists in DOM but is hidden

**Root Causes and Solutions:**

1. **Static File Serving Issues**:
   - Ensure backend serves widget files correctly
   - Check that `/mindwise-chat.js` is accessible
   - Verify `express.static()` is configured properly

2. **CORS Configuration**:
   - Ensure backend allows requests from frontend domain
   - Check CORS headers in network requests

3. **JavaScript Errors**:
   - Open browser dev tools (F12) → Console tab
   - Look for any errors related to the widget
   - Check for blocked mixed content (HTTP vs HTTPS)

4. **Incorrect Bot ID**:
   - Verify botId in widget configuration
   - Check that bot exists in database
   - Ensure bot has been trained successfully

### 2. Widget Loading but Non-functional

**Symptoms:**
- Widget appears but chat doesn't work
- Messages aren't sent or received
- Loading indicators spin indefinitely

**Root Causes and Solutions:**

1. **API Endpoint Issues**:
   - Check if backend API is running
   - Verify API URLs in widget configuration
   - Test endpoints with tools like Postman

2. **Authentication Problems**:
   - Ensure bot is properly configured
   - Check database connections
   - Verify Supabase credentials

3. **Network/Firewall Issues**:
   - Check internet connectivity
   - Verify firewall settings
   - Test from different networks

### 3. Widget Positioning Issues

**Symptoms:**
- Widget appears in wrong position
- Widget overlaps with other elements
- Widget is cut off or partially visible

**Root Causes and Solutions:**

1. **CSS Conflicts**:
   - Check for conflicting z-index values
   - Inspect widget styles with dev tools
   - Look for inherited styles that affect positioning

2. **Responsive/Viewport Issues**:
   - Test on different screen sizes
   - Check CSS media queries
   - Adjust for mobile devices

## Debugging Checklist

### 1. Browser Console Inspection
```javascript
// Open dev tools and check for errors
console.log('Widget loaded:', window.mindwiseBot);

// Check if script is loaded
document.querySelectorAll('script[src*="mindwise-chat"]').forEach(script => {
  console.log('Found chat widget script:', script.src);
});
```

### 2. Network Requests Verification
- Open Dev Tools → Network tab
- Reload page
- Filter by "mindwise-chat.js"
- Check for 404, 403, or CORS errors
- Verify file is loaded successfully

### 3. DOM Element Inspection
```javascript
// Check if widget elements exist
console.log('Chat container:', document.getElementById('mindwise-chat-container'));
console.log('Toggle button:', document.getElementById('mindwise-toggle-btn'));

// Check widget styles
const container = document.getElementById('mindwise-chat-container');
if (container) {
  console.log('Container styles:', window.getComputedStyle(container));
}
```

### 4. API Endpoint Testing
```bash
# Test if backend is accessible
curl -I http://localhost:3001/mindwise-chat.js

# Test chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"botId": "YOUR_BOT_ID", "query": "test"}'
```

## Verification Steps

### 1. Check Static File Serving
```bash
# Verify widget files are accessible
curl -s http://localhost:3001/mindwise-chat.js | head -n 5
curl -s http://localhost:3001/mindwise-chat.css | head -n 5
```

### 2. Validate Widget Configuration
```html
<!-- Correct widget configuration -->
<script>
  window.mindwiseBot = {
    botId: "YOUR_VALID_BOT_ID",
    apiUrl: "http://localhost:3001/api"
  };
  (function(){var s=document.createElement('script');s.src='http://localhost:3001/mindwise-chat.js';document.head.appendChild(s);})();
</script>
```

### 3. Backend Status Check
```bash
# Ensure backend is running
netstat -an | grep 3001

# Check backend logs for errors
# Look for "Server is running at http://localhost:3001"
```

### 4. Database Verification
```sql
-- Check if bot exists
SELECT id, name FROM chatbots WHERE id = 'YOUR_BOT_ID';

-- Check if bot has been trained
SELECT status FROM jobs WHERE bot_id = 'YOUR_BOT_ID' ORDER BY created_at DESC LIMIT 1;

-- Check if documents exist for this bot
SELECT COUNT(*) FROM documents WHERE metadata->>'bot_id' = 'YOUR_BOT_ID';
```

## Common Fixes

### 1. Clear Browser Cache
- Hard refresh (Ctrl+F5 or Cmd+Shift+R)
- Clear browser cache and cookies
- Test in incognito/private browsing mode

### 2. Verify Widget Version
- Ensure using latest widget version
- Update widget files if needed
- Check for breaking changes in new versions

### 3. Check Dependencies
- Ensure all required libraries are loaded
- Check for conflicting JavaScript libraries
- Update dependencies if needed

### 4. Environment Configuration
- Verify all environment variables are set
- Check SUPABASE_URL and SUPABASE_SERVICE_KEY
- Ensure API keys are valid

## Advanced Troubleshooting

### 1. Enable Verbose Logging
Add debug flags to widget configuration:
```javascript
window.mindwiseBot = {
  botId: "YOUR_BOT_ID",
  apiUrl: "http://localhost:3001/api",
  debug: true // Enable verbose logging
};
```

### 2. Manual Widget Initialization
```javascript
// Manually initialize widget for debugging
if (typeof window.initializeMindwiseChatbot === 'function') {
  window.initializeMindwiseChatbot();
} else {
  console.log('Widget initialization function not found');
}
```

### 3. Check Widget Events
```javascript
// Listen for widget events
document.addEventListener('mindwise-widget-loaded', function(e) {
  console.log('Widget loaded event:', e.detail);
});

document.addEventListener('mindwise-widget-error', function(e) {
  console.log('Widget error event:', e.detail);
});
```

## Contact Support

If you're still experiencing issues after trying these solutions, please provide:

1. Screenshot of the widget issue
2. Browser console errors
3. Network request failures
4. Your widget configuration code
5. Backend logs (if accessible)
6. Steps to reproduce the issue

Our support team will help you resolve the issue as quickly as possible.