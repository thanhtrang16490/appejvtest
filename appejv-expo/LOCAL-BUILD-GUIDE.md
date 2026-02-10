# Local Build Guide - Test Trước Khi Build Trên EAS

## Cách 1: EAS Build Local (Khuyến nghị)

Build trên máy local để test và fix lỗi trước khi build trên EAS cloud.

### Prerequisites
- Android Studio (cho Android build)
- Xcode (cho iOS build - chỉ trên macOS)
- Java JDK 17+
- Android SDK

### Build Android Local
```bash
cd appejv-expo

# Build APK local
eas build --platform android --profile preview --local

# Hoặc build development
eas build --platform android --profile development --local
```

### Build iOS Local (macOS only)
```bash
eas build --platform ios --profile preview --local
```

### Ưu điểm
- ✅ Test build process trước khi lên cloud
- ✅ Fix lỗi nhanh hơn
- ✅ Không tốn build minutes trên EAS
- ✅ Build output ngay trên máy

### Nhược điểm
- ❌ Cần cài đặt Android Studio/Xcode
- ❌ Tốn thời gian setup môi trường
- ❌ Build chậm hơn cloud (tùy máy)

---

## Cách 2: Expo Prebuild + Native Build

Prebuild để generate native code, sau đó build bằng Android Studio/Xcode.

### Step 1: Prebuild
```bash
cd appejv-expo

# Generate native Android và iOS folders
npx expo prebuild

# Hoặc chỉ Android
npx expo prebuild --platform android

# Hoặc chỉ iOS
npx expo prebuild --platform ios
```

### Step 2: Build Android với Gradle
```bash
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK
./gradlew assembleRelease

# APK output: android/app/build/outputs/apk/
```

### Step 3: Build iOS với Xcode (macOS only)
```bash
cd ios

# Install pods
pod install

# Open in Xcode
open appejv.xcworkspace

# Build trong Xcode: Product > Build
```

### Ưu điểm
- ✅ Full control native code
- ✅ Debug native issues
- ✅ Customize native configs

### Nhược điểm
- ❌ Phức tạp hơn
- ❌ Cần hiểu native development
- ❌ Phải maintain native folders

---

## Cách 3: Expo Development Build

Build development client để test trên device thật.

### Build Development Client
```bash
cd appejv-expo

# Build development client
npx expo run:android

# Hoặc cho iOS
npx expo run:ios
```

### Ưu điểm
- ✅ Test trên device thật
- ✅ Hot reload
- ✅ Debug dễ dàng

### Nhược điểm
- ❌ Không phải production build
- ❌ Cần device/emulator connected

---

## Cách 4: Validate Build Trước (Nhanh nhất)

Chỉ validate mà không build thật.

### Check Dependencies
```bash
cd appejv-expo

# Check for issues
npm install

# Check TypeScript
npx tsc --noEmit

# Check Expo config
npx expo config --type public
```

### Simulate Build Process
```bash
# Test install như EAS
rm -rf node_modules package-lock.json
npm ci --include=dev

# Nếu lỗi, fix và test lại
npm install --legacy-peer-deps
```

### Check Build Configuration
```bash
# Validate eas.json
eas build:configure

# Check credentials
eas credentials

# Inspect build
eas build:inspect --platform android --profile preview
```

---

## Khuyến Nghị Workflow

### 1. Validate Trước (5 phút)
```bash
cd appejv-expo

# Clean install
rm -rf node_modules
npm install

# Check TypeScript
npx tsc --noEmit

# Test app locally
npm start
```

### 2. Build Local Nếu Cần (30-60 phút)
```bash
# Build local để test
eas build --platform android --profile preview --local
```

### 3. Build Trên EAS (10-20 phút)
```bash
# Sau khi test local OK
eas build --platform android --profile preview
```

---

## Fix Common Issues

### Issue 1: Dependency Conflicts
```bash
# Thêm .npmrc
echo "legacy-peer-deps=true" > .npmrc

# Hoặc update dependencies
npm install react@latest react-dom@latest
```

### Issue 2: TypeScript Errors
```bash
# Check errors
npx tsc --noEmit

# Fix và test lại
```

### Issue 3: Native Module Issues
```bash
# Prebuild để check
npx expo prebuild --clean

# Nếu OK, có thể build
```

### Issue 4: Environment Variables
```bash
# Test với .env.production
cp .env.example .env.production

# Edit values
nano .env.production

# Test locally
npm start
```

---

## Quick Test Commands

### Test 1: Dependencies OK?
```bash
rm -rf node_modules package-lock.json && npm ci
```

### Test 2: TypeScript OK?
```bash
npx tsc --noEmit
```

### Test 3: Expo Config OK?
```bash
npx expo config --type public
```

### Test 4: Build Config OK?
```bash
eas build:inspect --platform android --profile preview
```

### Test 5: App Runs OK?
```bash
npm start
# Test trên Expo Go hoặc emulator
```

---

## Recommended: Test Trước Khi Build EAS

```bash
#!/bin/bash
# pre-build-check.sh

echo "🔍 Checking dependencies..."
npm ci || exit 1

echo "🔍 Checking TypeScript..."
npx tsc --noEmit || exit 1

echo "🔍 Checking Expo config..."
npx expo config --type public > /dev/null || exit 1

echo "🔍 Inspecting build..."
eas build:inspect --platform android --profile preview || exit 1

echo "✅ All checks passed! Ready to build on EAS."
```

Chạy script:
```bash
chmod +x pre-build-check.sh
./pre-build-check.sh
```

---

## Kết Luận

**Nhanh nhất**: Validate dependencies + TypeScript (5 phút)
**Chắc chắn nhất**: Build local với EAS (30-60 phút)
**Cân bằng**: Validate + Build trên EAS (15-25 phút)

Với project của bạn, khuyến nghị:
1. Fix dependency conflicts (.npmrc + update React)
2. Run validate commands
3. Build trên EAS
