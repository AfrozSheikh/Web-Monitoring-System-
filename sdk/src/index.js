

(function() {
  'use strict';
  
  // Default configuration
  const defaultConfig = {
    apiKey: null,
    trackErrors: true,
    trackPerformance: true,
    endpoint: '/api/logs',
    sampleRate: 1.0, // 100% of sessions
    debug: false
  };
  
  // Store the configuration
  let config = { ...defaultConfig };
  
  // Store queued logs before initialization
  let queue = [];
  
  // Check if we should sample this session
  const shouldSample = () => Math.random() <= config.sampleRate;
  
  // Get performance metrics
  const getPerformanceMetrics = () => {
    if (!window.performance || !window.performance.timing) return null;
    
    const timing = window.performance.timing;
    const navigation = window.performance.getEntriesByType('navigation')[0];
    const paint = window.performance.getEntriesByType('paint');
    
    // Calculate various performance metrics
    const loadTime = timing.loadEventEnd - timing.navigationStart;
    const domContentLoaded = timing.domContentLoadedEventEnd - timing.navigationStart;
    const timeToFirstByte = timing.responseStart - timing.navigationStart;
    
    // Get Core Web Vitals if available
    let firstContentfulPaint = null;
    let largestContentfulPaint = null;
    let firstInputDelay = null;
    
    if (paint && paint.length) {
      const fcp = paint.find(entry => entry.name === 'first-contentful-paint');
      if (fcp) firstContentfulPaint = fcp.startTime;
    }
    
    if (window.performance.getEntriesByType) {
      const lcpEntries = window.performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries && lcpEntries.length) {
        largestContentfulPaint = lcpEntries[lcpEntries.length - 1].startTime;
      }
    }
    
    // First Input Delay (simplified)
    if (window.PerformanceEventTiming) {
      const firstInputEntries = performance.getEntriesByType('first-input');
      if (firstInputEntries && firstInputEntries.length) {
        firstInputDelay = firstInputEntries[0].processingStart - firstInputEntries[0].startTime;
      }
    }
    
    return {
      loadTime,
      domContentLoaded,
      timeToFirstByte,
      firstContentfulPaint,
      largestContentfulPaint,
      firstInputDelay
    };
  };
  
  // Error handler
  const errorHandler = (event) => {
    // Skip if we shouldn't track errors or if it's a handled rejection
    if (!config.trackErrors) return;
    
    let errorData = {};
    
    if (event.error) {
      // Standard JavaScript error
      errorData = {
        message: event.error.message,
        source: event.filename || 'unknown',
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error.stack
      };
    } else if (event.reason) {
      // Unhandled promise rejection
      errorData = {
        message: event.reason.message || String(event.reason),
        source: 'promise',
        stack: event.reason.stack
      };
    } else {
      // Other error types
      errorData = {
        message: event.message || 'Unknown error',
        source: event.filename || 'unknown',
        lineno: event.lineno,
        colno: event.colno
      };
    }
    
    errorData.timestamp = new Date().toISOString();
    
    log('error', {
      errorLogs: [errorData]
    });
  };
  
  // Send data to server
  const sendData = (data) => {
    if (!config.apiKey) {
      if (config.debug) console.warn('MonitoringSDK: No API key provided');
      return;
    }
    
    // Add metadata to the data
    const payload = {
      ...data,
      pageUrl: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
  //   // Use sendBeacon if available for better performance
  //   if (navigator.sendBeacon) {
  //     const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
  //     navigator.sendBeacon(config.endpoint, blob);
  //   } else {
  //     // Fallback to fetch API
  //     fetch(config.endpoint, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'x-api-key': config.apiKey
  //       },
  //       body: JSON.stringify(payload)
  //     }).catch(err => {
  //       if (config.debug) console.error('MonitoringSDK: Failed to send data', err);
  //     });
  //   }
  // };
   // CORRECTED PART: Always append the API key as a query parameter
  // This ensures the key is sent regardless of the transport method (Beacon or Fetch).
  const endpointUrlWithKey = `${config.endpoint}?apiKey=${encodeURIComponent(config.apiKey)}`;
  
  if (navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    navigator.sendBeacon(endpointUrlWithKey, blob);
  } else {
    // Fallback to fetch API
    fetch(endpointUrlWithKey, { // Use the URL with the key here too for consistency
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // We can remove the header now, but keeping it costs nothing and adds a fallback layer.
        'x-api-key': config.apiKey
      },
      body: JSON.stringify(payload)
    }).catch(err => {
      if (config.debug) console.error('MonitoringSDK: Failed to send data', err);
    });
  }
};
  // Main log function
  // const log = (type, data) => {
  //   // If not initialized yet, add to queue
  //   if (!config.apiKey) {
  //     queue.push({ type, data });
  //     return;
  //   }
    
  //   // Don't send data if we're not sampling this session
  //   if (!shouldSample()) return;
    
  //   switch (type) {
  //     case 'performance':
  //       if (config.trackPerformance) {
  //         sendData({
  //           performanceMetrics: data
  //         });
  //       }
  //       break;
        
  //     case 'error':
  //       if (config.trackErrors) {
  //         sendData({
  //           errorLogs: data.errorLogs
  //         });
  //       }
  //       break;
        
  //     default:
  //       if (config.debug) console.warn('MonitoringSDK: Unknown log type', type);
  //   }
  // };

  // In sdk/src/index.js

const log = (type, data) => {
  // ... (if (!config.apiKey) and shouldSample() checks remain the same)
  
  switch (type) {
    case 'performance':
      if (config.trackPerformance) {
        sendData({
          performanceMetrics: data
        });
      }
      break;
      
    case 'error':
      if (config.trackErrors) {
        sendData({
          errorLogs: data.errorLogs
        });
      }
      break;

    // ADD THIS NEW CASE
    case 'custom':
      sendData({
        customEvent: data
      });
      break;
      
    default:
      if (config.debug) console.warn('MonitoringSDK: Unknown log type', type);
  }
};
  
  // Initialize the SDK
  const init = (userConfig) => {
    // Merge user config with defaults
    config = { ...config, ...userConfig };
    
    // Validate API key
    if (!config.apiKey) {
      console.error('MonitoringSDK: API key is required');
      return;
    }
    
    // Set up error handlers
    if (config.trackErrors) {
      window.addEventListener('error', errorHandler);
      window.addEventListener('unhandledrejection', errorHandler);
    }
    
    // Track performance when page is fully loaded
    if (config.trackPerformance) {
      if (document.readyState === 'complete') {
        // Page already loaded, capture metrics immediately
        const metrics = getPerformanceMetrics();
        if (metrics) {
          log('performance', metrics);
        }
      } else {
        // Wait for page to load
        window.addEventListener('load', () => {
          setTimeout(() => {
            const metrics = getPerformanceMetrics();
            if (metrics) {
              log('performance', metrics);
            }
          }, 0);
        });
      }
    }
    
    // Process any queued logs
    if (queue.length > 0) {
      queue.forEach(item => log(item.type, item.data));
      queue = [];
    }
    
    if (config.debug) console.log('MonitoringSDK: Initialized successfully');
  };
  
  // Public API
  window.MonitoringSDK = {
    init,
    log,
    config: () => ({ ...config })
  };
})();
