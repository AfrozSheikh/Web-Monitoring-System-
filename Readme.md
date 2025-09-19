🌐 Web Monitoring Platform

A SaaS-based monitoring solution that empowers developers to track performance metrics, errors, and user interactions in real time — ensuring faster issue resolution, improved reliability, and better user experience.

✨ Key Features
📊 Performance Monitoring

Page Load Time – Measure how long pages take to load

Core Web Vitals – Track FCP, LCP, TTFB, and more

Real-time Analytics – Interactive charts for insights

🚨 Error Tracking

JavaScript Errors – Capture client-side exceptions automatically

Promise Rejections – Monitor unhandled rejections

Detailed Reports – Stack traces, line numbers & source info

🔔 Smart Alerts

Custom Thresholds – Define your own rules

Email Notifications – Get notified instantly

Flexible Conditions – Configure alerts across multiple metrics

🛠️ Easy Integration

Lightweight SDK – Just 5KB, async, and zero dependencies

Plug & Play – Add a few lines of code to your site

API Access – RESTful APIs for custom integrations

🚀 Quick Start
🔧 Prerequisites

Node.js 14+

MongoDB 4.4+

npm or yarn

⚡ Setup
# Clone the repository
git clone https://github.com/AfrozSheikh/Web-Monitoring-System-.git
cd web-monitoring-platform


Backend

cd backend
npm install
cp .env.example .env   # Update env vars
npm run dev


Frontend

cd frontend
npm install
npm run dev


SDK Build (Optional)

cd sdk
npm install
npm run build


Access App

Frontend → http://localhost:3000

Backend API → http://localhost:5000

Test Website → http://localhost:5000/test

🎯 SDK Integration
<script src="https://yourdomain.com/sdk.js"></script>
<script>
  MonitoringSDK.init({
    apiKey: "YOUR_API_KEY",
    trackErrors: true,
    trackPerformance: true,
    sampleRate: 0.5 // optional for high-traffic sites
  });
</script>

📖 API Documentation
🔐 Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a new user
POST	/api/auth/login	Login existing user
GET	/api/auth/me	Get current user info
📡 Data Endpoints
Method	Endpoint	Description
POST	/api/logs	Send monitoring data (SDK)
GET	/api/dashboard	Get performance analytics
GET	/api/alerts	Fetch user alerts
POST	/api/alerts	Create a new alert

Example Request

fetch('/api/logs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'YOUR_API_KEY'
  },
  body: JSON.stringify({
    performanceMetrics: {
      loadTime: 1450,
      firstContentfulPaint: 1200
    }
  })
});

🏗️ Project Architecture
web-monitoring-platform/
├── backend/        # Node.js + Express API
│   ├── models/     
│   ├── routes/     
│   ├── middleware/ 
│   └── utils/      
├── frontend/       # React + Tailwind Dashboard
│   ├── components/ 
│   ├── context/    
│   └── services/   
└── sdk/            # Lightweight JS SDK
    └── dist/       

📊 Dashboard Highlights

Real-time metrics visualization

Error trend analysis

API key management with copy/regenerate

Alert configuration UI

Advanced filtering (date, URL, browser, etc.)

🛡️ Security

✔️ JWT-based authentication
✔️ API Key validation
✔️ Rate limiting
✔️ CORS protection
✔️ Helmet.js headers
✔️ Password hashing with bcrypt

🧪 Testing
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# SDK
cd sdk && npm test

🚢 Deployment
Docker
docker-compose up -d

Manual
# Build frontend
cd frontend && npm run build

# Start backend
cd backend && npm start

🤝 Contributing

Fork the repo

Create feature branch → git checkout -b feature/NewFeature

Commit changes → git commit -m 'Add new feature'

Push branch → git push origin feature/NewFeature

Open a Pull Request

📄 License

Licensed under the MIT License.
.

🔗 Open an Issue

📚 Check FAQ

<div align="center"> Made with ❤️ by <b>Afroz</b> </div>