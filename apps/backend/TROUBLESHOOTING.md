# Troubleshooting Chatbot Widget Issues

## Common Issues and Solutions

### 1. Widget Not Appearing

**Symptoms**: 
- Script is loaded but widget doesn't appear
- No errors in console
- Widget container exists in DOM but is hidden

**Possible Causes and Solutions**:

1. **CSS Conflicts**:
   - Check if your website's CSS is overriding the widget styles
   - Use browser dev tools to inspect the widget container
   - Look for `display: none` or `visibility: hidden` properties

2. **JavaScript Errors**:
   - Open browser dev tools (F12) and check the Console tab
   - Look for any errors related to the chatbot widget
   - Check if all required dependencies are loading

3. **Incorrect Bot ID**:
   - Verify that the `botId` in the widget configuration is correct
   - Check that the bot exists in your database
   - Ensure the bot has been trained successfully

4. **CORS Issues**:
   - Check Network tab for blocked requests
   - Ensure your backend allows requests from your website's domain
   - Verify API endpoints are accessible

### 2. Widget Loading but Not Functional

**Symptoms**:
- Widget appears but chat doesn't work
- Messages aren't sent or received
- Loading indicators spin indefinitely

**Possible Causes and Solutions**:

1. **API Endpoint Issues**:
   - Check if the backend API is running
   - Verify API URLs in widget configuration
   - Test API endpoints directly with tools like Postman

2. **Authentication Problems**:
   - Ensure the bot is properly configured
   - Check that the bot has access to its documents
   - Verify database connections

3. **Network Issues**:
   - Check internet connectivity
   - Verify firewall settings
   - Test API endpoints from different networks

### 3. Widget Positioning Issues

**Symptoms**:
- Widget appears in wrong position
- Widget overlaps with other elements
- Widget is cut off or partially visible

**Possible Causes and Solutions**:

1. **CSS Z-Index Conflicts**:
   - Increase the widget's z-index value
   - Check for other elements with high z-index values
   - Use browser dev tools to adjust z-index temporarily

2. **Viewport/Responsive Issues**:
   - Test on different screen sizes
   - Check CSS media queries
   - Adjust widget positioning for mobile devices

### Debugging Steps

1. **Check Browser Console**:
   ```javascript
   // Open dev tools and look for errors
   console.log('Widget loaded:', window.mindwiseBot);
   ```

2. **Verify Script Loading**:
   - Check Network tab for script requests
   - Ensure no 404 errors for widget files
   - Verify correct script URL

3. **Test API Endpoints**:
   ```bash
   # Test chat endpoint
   curl -X POST http://localhost:3001/api/chat \\
     -H "Content-Type: application/json" \\
     -d '{"botId": "YOUR_BOT_ID", "query": "test"}'
   ```

4. **Check Widget Configuration**:
   ```html
   <script>
     window.mindwiseBot = {
       botId: "YOUR_CORRECT_BOT_ID",
       apiUrl: "http://localhost:3001/api"
     };
     (function(){var s=document.createElement('script');s.src='http://localhost:3001/mindwise-chat.js';document.head.appendChild(s);})();
   </script>
   ```

### Advanced Debugging

1. **Enable Verbose Logging**:
   Add debug flags to your widget configuration:
   ```javascript
   window.mindwiseBot = {
     botId: "YOUR_BOT_ID",
     apiUrl: "http://localhost:3001/api",
     debug: true // Enable verbose logging
   };
   ```

2. **Check Database Records**:
   Verify that your bot has been trained and documents exist:
   ```sql
   -- Check if bot exists
   SELECT * FROM chatbots WHERE id = 'YOUR_BOT_ID';
   
   -- Check if documents exist for this bot
   SELECT COUNT(*) FROM documents WHERE metadata->>'bot_id' = 'YOUR_BOT_ID';
   
   -- Check if jobs completed successfully
   SELECT * FROM jobs WHERE bot_id = 'YOUR_BOT_ID' ORDER BY created_at DESC LIMIT 5;
   ```

3. **Test Backend Services**:
   ```bash
   # Test if backend is running
   curl http://localhost:3001
   
   # Test specific endpoints
   curl http://localhost:3001/api/chatbot/YOUR_BOT_ID
   ```

### Common Fixes

1. **Clear Browser Cache**:
   - Hard refresh (Ctrl+F5 or Cmd+Shift+R)
   - Clear browser cache and cookies
   - Test in incognito/private browsing mode

2. **Check Widget Version**:
   - Ensure you're using the latest widget version
   - Update widget files if needed
   - Check for breaking changes in new versions

3. **Verify Dependencies**:
   - Ensure all required libraries are loaded
   - Check for conflicting JavaScript libraries
   - Update dependencies if needed

### Contact Support

If you're still experiencing issues after trying these solutions, please provide:

1. Screenshot of the widget issue
2. Browser console errors
3. Network request failures
4. Your widget configuration code
5. Backend logs (if accessible)
6. Steps to reproduce the issue

Our support team will help you resolve the issue as quickly as possible.