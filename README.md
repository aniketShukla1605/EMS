# 🎉 Event Management System (EMS)

A full-stack web application that allows users to create, manage, and participate in events seamlessly. The system provides role-based access for admins, organizers, and users, ensuring secure and efficient event handling.

---

## 🚀 Features

- 🔐 User Authentication (JWT-based login/signup)
- 👥 Role-based Access (Admin / Organizer / User)
- 📅 Event Creation & Management
- 📝 Event Registration
- 📧 Email OTP Verification (Forgot Password)
- 📊 Admin Dashboard
- 🌐 REST API Integration
- 📱 Responsive UI

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Axios
- Bootstrap / CSS

### Backend:
- Spring Boot
- Spring Security
- JWT Authentication
- JPA / Hibernate

### Database:
- MySQL

---

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/EMS.git
cd EMS

### 2️⃣ Backend Setup (Spring Boot)
Configure application.properties
add your database credentials
- spring.datasource.url=your_db_url
- spring.datasource.username=your_username
- spring.datasource.password=your_password
```bash
cd EMS_backend
mvn spring-boot:run

### 3️⃣ Frontend Setup (React)
cd EMS_frontend
npm install
npm start


## 📂 Project Structure
