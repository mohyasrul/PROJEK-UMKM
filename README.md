# UMKM Management App

A comprehensive Progressive Web Application (PWA) for UMKM (Usaha Mikro, Kecil, dan Menengah) management built with modern web technologies.

## 🚀 Features

### Core Modules

- **📦 Inventory Management** - Product management, stock tracking, barcode scanning
- **💰 Point of Sale (POS)** - Touch-friendly interface, multiple payment methods
- **👥 Customer Management** - Customer database, loyalty programs, credit tracking
- **📊 Financial Management** - Cash flow, basic accounting, expense tracking
- **👨‍💼 Human Resources** - Employee management, attendance, payroll
- **📈 Reporting & Analytics** - Interactive dashboards, business intelligence

### Technical Features

- **🔄 Offline-First** - Works without internet connection
- **📱 Cross-Platform** - PWA that works on all devices
- **🔒 Secure** - Local data encryption, role-based access
- **⚡ Fast** - Modern tech stack optimized for performance
- **💾 Local Database** - SQLite for data persistence

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **State Management**: Zustand
- **Database**: SQLite (via sql.js) + IndexedDB
- **PWA**: Vite PWA Plugin + Workbox
- **Development**: ESLint + Prettier + Husky

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── stores/             # Zustand state stores
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
├── db/                 # Database schemas & migrations
└── assets/             # Static assets (images, icons)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd umkm-app
```

2. Install dependencies

```bash
npm install
```

3. Start development server

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🏗️ Development Roadmap

### Phase 1 (MVP - 2 months)

- [x] Project setup and configuration
- [ ] Basic POS functionality
- [ ] Product & inventory management
- [ ] Customer management
- [ ] Basic reporting
- [ ] Offline capability

### Phase 2 (3 months)

- [ ] Financial management
- [ ] Advanced inventory features
- [ ] HR & payroll basic
- [ ] Dashboard & analytics

### Phase 3 (2 months)

- [ ] E-commerce integration
- [ ] Advanced reporting
- [ ] Mobile optimization
- [ ] Testing & bug fixes

### Phase 4 (1 month)

- [ ] Performance optimization
- [ ] Security hardening
- [ ] Documentation
- [ ] Deployment preparation

## 🎯 Key Differentiators

- **True Offline**: Works completely offline unlike competitors
- **No Subscription**: One-time purchase vs monthly fees
- **Complete Features**: Premium features included as standard
- **Local Data**: Data stays within your business
- **Cross Platform**: Single app for all devices
- **Easy Setup**: Install like a website, no complexity

---

**Built with ❤️ for Indonesian UMKM businesses**

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
````
