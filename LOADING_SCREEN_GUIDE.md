# MediSync Loading Screen

Professional animated loading page for MediSync Hospital Management System with elegant, futuristic, and healthcare-focused design.

## Features ✨

- **Animated Logo**: Glowing MediSync logo with pulse/heartbeat animation
- **Heartbeat Line**: Continuous animation across the medical cross
- **Circuit Lines**: Sequential lighting showing data flow
- **Rotating Glow Halo**: Soft halo effect behind logo for depth
- **Floating Particles**: Subtle particle motion in background
- **Progress Bar**: Smooth animated progress indicator with shimmer effect
- **Medical Patterns**: Faint ECG lines, medical icons at low opacity
- **Smooth Transitions**: Fade-in/out with micro-interactions
- **Gradient Background**: Soft blend from #E6F1FA to white

## Technologies Used

- **React** with Framer Motion for animations
- **Tailwind CSS** for styling
- **SVG** for custom medical patterns

## Usage

### Method 1: Standalone Loading Page

Visit the loading demo page:

```
http://localhost:5173/loading
```

### Method 2: Use as Component

```jsx
import LoadingScreen from './components/LoadingScreen'

function MyComponent() {
  const [loading, setLoading] = useState(true)
  
  if (loading) {
    return <LoadingScreen />
  }
  
  return <div>Your Content</div>
}
```

### Method 3: Use with Context (Recommended for Global Loading)

1. **Wrap your app with LoadingProvider** in `main.jsx`:

```jsx
import { LoadingProvider } from './context/LoadingContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <LoadingProvider>
            <App />
          </LoadingProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

2. **Use loading in any component**:

```jsx
import { useLoading } from '../context/LoadingContext'

function MyComponent() {
  const { showLoading, hideLoading } = useLoading()
  
  const handleAction = async () => {
    showLoading()
    await someAsyncOperation()
    hideLoading()
  }
  
  return <button onClick={handleAction}>Do Something</button>
}
```

### Method 4: Use on App Initialization

```jsx
// In App.jsx or main component
import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [appReady, setAppReady] = useState(false)
  
  useEffect(() => {
    // Simulate app initialization
    const initApp = async () => {
      await loadConfig()
      await checkAuth()
      await loadResources()
      setAppReady(true)
    }
    
    initApp()
  }, [])
  
  if (!appReady) {
    return <LoadingScreen />
  }
  
  return <YourApp />
}
```

## Animation Details

### 1. **Logo Pulse Animation**
- Subtle scale animation (1 → 1.05 → 1)
- Duration: 1.5s, infinite loop
- Creates breathing effect

### 2. **Heartbeat Overlay**
- Red line that pulses across logo
- Opacity: 0 → 1 → 0
- Duration: 1.5s, infinite

### 3. **Circuit Lines**
- 8 radial lines animating from center
- Sequential delays (0.2s stagger)
- Blue-to-transparent gradient

### 4. **Rotating Halo**
- Full 360° rotation in 8s
- Simultaneous scale pulse
- Radial gradient (blue to green)

### 5. **Floating Particles**
- 20 random particles
- Y-axis movement with opacity fade
- Variable durations (3-5s)

### 6. **Progress Bar**
- Auto-increments from 0-100%
- Shimmer overlay effect
- Smooth gradient (blue → cyan → green)

### 7. **Background Patterns**
- Animated ECG line pattern
- Rotating medical cross icon
- Pulsing clock icon
- Floating hospital icon

## Customization

### Change Colors

```jsx
// In LoadingScreen.jsx, modify gradient colors:
bg-gradient-to-br from-[#E6F1FA] via-white to-[#F0F9FF]

// Adjust accent colors:
from-blue-500 via-cyan-500 to-green-500
```

### Adjust Animation Speed

```jsx
// Modify transition durations:
transition={{ duration: 2, repeat: Infinity }} // 2 seconds

// Change progress bar speed:
const timer = setInterval(() => {
  setProgress((prev) => prev + 2) // Increment by 2
}, 50) // Every 50ms
```

### Change Loading Text

```jsx
<p className="text-gray-600 text-lg font-medium mb-6">
  Loading Dashboard... // Change this text
</p>
```

### Add Status Messages

```jsx
<motion.div className="flex items-center gap-2 text-sm text-gray-500">
  <motion.div className="w-2 h-2 bg-green-500 rounded-full" />
  Your Custom Status Message
</motion.div>
```

## Performance Notes

- Uses `framer-motion` for hardware-accelerated animations
- SVG patterns for scalable graphics
- Optimized particle count (20 particles)
- Efficient re-renders with proper key usage

## Browser Support

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## Tips

1. **Minimum Display Time**: Show loading for at least 1-2 seconds for smooth UX
2. **Progress Tracking**: Hook up to real loading progress if available
3. **Error Handling**: Add error state if loading fails
4. **Accessibility**: Loading screen includes proper ARIA attributes

## Export Options

### As Lottie JSON
Use tools like Lottie Creator to convert Framer Motion animations

### As MP4 Loop
Use screen recording tools or export from design tools

### As React Component
Already provided - just copy `LoadingScreen.jsx`

## Examples

### Show During Data Fetch
```jsx
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetchData()
    .then(() => setLoading(false))
    .catch(() => setLoading(false))
}, [])
```

### Show During Route Change
```jsx
const navigate = useNavigate()
const { showLoading, hideLoading } = useLoading()

const handleNavigate = (path) => {
  showLoading()
  setTimeout(() => {
    navigate(path)
    hideLoading()
  }, 1500)
}
```

## Files Created

1. `src/components/LoadingScreen.jsx` - Main loading component
2. `src/pages/LoadingDemo.jsx` - Demo page
3. `src/context/LoadingContext.jsx` - Global loading context
4. `LOADING_SCREEN_GUIDE.md` - This documentation

## Design Philosophy

**Elegant** - Smooth, professional animations without being distracting
**Futuristic** - Modern tech feel with circuit patterns and glows
**Healthcare-Focused** - Medical icons, heartbeat, ECG patterns
**Premium** - Apple Health / Hospital ERP system quality

---

Built with ❤️ for MediSync Hospital Management System
