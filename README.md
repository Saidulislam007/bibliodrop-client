# 📚 BiblioDrop - Premium Book Marketplace & Library Management System

A modern, full-stack digital book marketplace and library ecosystem. It allows users to browse, borrow, or request home delivery of premium literary assets, while providing librarians and administrators with robust dashboard metrics, analytics, and content override controls.

🌐 **[Live Deployment URL](https://your-live-link.com)** *(Replace with your actual live link ভাই)*

---

## 🚀 Key Features

### 💻 User & Dashboard Experience
* **Ultra-Premium Fullscreen Menu & Bottom Nav:** Seamless transition between desktop sticky sidebars and mobile custom screen-centered overlays or bottom nav navigation. **100% responsive across all mobile, tablet, and desktop viewports.**
* **Dynamic Analytics Command Dashboard:** Real-time visual trends using animated charts for revenue pipelines and category ratios.
* **Inline Payment Confirmation Flow:** Sleek, user-friendly interactive confirmation summary card triggered seamlessly before final checkout execution.

### 🔒 Administration & Security Gateways
* **Role-Based Access Control (RBAC):** Strict security layers preventing unauthorized access to `Admin Core` or `Librarian Modals` using verified token architectures.
* **Administrative Listing Override:** Complete control over assets allowing administrators to instantly unpublish, hide, or permanently remove listings from the live database registry.
* **Advanced Staggered Micro-Interactions:** Smooth page animations, layouts, and card populations powered by a micro-interaction engine.

---

## 🛠️ Tech Stack & Dependencies

### Frontend Architecture
* **Core Framework:** Next.js (Client Component Driven Engine) & JavaScript (ES6+)
* **Styling Engine:** Tailwind CSS & Styled-Components
* **UI Component Library:** HeroUI (Formerly NextUI)
* **Icon Packages:** Lucide React & React Icons

### Backend & Database Layers
* **Server Runtime:** Express.js (Node.js Environment)
* **Database Management:** MongoDB (Native Drivers & Cloud Clusters)
* **Cross-Origin resource sharing:** CORS Engine Middleware

### Authentication & Security Protocols
* **Core Authentication Framework:** Better-Auth (`mongo-adapter` for structural persistence)
* **Token Standardization:** JSON Web Tokens (JWT System Layers)
* **Environment Configuration:** Secure `.env` management schemas

---

## 📦 NPM Packages Registry

Here is the structured manifest of all verified npm dependencies utilized within this application footprint:

### Client-Side Engine Packages
| Package Name | Purpose / Layer |
| :--- | :--- |
| `next` | Production React Framework core layout engine |
| `@heroui/react` | Premium UI design component generation |
| `framer-motion` | Staggered animations and hardware-accelerated transitions |
| `recharts` | Data visualization layer for analytics and trends |
| `react-hot-toast` | Animated snackbars, error catchers, and action triggers |
| `lucide-react` | Clean vector layout utility icon repository |
| `react-icons` | Collective font icon engine (FontAwesome, Feather, etc.) |
| `styled-components` | CSS-in-JS component-level styling architecture |

### Backend & Middleware Packages
| Package Name | Purpose / Layer |
| :--- | :--- |
| `express` | Fast, unopinionated, minimalist web framework for API routes |
| `mongodb` | Official MongoDB driver for cluster operations |
| `better-auth` | Production-ready auth layer with native Mongo adapter bindings |
| `jsonwebtoken` | Secure stateless transmission token generator |
| `cors` | Strict cross-origin request routing configurations |

---

## ⚙️ Environment Variables Setup

Before running the server infrastructure, build your local environment files (`.env.local` for client, `.env` for server):

### Client/App Environment
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
BETTER_AUTH_SECRET=your_ultra_secure_better_auth_secret_key
NEXT_PUBLIC_APP_URL=http://localhost:3000