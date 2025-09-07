'use client';

export default function Error() {
  return (
    <html>
      <body>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          textAlign: 'center',
          padding: '20px',
          fontFamily: 'sans-serif'
        }}>
          <h1>500 - Server Error</h1>
          <p>Something went wrong on our end. Please try again later.</p>
          <a href="/" style={{ 
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px'
          }}>
            Go back home
          </a>
        </div>
      </body>
    </html>
  );
}