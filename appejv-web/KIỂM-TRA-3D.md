# Hướng dẫn kiểm tra 3D Component

## Tình trạng hiện tại

✅ **Đã hoàn thành:**
- Component Three.js đã được tạo (`EcosystemOrbit3D.tsx`)
- Wrapper component với lazy loading (`EcosystemOrbit3DWrapper.tsx`)
- Component đã được thêm vào trang chủ với `client:only="react"`
- Dependencies đã được cài đặt và optimize bởi Vite
- Server đang chạy không có lỗi

## Cách kiểm tra

### 1. Mở trang test
Truy cập: http://localhost:4321/test-3d

Trang này có component 3D đơn giản để test.

### 2. Kiểm tra Console trong Browser
Mở DevTools (F12) và xem tab Console:
- Nếu có lỗi về Three.js, WebGL, hoặc React → Component không load được
- Nếu không có lỗi → Component đang load

### 3. Kiểm tra Elements
Trong DevTools, tab Elements:
- Tìm `<astro-island>` element
- Bên trong nên có `<canvas>` element (từ Three.js)
- Nếu không có canvas → Component chưa hydrate

### 4. Kiểm tra Network
Tab Network trong DevTools:
- Xem có load được các file:
  - `EcosystemOrbit3DWrapper.tsx`
  - `EcosystemOrbit3D.tsx`
  - `three`, `@react-three/fiber`, `@react-three/drei`

## Các vấn đề có thể gặp

### Vấn đề 1: Component không hiển thị
**Nguyên nhân:** Component đang load nhưng có lỗi JavaScript

**Giải pháp:**
1. Mở Console trong browser
2. Xem lỗi cụ thể
3. Có thể cần sửa code trong component

### Vấn đề 2: Canvas bị ẩn
**Nguyên nhân:** CSS hoặc layout issue

**Giải pháp:**
1. Kiểm tra trong Elements tab
2. Xem canvas có `display: none` hoặc `visibility: hidden`
3. Kiểm tra height/width của canvas

### Vấn đề 3: WebGL không support
**Nguyên nhân:** Browser không hỗ trợ WebGL

**Giải pháp:**
1. Thử browser khác (Chrome, Firefox, Safari)
2. Enable hardware acceleration trong browser settings

### Vấn đề 4: Component chưa hydrate
**Nguyên nhân:** React hoặc Astro integration issue

**Giải pháp:**
1. Restart dev server
2. Clear browser cache
3. Xóa folder `.astro` và restart

## Commands để debug

### Restart dev server
```bash
cd appejv-web
npm run dev
```

### Clear cache và rebuild
```bash
cd appejv-web
rm -rf .astro node_modules/.vite
npm run dev
```

### Check if Three.js is installed
```bash
cd appejv-web
npm list three @react-three/fiber @react-three/drei
```

## Files liên quan

- `src/components/EcosystemOrbit3D.tsx` - Component Three.js chính
- `src/components/EcosystemOrbit3DWrapper.tsx` - Wrapper với lazy loading
- `src/pages/index.astro` - Trang chủ (dòng ~217)
- `src/pages/test-3d.astro` - Trang test đơn giản

## So sánh với Next.js version

Để so sánh, bạn có thể:

1. Start Next.js app:
```bash
cd appejv-app
npm run dev
```

2. Mở http://localhost:3000 để xem bản gốc

3. So sánh với http://localhost:4321 (Astro version)

## Nếu vẫn không thấy 3D

Hãy cho tôi biết:
1. Có lỗi gì trong Console không?
2. Có thấy `<canvas>` element trong Elements tab không?
3. Có thấy loading spinner không?
4. Hoặc chỉ thấy khoảng trống?

Tôi sẽ giúp debug tiếp!
