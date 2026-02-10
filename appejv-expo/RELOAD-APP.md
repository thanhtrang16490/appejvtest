# Reload App để Áp Dụng Modal Popup

## Vấn đề
App vẫn hiển thị drawer thay vì modal popup mặc dù code đã được cập nhật.

## Nguyên nhân
- Metro bundler cache
- React Native cache
- App chưa reload code mới

## Giải pháp

### Cách 1: Clear cache và restart (Khuyến nghị)
```bash
cd appejv-expo

# Stop app nếu đang chạy (Ctrl+C)

# Clear cache
npm start -- --reset-cache

# Hoặc dùng script có sẵn
./clear-cache.sh
```

### Cách 2: Reload trong app
1. Mở app trên điện thoại/emulator
2. Shake device (hoặc Cmd+D trên iOS, Cmd+M trên Android)
3. Chọn "Reload"

### Cách 3: Restart hoàn toàn
```bash
cd appejv-expo

# Stop app (Ctrl+C)

# Clear all cache
rm -rf node_modules/.cache
rm -rf .expo

# Restart
npm start
```

### Cách 4: Force reload trong terminal
Trong terminal đang chạy Metro bundler:
- Press `r` để reload
- Press `R` để reload và clear cache

## Xác nhận Modal đã hoạt động

Sau khi reload, kiểm tra:
1. ✅ Click vào product card
2. ✅ Modal slide từ dưới lên (không phải navigate sang trang mới)
3. ✅ Có backdrop mờ phía sau
4. ✅ Có thể scroll nội dung trong modal
5. ✅ Click backdrop hoặc nút X để đóng modal
6. ✅ Màu xanh lá #10b981

## Code đã được cập nhật
- File: `app/(customer)/products.tsx`
- Modal component: ✅ Đã implement
- handleProductPress: ✅ Set state thay vì navigate
- showProductDetail: ✅ Control modal visibility
- Modal type: `animationType="slide"` với `transparent={true}`

## Nếu vẫn không hoạt động
1. Check console log có lỗi không
2. Verify file `products.tsx` có đúng code mới không
3. Restart Metro bundler hoàn toàn
4. Rebuild app nếu cần: `npx expo start -c`
