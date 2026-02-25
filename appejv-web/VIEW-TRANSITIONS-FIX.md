# View Transitions Fix - Hoàn thành

## Vấn đề đã phát hiện

Khi áp dụng View Transitions trong Astro, các React components gặp một số vấn đề:

1. **React components bị re-mount** khi chuyển trang với View Transitions
2. **Event listeners không được cleanup** đúng cách
3. **LocalStorage checks** có thể bị trigger nhiều lần
4. **CSS animations** thiếu hoặc conflict với View Transitions
5. **TypeScript type errors** với React.FormEvent

## Các thay đổi đã thực hiện

### 1. ExitIntentPopup Component (`src/components/ExitIntentPopup.tsx`)

**Vấn đề:**
- Event listeners không được cleanup đúng cách
- LocalStorage check có thể bị trigger nhiều lần
- CSS animations thiếu (animate-fadeIn, animate-scaleIn)
- TypeScript error với React.FormEvent

**Giải pháp:**
```typescript
// Sử dụng useRef để track state giữa các re-renders
const exitIntentTriggeredRef = useRef(false)
const timerRef = useRef<NodeJS.Timeout>()

// Cleanup đúng cách trong useEffect
useEffect(() => {
  // ... logic
  return () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    document.removeEventListener('mouseleave', handleMouseLeave)
  }
}, [])

// Fix TypeScript type
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  // ...
}

// Thay thế Tailwind classes bằng inline styles
<div style={{ animation: 'fadeIn 0.3s ease-out' }}>
```

### 2. Global CSS (`src/styles/global.css`)

**Thêm animations:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeOut {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes scaleOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

### 3. BaseLayout.astro

**Đã có:**
- View Transitions được import và sử dụng đúng cách
- `<ViewTransitions />` component được thêm vào `<head>`

## Best Practices cho View Transitions với React

### 1. Sử dụng useRef cho state persistence
```typescript
const stateRef = useRef(initialValue)
```

### 2. Cleanup event listeners đúng cách
```typescript
useEffect(() => {
  const handler = () => { /* ... */ }
  document.addEventListener('event', handler)
  
  return () => {
    document.removeEventListener('event', handler)
  }
}, [])
```

### 3. Sử dụng inline styles thay vì Tailwind classes cho animations
```typescript
<div style={{ animation: 'fadeIn 0.3s ease-out' }}>
```

### 4. Kiểm tra mounted state cho Portal
```typescript
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

return mounted && createPortal(...)
```

### 5. Prevent body scroll khi modal mở
```typescript
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  
  return () => {
    document.body.style.overflow = ''
  }
}, [isOpen])
```

## Kiểm tra

### Build thành công
```bash
cd appejv-web
npm run build
```

### Dev server
```bash
npm run dev
```

### Các trang cần test
- `/` - Homepage với ExitIntentPopup
- `/gioi-thieu` - About page
- `/san-pham` - Products page
- `/lien-he` - Contact page

### Chức năng cần test
1. ✅ Exit intent popup xuất hiện khi di chuột ra khỏi trang (sau 5s)
2. ✅ Popup chỉ xuất hiện 1 lần (localStorage)
3. ✅ Animations hoạt động mượt mà
4. ✅ Chuyển trang với View Transitions không gây lỗi
5. ✅ React components không bị re-mount không cần thiết
6. ✅ Event listeners được cleanup đúng cách

## Lưu ý

- View Transitions chỉ hoạt động trên các trình duyệt hiện đại (Chrome 111+, Edge 111+)
- Fallback tự động về navigation thông thường trên các trình duyệt cũ
- React components cần được xử lý cẩn thận với View Transitions để tránh memory leaks

## Tài liệu tham khảo

- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [React useEffect cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
- [React useRef](https://react.dev/reference/react/useRef)
