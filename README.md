# 🎫 TicketBari – Online Ticket Booking Platform

TicketBari is a modern and responsive online ticket booking platform that allows users to explore available tickets, book their preferred journeys, and manage their bookings through a user-friendly interface. The platform includes secure authentication, role-based dashboards, booking management, and online payments. Sellers can add and manage tickets, while administrators can manage users, review tickets, and control platform activities.

---

## 🌐 Live Demo

🔗 **Live Site:** [TicketBari](https://ticket-bari-client-black.vercel.app)

---

## 📸 Screenshots

### 🏠 Home Page

![Home Page](./screenshots/home.png)

> *Add your project screenshots to the `screenshots` folder.*

---

## 🚀 Technologies Used

- Next.js
- React
- JavaScript (ES6+)
- Tailwind CSS
- Better Auth
- MongoDB
- Express.js
- Node.js
- Stripe
- Vercel
- Git and GitHub

---

## ✨ Features

- 🎫 Browse available tickets
- 🔍 Explore ticket details and journey information
- 🔐 Secure authentication and authorization
- 👤 Role-based dashboards for buyers, sellers, and administrators
- 📅 Book tickets with preferred quantities
- 📋 View and manage personal bookings
- ⏳ Track booking status, including pending and accepted requests
- 💳 Secure online payments using Stripe Checkout
- 💰 View transaction history and payment details
- ➕ Allow sellers to add new tickets
- ✏️ Manage and update seller tickets
- 📊 Track seller revenue and booking requests
- ✅ Allow administrators to approve or reject tickets
- 👥 Manage users and user roles
- 🚩 Manage reported or fraudulent sellers
- 📢 Manage ticket advertisements
- ⭐ Display approved and advertised tickets
- 📱 Fully responsive design
- ⚡ Smooth and user-friendly experience
- 🎨 Clean and modern user interface

---

## 📦 Dependencies

Major packages and technologies used in this project include:

- Next.js
- React
- Tailwind CSS
- Better Auth
- MongoDB
- Express.js
- Node.js
- Stripe
- React Icons

> For the complete list of installed packages, check the `package.json` files in the client and server repositories.

---

## ⚙️ Run Locally

### 1. Clone the Client Repository

```bash
git clone https://github.com/jahidhasan-devs/Online-Ticket-Booking-Platform-Client.git
```

### 2. Navigate to the Client Project

```bash
cd Online-Ticket-Booking-Platform-Client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env.local` file in the client project root and configure the required environment variables.

```env
NEXT_PUBLIC_SERVER_URL=your_backend_url
BETTER_AUTH_SECRET=your_better_auth_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret_key
```

> Use the actual variable names required by your project configuration. Keep secret keys private and never commit environment files containing credentials.

### 5. Start the Development Server

```bash
npm run dev
```

Visit:

```text
http://localhost:3000
```

---

## 🖥️ Run the Server Locally

### 1. Clone the Server Repository

Open another terminal and run:

```bash
git clone https://github.com/jahidhasan-devs/Online-Ticket-Booking-Platform-Server.git
```

### 2. Navigate to the Server Project

```bash
cd Online-Ticket-Booking-Platform-Server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the server project root and configure your MongoDB connection, client URL, and other required server settings.

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=http://localhost:3000
```

> Add any other environment variables required by your server code. Never publish actual database credentials or authentication secrets.

### 5. Start the Server

Use the appropriate script defined in your server's `package.json`, for example:

```bash
npm start
```

If your project uses Nodemon for development, run:

```bash
npx nodemon index.js
```

The backend should be available at:

```text
http://localhost:5000
```

---

## 🔗 Resources

### 🌐 Live Project

[TicketBari – Online Ticket Booking Platform](https://ticket-bari-client-black.vercel.app)

### 💻 Client Repository

[GitHub – TicketBari Client](https://github.com/jahidhasan-devs/Online-Ticket-Booking-Platform-Client)

### 💻 Server Repository

[GitHub – TicketBari Server](https://github.com/jahidhasan-devs/Online-Ticket-Booking-Platform-Server)

---

## 👨‍💻 Author

**Jahid Hasan**

🌐 **GitHub Profile:** [jahidhasan-devs](https://github.com/jahidhasan-devs)
