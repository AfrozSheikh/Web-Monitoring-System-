// Simple test to check if the SDK file is valid
const fs = require('fs');
const path = require('path');

const sdkPath = path.join(__dirname,  'dist', 'sdk.js');

try {
  const sdkContent = fs.readFileSync(sdkPath, 'utf8');
  console.log('SDK file exists and has content');
  
  // Check if it contains the MonitoringSDK initialization
  if (sdkContent.includes('MonitoringSDK')) {
    console.log('SDK contains MonitoringSDK reference');
  } else {
    console.log('WARNING: SDK does not contain MonitoringSDK reference');
  }
  
  // Check if it contains the init function
  if (sdkContent.includes('.init')) {
    console.log('SDK contains init function');
  } else {
    console.log('WARNING: SDK does not contain init function');
  }
  
} catch (error) {
  console.error('Error reading SDK file:', error.message);
}