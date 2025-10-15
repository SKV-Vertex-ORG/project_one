# 🎨 Vertex Client

Frontend React application for the Vertex platform built with Vite, Tailwind CSS, and modern web technologies.

## ✨ Features

- **React 18** with Vite for fast development
- **Responsive Design** - Works on all devices
- **Futuristic UI** - Glassmorphism and modern design
- **Dark/Light Themes** - System preference detection
- **Smooth Animations** - Powered by Framer Motion
- **Form Management** - React Hook Form
- **State Management** - React Context + Zustand
- **Toast Notifications** - React Hot Toast
- **Modern Icons** - Lucide React

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   
   Create a `.env` file:
   ```env
   # API Configuration
   VITE_API_URL=http://localhost:5000/api
   
   # App Configuration
   VITE_APP_NAME=Vertex
   VITE_APP_VERSION=1.0.0
   
   # Environment
   VITE_NODE_ENV=development
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🏗️ Build & Deploy

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🏃‍♂️ Local Development

The client is configured for local development with hot module replacement using Vite.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `VITE_API_URL` | Backend API URL | Yes | http://localhost:5000/api |
| `VITE_APP_NAME` | Application name | No | Vertex |
| `VITE_APP_VERSION` | Application version | No | 1.0.0 |
| `VITE_NODE_ENV` | Environment mode | No | development |

### Build Configuration

The app uses Vite for building with optimized settings:

- **Code Splitting** - Automatic chunk splitting
- **Tree Shaking** - Remove unused code
- **Minification** - Optimize bundle size
- **Source Maps** - Debug in production
- **Asset Optimization** - Compress images and assets

## 🎨 UI Components

### Design System
- **Colors** - Primary, secondary, accent palettes
- **Typography** - Inter font family
- **Spacing** - Consistent spacing scale
- **Shadows** - Layered shadow system
- **Borders** - Rounded corner system

### Components
- **Buttons** - Primary, secondary, ghost variants
- **Forms** - Input fields with validation
- **Cards** - Glass morphism cards
- **Modals** - Overlay components
- **Navigation** - Responsive navigation

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- **Mobile** - 320px and up
- **Tablet** - 768px and up
- **Desktop** - 1024px and up
- **Large Desktop** - 1280px and up

## 🎭 Themes

### Theme Support
- **Light Theme** - Clean and bright
- **Dark Theme** - Easy on the eyes (default)
- **Auto Theme** - Follows system preference

### Theme Switching
The app automatically detects system preference and allows manual theme switching.

## 🚀 Performance

### Optimization Features
- **Code Splitting** - Load only what's needed
- **Lazy Loading** - Load components on demand
- **Image Optimization** - Compressed and optimized images
- **Bundle Analysis** - Monitor bundle size
- **Caching** - Browser caching strategies

### Performance Metrics
- **First Contentful Paint** - < 1.5s
- **Largest Contentful Paint** - < 2.5s
- **Cumulative Layout Shift** - < 0.1
- **First Input Delay** - < 100ms

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Project Structure
```
src/
├── components/     # Reusable components
├── contexts/       # React contexts
├── pages/          # Page components
├── services/       # API services
├── styles/         # Global styles
└── utils/          # Utility functions
```

## 🧪 Testing

### Testing Setup
- **Jest** - Unit testing framework
- **React Testing Library** - Component testing
- **Cypress** - End-to-end testing

### Running Tests
```bash
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
