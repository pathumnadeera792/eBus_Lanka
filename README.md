# 🚍 eBus Lanka – Unified Online Seat Reservation System

A comprehensive, full-stack web application designed to centralize and streamline private bus transportation in Sri Lanka. The platform bridges the gap between passengers and multiple private bus operators through an intuitive, scalable, and multilingual digital ecosystem[cite: 3].

---

## 🌟 Key Features

* **Multi-Role Authentication & Access Control:** Secure role-based portals for **Passengers**, **Bus Operators**, and **Super Administrators** with JWT session management and password hashing[cite: 3].
* **Dynamic Multilingual Support:** Built-in seamless language switching (**English, Sinhala, and Tamil**) across all primary user interfaces using `i18next`[cite: 3].
* **Smart Bus Route Search & Live Seat Selection:** Real-time search functionality filtered by departure locations, destinations, and dates, paired with an interactive seat reservation matrix[cite: 3].
* **Operator Fleet Management Dashboard:** Dedicated portal for bus operators to register company details (BR verification), add/manage bus schedules, view passenger manifests, and track daily sales and earnings[cite: 3].
* **Super Admin Control Panel:** Centralized oversight to review and approve operator registrations, manage route moderations, and maintain platform-wide integrity[cite: 3].
* **AI-Powered Customer Support Chatbot:** Integrated AI assistant powered by the **Groq API** to handle live passenger inquiries regarding routes, schedules, and fares autonomously[cite: 3].
* **Digital Ticket Generation:** Automated confirmation systems with downloadable digital passes and PDF tickets[cite: 3].

---

## 🛠️ Technology Stack

* **Frontend:** React.js (with Vite), Tailwind CSS, React Icons, React Hot Toast, i18next[cite: 3]
* **Backend:** Node.js, Express.js (RESTful API architecture)[cite: 3]
* **Database:** MongoDB (NoSQL) managed via Mongoose ODM[cite: 3]
* **APIs & Tools:** Groq API (AI Chatbot), EmailJS, Visual Studio Code, Git & GitHub[cite: 3]

---

## ⚙️ System Architecture Overview

* **Client Layer (Presentation):** Responsive React.js frontend catering to the three main actors[cite: 3].
* **Server Layer (Business Logic):** Secure Node/Express backend routing controllers, authentication middleware, and AI/payment modules[cite: 3].
* **Database Layer (Storage):** Scalable MongoDB collections tracking users, operators, buses, routes, seats, bookings, and payments[cite: 3].

---
