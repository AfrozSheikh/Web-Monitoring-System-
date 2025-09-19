🌐 Web Monitoring Platform
A comprehensive SaaS-based web application monitoring platform that helps developers track performance metrics, errors, and user interactions on their websites in real-time.

✨ Features
📊 Performance Monitoring
Page Load Time - Track how long your pages take to load

Core Web Vitals - Monitor FCP, LCP, TTFB, and other vital metrics

Real-time Analytics - View performance data with beautiful charts

🚨 Error Tracking
JavaScript Errors - Capture all client-side errors automatically

Promise Rejections - Track unhandled promise rejections

Detailed Error Reports - Get stack traces, line numbers, and source information

🔔 Smart Alerts
Custom Thresholds - Set performance and error thresholds

Email Notifications - Get alerted when issues occur

Flexible Conditions - Configure alerts based on multiple metrics

🛠️ Easy Integration
Lightweight SDK - Just 5KB minified, zero dependencies

Simple Setup - Add a few lines of code to your website

API Access - RESTful API for custom integrations

🚀 Quick Start
Prerequisites
Node.js 14+

MongoDB 4.4+

npm or yarn

Installation
Clone the repository

bash
git clone https://github.com/AfrozSheikh/Web-Monitoring-System-.git
cd web-monitoring-platform
Setup Backend

bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
Setup Frontend

bash
cd frontend
npm install
npm run dev
Build SDK (Optional)

bash
cd sdk
npm install
npm run build
Access the application

Frontend: http://localhost:3000

Backend API: http://localhost:5000

Test website: http://localhost:5000/test

Environment Configuration
Create a .env file in the backend directory:

env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/web_monitoring
JWT_SECRET=your_super_secret_jwt_key_here
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
🎯 SDK Integration
Add monitoring to your website with just a few lines of code:

html
<script src="https://yourdomain.com/sdk.js"></script>
<script>
  MonitoringSDK.init({
    apiKey: "YOUR_API_KEY_HERE",
    trackErrors: true,
    trackPerformance: true,
    // Optional: sample rate for high-traffic sites
    sampleRate: 0.5
  });
</script>
📖 API Documentation
Authentication Endpoints
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login user
GET	/api/auth/me	Get current user
Data Endpoints
Method	Endpoint	Description
POST	/api/logs	Send monitoring data (used by SDK)
GET	/api/dashboard	Get dashboard analytics
GET	/api/alerts	Get user alerts
POST	/api/alerts	Create a new alert
Example API Request
javascript
// Sending performance data
fetch('/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    performanceMetrics: {
      loadTime: 1450,
      firstContentfulPaint: 1200,
      // ... other metrics
    }
  })
});
🏗️ Architecture
text
web-monitoring-platform/
├── backend/          # Node.js + Express API
│   ├── models/       # MongoDB models
│   ├── routes/       # API routes
│   ├── middleware/   # Custom middleware
│   └── utils/        # Helper functions
├── frontend/         # React dashboard
│   ├── components/   # React components
│   ├── context/      # React context
│   └── services/     # API services
└── sdk/              # Monitoring SDK
    └── dist/         # Built SDK files
📊 Dashboard Features
Real-time Metrics: Visualize performance data with interactive charts

Error Analytics: View error trends and patterns

API Key Management: Copy and regenerate API keys easily

Alert Configuration: Set up custom monitoring alerts

Filtering: Filter data by date, URL, browser, and more

🛡️ Security Features
JWT-based authentication

API key validation

CORS protection

Rate limiting

Helmet.js security headers

Password hashing with bcrypt

🧪 Testing
bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test

# Test the SDK
cd sdk
npm test
🚢 Deployment
Using Docker
bash
# Build and run with Docker Compose
docker-compose up -d
Manual Deployment
Build the frontend

bash
cd frontend
npm run build
Setup production environment variables

bash
cd backend
# Update .env with production values
Start the production server

bash
npm start
🤝 Contributing
We welcome contributions! Please feel free to submit a Pull Request.

Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some AmazingFeature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📄 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🆘 Support
If you have any questions or need help, please:

Check the FAQ

Open an issue

Contact us at support@webmonitoring.com

🙏 Acknowledgments
Chart visualizations powered by Recharts

Icons from Feather Icons

UI components inspired by Tailwind UI

<div align="center">
Made with ❤️ by the Afroz

</div>