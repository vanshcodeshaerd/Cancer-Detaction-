# Cancer Detection Hospital Portal

A professional, secure, and efficient web-based portal for cancer detection hospitals, designed specifically for medical professionals to manage patient data, upload scan reports, and analyze cancer detection statistics.

## 🏥 Features

### 🔐 Security & Access Control
- **Doctor-only authentication** with secure login system
- **Role-based access control** (medical professionals only)
- **Session management** with automatic timeout
- **Input validation** and sanitization

### 🎨 Modern UI/UX Design
- **Clean, hospital-grade design** with white/blue/teal color scheme
- **Responsive layout** optimized for desktop and mobile
- **Dark mode toggle** for doctor convenience
- **Smooth animations** and transitions
- **Professional typography** and spacing

### 📊 Dashboard & Analytics
- **Comprehensive dashboard** with key metrics
- **Interactive charts** and graphs using Chart.js
- **Patient statistics** visualization
- **Cancer type distribution** analysis
- **Monthly trends** tracking
- **Recovery rate** monitoring

### 👥 Patient Management
- **Patient data entry** (age, gender, symptoms, medical history)
- **Structured patient records** in organized tables
- **Search and filter** functionality
- **Status tracking** (active, critical, recovered, under treatment)

### 📋 Report Management
- **Scan report upload** system (dummy file upload)
- **Report categorization** by cancer type
- **Secure data storage** using localStorage
- **Report history** and tracking

### ⚙️ System Features
- **Modular architecture** for easy maintenance
- **Scalable structure** ready for backend integration
- **Loading animations** and notifications
- **Form validation** and error handling
- **Responsive design** for all devices

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No server setup required (runs entirely in browser)

### Installation
1. **Clone or download** the project files
2. **Open `index.html`** in your web browser
3. **Login** using the sample doctor credentials:
   - **Username:** `dr.smith`
   - **Password:** `snap`

### File Structure
```
cancer-detection-portal/
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── styles/
│   ├── main.css           # Global styles and variables
│   ├── login.css          # Login page styles
│   ├── dashboard.css      # Dashboard layout styles
│   └── components.css     # UI component styles
├── js/
│   ├── auth.js            # Authentication system
│   ├── data.js            # Data management
│   ├── dashboard.js       # Dashboard functionality
│   ├── charts.js          # Chart.js integration
│   ├── components.js      # UI components
│   └── login.js           # Login page logic
└── README.md              # Project documentation
```

## 🔧 Technical Details

### Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS Grid and Flexbox
- **JavaScript (ES6+)** - Modern JavaScript with classes and modules
- **Chart.js** - Data visualization library
- **Font Awesome** - Icon library

### Architecture
- **Modular Design** - Separated concerns across multiple files
- **Object-Oriented** - Class-based JavaScript architecture
- **Event-Driven** - Responsive user interactions
- **Local Storage** - Client-side data persistence

### Security Features
- **Input Validation** - Client-side form validation
- **Session Management** - Automatic session timeout
- **Role-Based Access** - Doctor-only authentication
- **Data Sanitization** - XSS prevention

## 📱 Usage Guide

### Login Process
1. Navigate to the login page
2. Enter your Doctor ID and password
3. Click "Sign In" to access the dashboard
4. Session will automatically timeout after 30 minutes

### Dashboard Navigation
- **Dashboard** - Overview with statistics and charts
- **Patients** - Patient management and records
- **Reports** - Scan report upload and management
- **Analytics** - Detailed charts and analysis
- **Settings** - Profile and system settings

### Adding Patients
1. Click "Add Patient" button
2. Fill in patient information (name, age, gender, symptoms, medical history)
3. Select patient status
4. Click "Save Patient"

### Uploading Reports
1. Navigate to Reports section
2. Click "Upload Report"
3. Select patient from dropdown
4. Choose cancer type
5. Upload scan file (dummy upload)
6. Add notes and click "Upload Report"

### Viewing Analytics
- **Patient Statistics** - Doughnut chart showing patient distribution
- **Cancer Type Distribution** - Bar chart of cancer types
- **Monthly Trends** - Line chart of new cases over time
- **Recovery Rate** - Progress chart with center display

## 🎨 Customization

### Color Scheme
The portal uses CSS variables for easy customization:
```css
:root {
    --primary-color: #2563eb;
    --secondary-color: #0891b2;
    --success-color: #059669;
    --warning-color: #d97706;
    --danger-color: #dc2626;
    --background-color: #ffffff;
    --text-color: #1e293b;
}
```

### Adding New Features
1. **New Sections** - Add to dashboard.html and dashboard.js
2. **New Charts** - Extend charts.js with new chart types
3. **New Data** - Modify data.js for additional data structures
4. **New Components** - Use components.js for reusable UI elements

## 🔒 Security Considerations

### Current Implementation
- **Client-side only** - No server-side security
- **Local storage** - Data stored in browser
- **Sample data** - For demonstration purposes

### Production Deployment
- **Backend integration** - Connect to secure server
- **Database** - Replace localStorage with proper database
- **HTTPS** - Secure data transmission
- **Authentication** - Implement proper JWT or session-based auth
- **Data encryption** - Encrypt sensitive patient data

## 📊 Sample Data

### Sample Doctor Accounts
- **Dr. Smith** (dr.smith / password123)
- **Dr. Johnson** (dr.johnson / password123)
- **Dr. Williams** (dr.williams / password123)

### Sample Patient Data
The system includes sample patients with realistic medical data for demonstration purposes.

## 🐛 Troubleshooting

### Common Issues
1. **Charts not loading** - Check internet connection for Chart.js CDN
2. **Data not persisting** - Ensure localStorage is enabled
3. **Login issues** - Use exact sample credentials
4. **Responsive issues** - Check browser compatibility

### Browser Compatibility
- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 📈 Future Enhancements

### Planned Features
- **Real-time notifications** - WebSocket integration
- **Advanced analytics** - Machine learning insights
- **Multi-language support** - Internationalization
- **Mobile app** - Progressive Web App (PWA)
- **Backend integration** - Node.js/Express server
- **Database** - MongoDB or PostgreSQL
- **AI integration** - Automated cancer detection
- **Telemedicine** - Video consultation features

### Scalability
- **Microservices architecture** - Service-oriented design
- **API-first approach** - RESTful API design
- **Cloud deployment** - AWS/Azure/GCP integration
- **Load balancing** - Horizontal scaling
- **Caching** - Redis integration

## 📄 License

This project is for educational and demonstration purposes. For production use, ensure compliance with healthcare data regulations (HIPAA, GDPR, etc.).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support:
- Check the troubleshooting section
- Review the code comments
- Ensure browser compatibility
- Verify all files are present

---

**Note:** This is a frontend demonstration. For production use in healthcare, implement proper security measures, data encryption, and compliance with medical data regulations.
