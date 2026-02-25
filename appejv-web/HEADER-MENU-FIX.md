# Header Menu Fix - View Transitions Compatibility ✅

## Vấn đề

Menu ngôn ngữ và mobile menu trong header không click được sau khi chuyển trang với View Transitions.

## Nguyên nhân

Khi sử dụng View Transitions trong Astro:
- Scripts trong components chỉ chạy 1 lần khi page load đầu tiên
- Khi navigate sang trang khác, DOM được swap nhưng scripts không re-run
- Event listeners không được attach lại cho elements mới
- Kết quả: Buttons không hoạt động sau lần navigate đầu tiên

## Giải pháp

### 1. Sử dụng Astro View Transitions Events

Astro cung cấp các events đặc biệt cho View Transitions:
- `astro:page-load` - Fires on initial page load và sau mỗi navigation
- `astro:after-swap` - Fires sau khi DOM được swap (recommended)

### 2. Re-initialize Scripts

Wrap initialization logic trong function và gọi lại sau mỗi navigation:

```typescript
function initComponent() {
  // Get elements
  const button = document.getElementById('my-button')
  
  // Remove old listeners by cloning
  const newButton = button.cloneNode(true)
  button.parentNode?.replaceChild(newButton, button)
  
  // Add new listeners
  newButton.addEventListener('click', handler)
}

// Initial load
document.addEventListener('DOMContentLoaded', initComponent)

// After View Transitions
document.addEventListener('astro:after-swap', initComponent)
document.addEventListener('astro:page-load', initComponent)
```

### 3. Clone Elements để Remove Old Listeners

Thay vì track và remove từng listener, clone element để remove tất cả:

```typescript
const newElement = oldElement.cloneNode(true)
oldElement.parentNode?.replaceChild(newElement, oldElement)
```

## Files Fixed

### 1. LanguageSwitcher.astro

**Before:**
```typescript
const button = document.getElementById('language-button')
button?.addEventListener('click', toggleMenu)
```

**After:**
```typescript
function initLanguageSwitcher() {
  const button = document.getElementById('language-button')
  
  // Clone to remove old listeners
  const newButton = button.cloneNode(true)
  button.parentNode?.replaceChild(newButton, button)
  
  // Add new listener
  newButton.addEventListener('click', toggleMenu)
}

document.addEventListener('DOMContentLoaded', initLanguageSwitcher)
document.addEventListener('astro:after-swap', initLanguageSwitcher)
document.addEventListener('astro:page-load', initLanguageSwitcher)
```

### 2. BaseLayout.astro (Mobile Menu)

**Before:**
```typescript
const menuButton = document.getElementById('mobile-menu-button')
menuButton?.addEventListener('click', openMenu)
```

**After:**
```typescript
function initMobileMenu() {
  const menuButton = document.getElementById('mobile-menu-button')
  
  // Clone to remove old listeners
  const newMenuButton = menuButton.cloneNode(true)
  menuButton.parentNode?.replaceChild(newMenuButton, menuButton)
  
  // Add new listener
  newMenuButton.addEventListener('click', openMenu)
}

document.addEventListener('DOMContentLoaded', initMobileMenu)
document.addEventListener('astro:after-swap', initMobileMenu)
document.addEventListener('astro:page-load', initMobileMenu)
```

## Testing

### Test Cases:
1. ✅ Click language menu on homepage
2. ✅ Navigate to another page
3. ✅ Click language menu again (should work)
4. ✅ Open mobile menu
5. ✅ Navigate to another page
6. ✅ Open mobile menu again (should work)
7. ✅ Test on all pages (vi, en, cn)

### Browser Console:
- Không còn warning "elements not found"
- Event listeners hoạt động sau mỗi navigation

## Best Practices cho View Transitions

### 1. Always wrap initialization in functions
```typescript
function init() { /* ... */ }
```

### 2. Listen to View Transitions events
```typescript
document.addEventListener('astro:after-swap', init)
```

### 3. Check if elements exist
```typescript
if (!element) {
  console.warn('Element not found')
  return
}
```

### 4. Clone elements to remove old listeners
```typescript
const newEl = oldEl.cloneNode(true)
oldEl.parentNode?.replaceChild(newEl, oldEl)
```

### 5. Return cleanup functions (optional)
```typescript
function init() {
  const handler = () => {}
  element.addEventListener('click', handler)
  
  return () => {
    element.removeEventListener('click', handler)
  }
}
```

## Lưu ý

- View Transitions chỉ hoạt động trên same-origin navigation
- Scripts trong `<head>` chỉ chạy 1 lần
- Scripts trong `<body>` có thể re-run nếu trong slot content
- Prefer `astro:after-swap` over `astro:page-load` cho better timing

## Tài liệu tham khảo

- [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
- [View Transitions Events](https://docs.astro.build/en/guides/view-transitions/#lifecycle-events)
