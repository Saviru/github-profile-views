const { put, list, get } = require('@vercel/blob');

module.exports = async (req, res) => {
  try {
    // Get the current date and time in UTC
    const now = new Date();
    const formattedDateTime = now.toISOString()
      .replace('T', ' ')
      .replace(/\.\d+Z$/, '');


    // Username for the SVG  
    const username = "Saviru";

    console.log("Formatted DateTime:", formattedDateTime);
    
    // File name for the counter
    const COUNTER_KEY = "saviru-visits";
    
    // Find the current counter value
    let viewCounter = 0;
    let counterFound = false;
    
    try {
      // List all existing blobs to find our counter file
      const { blobs } = await list({ prefix: COUNTER_KEY });
      
      const sortedBlobs = blobs.sort((a, b) => 
        new Date(b.uploadedAt) - new Date(a.uploadedAt)
      );
      
      if (sortedBlobs.length > 0) {
        // Get the most recent counter file
        const latestBlob = sortedBlobs[0];
        
        // Fetch the content directly
        const response = await fetch(latestBlob.url);
        const text = await response.text();
        
        // Parse the counter value
        const parsed = parseInt(text.trim(), 10);
        if (!isNaN(parsed)) {
          viewCounter = parsed;
          counterFound = true;
        }
      }
    } catch (error) {
      console.error("Error reading counter:", error);
    }
    

    viewCounter++;
    
    // Read and save file (path)
    const timestamp = Date.now();
    const newCounterPath = `${COUNTER_KEY}-${timestamp}.txt`;
    
    try {
      await put(
        newCounterPath,
        Buffer.from(viewCounter.toString()),
        {
          access: 'public',
          contentType: 'text/plain',
          addRandomSuffix: false
        }
      );
    } catch (error) {
      console.error("Error updating counter:", error);
    }
    
  
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="70" viewBox="0 0 180 70" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#021D4A"/>
      <stop offset="100%" stop-color="#520806"/>
    </linearGradient>
    
    <!-- Animated Gradients -->
    <linearGradient id="animGradient" x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="rgba(254, 66, 142, 0)" stop-opacity="0">
        <animate attributeName="stop-color" values="rgba(254,66,142,0); rgba(254,66,142,0.3); rgba(254,66,142,0)" dur="8s" repeatCount="indefinite" />
      </stop>
      <stop offset="50%" stop-color="rgba(254, 66, 142, 0.3)" stop-opacity="0.3">
        <animate attributeName="stop-color" values="rgba(254,66,142,0.3); rgba(254,66,142,0); rgba(254,66,142,0.3)" dur="8s" repeatCount="indefinite" />
      </stop>
      <stop offset="100%" stop-color="rgba(254, 66, 142, 0)" stop-opacity="0">
        <animate attributeName="stop-color" values="rgba(254,66,142,0); rgba(254,66,142,0.3); rgba(254,66,142,0)" dur="8s" repeatCount="indefinite" />
      </stop>
      <animate attributeName="x1" values="0%;100%;0%" dur="12s" repeatCount="indefinite" />
      <animate attributeName="y1" values="0%;100%;0%" dur="10s" repeatCount="indefinite" />
    </linearGradient>
    
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
    
    <filter id="starGlow" x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="0.8" />
    </filter>

    <!-- Pattern for the background -->
    <pattern id="starsPattern" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="0.5" fill="white" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
      </circle>
      <circle cx="25" cy="20" r="0.3" fill="white" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="5s" repeatCount="indefinite" />
      </circle>
      <circle cx="40" cy="15" r="0.4" fill="white" opacity="0.5">
        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="15" cy="40" r="0.3" fill="white" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="6s" repeatCount="indefinite" />
      </circle>
      <circle cx="35" cy="35" r="0.4" fill="white" opacity="0.3">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="7s" repeatCount="indefinite" />
      </circle>
    </pattern>
    
    <style>
      @keyframes fadeIn {
        0% { opacity: 0; transform: translateY(10px); }
        100% { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.05); opacity: 0.9; }
      }
      
      @keyframes shimmer {
        0% { stroke-dashoffset: 100; }
        100% { stroke-dashoffset: 0; }
      }
      
      @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      
      .container {
        animation: fadeIn 0.8s ease-out forwards;
      }
      
      .counter-text {
        font-family: Arial;
        font-size: 16px;
        font-weight: bold;
        fill: #FE428E;
        text-anchor: middle;
        filter: url(#glow);
        animation: pulse 4s infinite, float 6s infinite;
      }
      
      .regular-text {
        font-family: Arial;
        fill: #F8D847;
        text-anchor: middle;
      }
      
      .debug-text {
        font-family: Arial;
        font-size: 6px;
        fill: rgba(255,255,255,0.5);
        text-anchor: middle;
      }
      
      .star {
        filter: url(#starGlow);
      }
      
      .star-small {
        animation: pulse 3s infinite, float 8s infinite;
      }
      
      .star-medium {
        animation: pulse 5s infinite, float 10s infinite;
      }
      
      .star-large {
        animation: pulse 7s infinite, float 12s infinite;
      }
      
      .orbit {
        animation: rotate 30s linear infinite;
        transform-origin: 90px 38px;
      }
      
      .border-effect {
        stroke-dasharray: 4;
        animation: shimmer 30s linear infinite;
      }
    </style>
  </defs>
  

  <g class="container">
    <rect x="0" y="0" width="180" height="70" rx="6" ry="6" fill="url(#mainGradient)"/>
    
 
    <rect x="0" y="0" width="180" height="70" rx="6" ry="6" fill="url(#starsPattern)" opacity="0.6"/>
    
    <rect x="0" y="0" width="180" height="70" rx="6" ry="6" fill="url(#animGradient)" opacity="0.5"/>
    
    <!-- Border Animation -->
    <rect x="1" y="1" width="178" height="68" rx="5" ry="5" fill="none" 
          stroke="#FE428E" stroke-width="0.5" opacity="0.3" class="border-effect"/>
    
    <!-- Orbiting Element -->
    <g class="orbit">
      <circle cx="140" cy="38" r="2" fill="#1EDBDA" opacity="0.6" class="star"/>
    </g>
    
    <!-- Background Stars -->
    <circle cx="20" cy="15" r="0.7" fill="white" opacity="0.8" class="star star-small"/>
    <circle cx="160" cy="25" r="0.9" fill="#F8D847" opacity="0.7" class="star star-medium"/>
    <circle cx="40" cy="55" r="0.6" fill="#1EDBDA" opacity="0.6" class="star star-small"/>
    <circle cx="140" cy="60" r="0.8" fill="white" opacity="0.7" class="star star-medium"/>
    <circle cx="110" cy="12" r="1" fill="#FE428E" opacity="0.6" class="star star-large"/>
    <circle cx="30" cy="40" r="0.7" fill="#F8D847" opacity="0.5" class="star star-medium"/>
    <circle cx="70" cy="58" r="0.8" fill="white" opacity="0.7" class="star star-small"/>
    
    
    <!-- Content -->
    <text class="regular-text" x="90" y="18" font-size="11" font-weight="bold">${username}'s Profile Views</text>
    <text class="counter-text" x="90" y="38">${viewCounter}</text>
    <text class="regular-text" x="90" y="54" font-size="8">Last visit: ${formattedDateTime} UTC</text>
    <text class="debug-text" x="90" y="66">Copyright (c) S.K.Atapattu</text>
  </g>
</svg>`;
    
    // anti-caching headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('ETag', `"${timestamp}"`);
    res.setHeader('Vary', '*');
    
    // Return the SVG with debug info
    res.status(200).send(svg);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(`<?xml version="1.0" encoding="UTF-8"?>
<svg width="180" height="60" viewBox="0 0 180 60" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="180" height="60" rx="6" ry="6" fill="#ff5555"/>
  <text x="90" y="35" font-family="Arial" font-size="10" fill="white" text-anchor="middle">Error: ${error.message}</text>
</svg>`);
  }
};