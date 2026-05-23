# Yoga Pose Perfect: Frontend Architecture & UI/UX Documentation

## 1. Overview
The frontend of **Yoga Pose Perfect** is designed to provide a highly interactive, responsive, and meditative user experience. The client application handles the user interface, video capture, real-time skeletal rendering, data visualization, and session management. It acts as the bridge between the user and our AI-driven pose estimation backend.

---

## 2. Technologies Used

### Core Frameworks
- **Next.js (15.3.3)**: Chosen as the core React framework for its file-based routing system (App Router), server-side rendering capabilities, and seamless API route integration. It allows the application to be highly performant and scalable.
- **React (18.3.1)**: Used for building the component-based architecture. React's state management and lifecycle hooks (`useState`, `useEffect`, `useRef`) are heavily utilized to handle real-time WebSocket data and webcam media streams.
- **TypeScript (5.x)**: Used extensively throughout the project to ensure type safety. It minimizes runtime errors and provides excellent developer experience and autocompletion for complex data structures like MediaPipe landmarks and API responses.

### Styling & Animation
- **Tailwind CSS (3.4.1)**: A utility-first CSS framework used for rapid UI development. It helps us maintain a consistent design system without writing custom CSS files, utilizing custom configured colors in `tailwind.config.ts`.
- **Framer Motion (12.38.0)**: Used to bring the interface to life. It handles page transitions, hover effects, and smooth layout animations (e.g., in the pose library and dashboard) to give a premium feel to the application.

### UI Components & Data Visualization
- **Radix UI**: Headless UI primitives used for accessible, unstyled components like Toasts, Dialogs, and Select menus.
- **Recharts (3.8.1)**: Used in the Dashboard for rendering interactive and responsive analytics charts (e.g., Weekly Accuracy Line Chart, Session History).
- **Lucide React (0.475.0)**: A clean, consistent icon library used across all pages for navigation, controls, and visual indicators.

---

## 3. UI / UX Methodology

### 3.1 Design Philosophy (Minimalism & Elegance)
The UI is designed around a **premium, meditative, and distraction-free experience**. Yoga requires focus, so the interface removes unnecessary clutter, relying on spacing, typography, and contrast to guide the user.

### 3.2 Color Theme
- **Background (`#0A0705`)**: A deep, almost-black warm tone that reduces eye strain and provides a premium "studio" feel.
- **Card/Surface (`#1A1005`)**: A slightly lighter warm dark tone used to elevate containers and cards off the background.
- **Accent/Golden (`#C9933A`)**: A rich golden color used for primary actions, active states, score highlighting, and decorative borders.
- **Text (`#F5E6D3` & White)**: Soft off-white is used for readability, avoiding the harshness of pure white against a dark background.

### 3.3 Typography
- **Primary Serif (Playfair Display / Cormorant Garamond)**: Used for large headings, page titles, and expressive quotes. It imparts a traditional, elegant, and grounding feel appropriate for yoga.
- **Primary Sans-Serif (PT Sans / Inter)**: Used for body text, data points, and UI controls. It ensures maximum legibility, especially on smaller screens or when displaying numbers (like timers and scores).

---

## 4. Page Architecture & Details

### 4.1 Home / Landing Page (`/`)
- **Purpose**: The entry point of the application. It introduces the user to the core value proposition (AI-powered yoga).
- **Features**: Features a hero section with animated typography, clear call-to-action (CTA) buttons, and feature highlights.
- **Design**: Uses large, bold serif fonts and subtle glow effects behind the golden accent to draw attention to the "Start Session" CTA.

### 4.2 About Page (`/about`)
- **Purpose**: Details the project's background, technological capabilities, and the development team.
- **Features**: 
  - A Bento-grid layout explaining the system's features (Real-Time Pose Detection, Progress Tracking, etc.).
  - A dedicated "Our Creative Team" section highlighting the roles of the Project Lead (Aashish), Frontend Developer (Madhav), and Backend/ML Engineer (Adil).
- **Design**: Utilizes heavy Framer Motion scroll animations and custom shaped cards for team members with hovering glow effects.

### 4.3 Live Session Page (`/live-session`)
- **Purpose**: The core functional page of the application where the user actually practices yoga.
- **Features**:
  - Requires webcam permissions to start.
  - Establishes a WebSocket connection to the backend.
  - Displays the live video feed with an overlaid skeletal structure.
  - Shows real-time scoring, current pose name, and corrective feedback.
- **Components**:
  - `VideoCanvas.tsx`: Renders the webcam stream and uses HTML5 Canvas to draw the MediaPipe landmarks and colored joints.
  - `PosePanel.tsx`: The side control panel showing the current active pose, duration timer, and "End Session" controls.

### 4.4 Pose Library (`/poses`)
- **Purpose**: An educational hub containing all the yoga poses supported by the ML model.
- **Features**: A grid of yoga poses. Clicking on a pose opens a detailed view/modal showing the benefits, target body parts, step-by-step instructions, and precautions.
- **Design**: Image-heavy, utilizing aspect-ratio constraints to ensure all pose cards look uniform. Hovering over a card triggers a slight scale animation (via Framer Motion).

### 4.5 Dashboard (`/dashboard`)
- **Purpose**: Provides users with historical analytics of their practice.
- **Features**:
  - Displays the current practice streak (consecutive days).
  - Shows the best score and total sessions.
  - Renders a line chart for weekly accuracy using Recharts.
- **Design**: Dashboard cards with subtle borders (`border-white/10`) to separate data points without visually overwhelming the user.

### 4.6 Login Page (`/login`)
- **Purpose**: Authenticates the user.
- **Features**: Custom styled form for email/password and social login options.
- **Design**: Centered floating card over the dark background, maintaining the golden accent for the submit button.

---

## 5. Core Reusable Components

### 5.1 Layout Components
- **`Header.tsx`**: A sticky top navigation bar with the logo and links to Home, Poses, Dashboard, and About. Includes a mobile responsive hamburger menu.
- **`Footer.tsx`**: A minimal footer at the bottom of the page containing copyright info and secondary links.

### 5.2 UI Primitives (`src/components/ui/*`)
- **Buttons, Cards, Inputs, Dialogs**: Built on top of Radix UI and styled with Tailwind. These components are kept in a separate folder so they can be reused identically across different pages. For example, the `Button` component accepts variants (e.g., `default`, `outline`, `ghost`) to maintain styling consistency without repeating CSS classes.

### 5.3 Live Session Components
- **`VideoCanvas`**: We created a custom HTML5 canvas component overlaid exactly on top of a hidden `<video>` element. Why? Because directly manipulating DOM elements for 33 landmarks at 30 FPS is extremely slow. Canvas rendering provides the hardware-accelerated performance needed to draw the skeletal overlay smoothly without blocking the main React thread.
- **`useWebSocket` Hook**: A custom React hook designed to abstract away the complexity of managing WebSocket connections, reconnections, and message parsing. It keeps the UI components clean and focused purely on rendering.

---

## 6. Summary
The frontend architecture was built with **modularity, performance, and aesthetics** in mind. By utilizing Next.js for routing, HTML5 Canvas for high-performance rendering, and Tailwind/Framer Motion for a premium dark-themed UI, the application successfully delivers a desktop-class AI experience directly in the browser.
