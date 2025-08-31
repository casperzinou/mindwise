# Mindwise Static Website

This is a static clone of the Botsonic.com website design, created for the Mindwise chatbot platform.

## Features

- Responsive design based on Botsonic's visual style
- Modern color palette with blue as the primary color
- Clean typography using the Inter font family
- Fully functional chat widget with updated design
- Static HTML/CSS implementation suitable for any hosting platform

## Files Included

- `index.html` - Main landing page
- `login.html` - User login page
- `signup.html` - User registration page
- `styles.css` - Main stylesheet with Botsonic-inspired design

## How to Use

1. Simply upload all files to any static hosting service (Netlify, Vercel, GitHub Pages, etc.)
2. The website will work immediately with no additional configuration needed
3. To customize the chat widget, update the embed code in your dashboard

## Customization

To customize the website for your own brand:

1. Edit the HTML files to change text content
2. Modify the CSS variables in `styles.css` to change colors
3. Replace the "Mindwise" branding with your own

## Chat Widget Integration

To add the Mindwise chat widget to your website, copy the embed code from your dashboard:

```html
<!-- Mindwise Chatbot -->
<script>
  window.mindwiseBot = { 
    botId: "YOUR_BOT_ID",
    apiUrl: "http://localhost:3001/api/chat"
  };
  (function(){var s=document.createElement('script');s.src='http://localhost:3001/mindwise-chat.js';document.head.appendChild(s);})();
</script>
<!-- Powered by Mindwise -->
```

## Deployment

For production deployment:

1. Update the API URLs in the embed code to point to your production backend
2. Host the chat widget files (mindwise-chat.js and mindwise-chat.css) on your production server
3. Update the embed code to reference your production URLs

## Support

For support with the Mindwise platform, contact support@mindwise-demo.pages.dev