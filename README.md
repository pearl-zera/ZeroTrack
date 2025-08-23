# <u>**ZeroTrack**</u>

### **Waste Tracking Web App** 

ZeroTrack is a web-based platform designed to help individuals and communities *reduce waste, track consumption, and promote sustainable living* in line with **United Nations SDG 12: Responsible Consumption and Production**.
Users can log their daily waste, view analytics, and access eco-friendly tips to rethink everyday consumption.

------

## **Features**

### **Home Dashboard**

- **Welcome Message** — Personalized greeting
- **Dashboard Cards**:
  - **Total Waste Tracked** — Cumulative weight of waste logged
  - **Average Waste Production** — Average waste weight per log
  - **Current Streak** — Number of consecutive days waste has been logged
- **Waste Logging Section**:
  - Weight in kg input
  - Waste type dropdown (Plastic, Paper, Food Waste, Other)
  - Recent entries table with pagination and serial numbering

### **Analytics Section**

- Interactive **Chart.js** graphs:
  - **Donut Chart** — Waste breakdown by type
  - **Bar Graph** — Waste production over time
- Toggle between two charts

### **Eco Tips & Alternatives**

- Cards of sustainability tips and waste reduction ideas that can be clicked through

### **Menu Overlay**

- Full-screen navigation for:
  - Home (Waste Logging)
  - Analytics
  - Eco Tips
  - SDG 12 link

------

## **Technical Stack**

- **Frontend:** HTML, CSS, JavaScript, p5.js
- **Charts:** Chart.js
- **Backend:** Firebase Authentication, Firebase Realtime Database

------

## **Core Workflow**

1. **User Sign Up/Login**
   - Firebase Authentication with email verification
   - Welcome message changes based on login count (first-time or returning login)
2. **Waste Logging**
   - User enters weight & type of waste
   - Data saved in RTDB under user profile
   - Dashboard updates instantly
3. **Analytics & Insights**
   - Data pulled from database and visualized in real-time
   - User can switch between waste type breakdown and daily production
4. **Tips & Awareness**
   - User browses eco-friendly tips to adopt better consumption habits

------

## **Sustainability Impact**

ZeroTrack helps users:

- Quantify their waste output
- Identify patterns in waste generated
- Get inspired to take action towards waste reduction
- Actively participate in the movement towards sustainable consumption

------
