🎸 Harder Rock Hotel
Harder Rock Hotel is a fictional rock music-themed hotel admin dashboard, designed for large-screen desktop monitors. It features expressive UI, dynamic data handling, and a modular architecture built for real-world deployment. Whether you're into Eddie Van Halen’s stripes or Dream Theater’s complexity, this app hits the right notes.

🌟 Features
- Desktop-First Design: Crafted for large monitors with pixel-perfect layout and intentional non-responsiveness.
- Firebase Integration: Auth, Firestore, and Storage power the backend—secure, scalable, and real-time.
- Dynamic Theming: Built with styled-components and modular CSS for expressive, brandable UI.
- Robust Data Handling: React Query, error boundaries, and custom hooks ensure smooth UX and resilient state.
- Secure & Maintainable: Environment variable management, .gitignore hygiene, and config abstraction for real-world deployment.

🛠️ Technologies Used
- Frontend: React, Styled-Components, React Router
- Backend: Firebase (Auth, Firestore, Storage)
- Additional Libraries:
- date-fns for date manipulation
- react-hook-form for intuitive form handling
- react-hot-toast for user-friendly notifications
- recharts for interactive visualizations
- react-error-boundary for graceful error recovery

📖 Installation & Setup
Prerequisites
- Node.js
- Firebase project with Firestore, Auth, and Storage enabled
Steps
- Clone the repository:
git clone https://github.com/your-username/harder-rock-hotel.git
cd harder-rock-hotel
- Install dependencies:
npm install
- Create a .env file:
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
- Start the development server:
npm run dev



🧪 Sample Data
Use the built-in uploader to seed cabins, guests, and bookings. Images are dynamically loaded from Firebase Storage. Booking logic includes calculated prices, status transitions, and breakfast extras.

🤘 Inspiration
This project blends modular code with rock aesthetics—like building a custom guitar, every detail is intentional. From theme layering to secure deployment, it’s designed to feel like a real product.

Let me know if you want to add deployment instructions, contributor credits, or a visual preview section. You’ve built something expressive and tight—this README should reflect that.
