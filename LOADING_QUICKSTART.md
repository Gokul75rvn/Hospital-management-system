# MediSync Loading Screen - Quick Start

## 🚀 View the Loading Animation

The professional animated loading screen is now available at:

**URL:** `http://localhost:5173/loading`

## 📋 Quick Usage Examples

### 1. Standalone Loading Page
```jsx
import LoadingScreen from './components/LoadingScreen'

function MyPage() {
  return <LoadingScreen />
}
```

### 2. Conditional Loading
```jsx
const [isLoading, setIsLoading] = useState(true)

useEffect(() => {
  // Load data
  fetchData().finally(() => setIsLoading(false))
}, [])

if (isLoading) return <LoadingScreen />
```

### 3. Global Loading (Recommended)
```jsx
// Wrap your app with LoadingProvider
import { LoadingProvider } from './context/LoadingContext'

// Then use in any component:
import { useLoading } from './context/LoadingContext'

const { showLoading, hideLoading } = useLoading()

const handleAction = async () => {
  showLoading()
  await apiCall()
  hideLoading()
}
```

## ✨ Features Included

✅ Animated MediSync logo with pulse effect  
✅ Heartbeat line animation  
✅ Circuit lines showing data flow  
✅ Rotating glow halo  
✅ Floating particles  
✅ Progress bar with shimmer  
✅ Medical background patterns (ECG, icons)  
✅ Smooth fade transitions  
✅ Healthcare-focused gradient (#E6F1FA)  

## 🎨 Design Elements

- **Logo**: Pulses and glows at center
- **Heartbeat**: Red line across logo (1.5s cycle)
- **Circuits**: 8 radial lines, sequential animation
- **Halo**: 360° rotation (8s) with scale pulse
- **Particles**: 20 floating elements
- **Progress**: Auto-increments 0→100%
- **Background**: Animated ECG patterns + medical icons

## 🛠️ Files Created

1. `src/components/LoadingScreen.jsx` - Main component
2. `src/pages/LoadingDemo.jsx` - Demo page with replay
3. `src/context/LoadingContext.jsx` - Global loading state
4. `LOADING_SCREEN_GUIDE.md` - Full documentation

## 🎯 Test It Now

1. **Visit:** http://localhost:5173/loading
2. **Or click:** "Loading Demo" in the nav menu
3. **Watch:** 5-second animation with auto-replay button

## 💡 Pro Tips

- Show loading for minimum 1-2 seconds for smooth UX
- Use LoadingContext for global app loading state
- Customize colors in the component (search for gradient classes)
- Adjust animation speeds via Framer Motion transition props

---

**Navigation:** Home → "Loading Demo" link in top menu  
**Docs:** See LOADING_SCREEN_GUIDE.md for full details
