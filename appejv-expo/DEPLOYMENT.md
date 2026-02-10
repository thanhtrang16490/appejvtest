# Deployment Guide - APPE JV Expo

Hướng dẫn deploy ứng dụng APPE JV Expo lên App Store và Google Play.

## Yêu cầu

- Tài khoản Expo (https://expo.dev)
- Apple Developer Account ($99/năm) cho iOS
- Google Play Developer Account ($25 một lần) cho Android
- EAS CLI installed: `npm install -g eas-cli`

## Setup EAS (Expo Application Services)

### 1. Login vào Expo
```bash
eas login
```

### 2. Configure project
```bash
eas build:configure
```

Điều này sẽ tạo file `eas.json`:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

## Build cho Development

### Android APK (Internal Testing)
```bash
eas build --platform android --profile preview
```

### iOS Simulator Build
```bash
eas build --platform ios --profile preview
```

## Build cho Production

### 1. Update app.json

```json
{
  "expo": {
    "name": "APPE JV",
    "slug": "appejv-expo",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.appejv.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.appejv.android",
      "versionCode": 1
    }
  }
}
```

### 2. Build Android (AAB for Play Store)
```bash
eas build --platform android --profile production
```

### 3. Build iOS (for App Store)
```bash
eas build --platform ios --profile production
```

### 4. Build cả hai platforms
```bash
eas build --platform all --profile production
```

## Submit lên Store

### Android (Google Play)

#### Bước 1: Tạo app trên Google Play Console
1. Truy cập https://play.google.com/console
2. Tạo app mới
3. Điền thông tin app

#### Bước 2: Submit build
```bash
eas submit --platform android
```

Hoặc upload thủ công file AAB từ EAS build.

### iOS (App Store)

#### Bước 1: Tạo app trên App Store Connect
1. Truy cập https://appstoreconnect.apple.com
2. Tạo app mới
3. Điền thông tin app

#### Bước 2: Submit build
```bash
eas submit --platform ios
```

## Environment Variables

### Production Environment
Tạo file `.env.production`:

```env
EXPO_PUBLIC_API_URL=https://api.appejv.app/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://mrcmratcnlsoxctsbalt.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
EXPO_PUBLIC_APP_URL=https://app.appejv.app
```

### Build với environment variables
```bash
eas build --platform all --profile production --non-interactive
```

## Update Over-The-Air (OTA)

Expo cho phép push updates mà không cần submit lại lên store:

```bash
eas update --branch production --message "Fix bug XYZ"
```

### Configure OTA updates trong app.json
```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/[your-project-id]"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

## CI/CD với GitHub Actions

Tạo file `.github/workflows/eas-build.yml`:

```yaml
name: EAS Build

on:
  push:
    branches:
      - main
      - production

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          
      - name: Setup Expo
        uses: expo/expo-github-action@v8
        with:
          expo-version: latest
          eas-version: latest
          token: ${{ secrets.EXPO_TOKEN }}
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build on EAS
        run: eas build --platform all --non-interactive --no-wait
```

## Versioning

### Semantic Versioning
- **Major**: Breaking changes (1.0.0 → 2.0.0)
- **Minor**: New features (1.0.0 → 1.1.0)
- **Patch**: Bug fixes (1.0.0 → 1.0.1)

### Auto-increment version
```bash
# iOS buildNumber và Android versionCode tự động tăng
eas build --platform all --profile production --auto-submit
```

## Testing trước khi Release

### 1. Internal Testing (TestFlight/Internal Testing)
```bash
eas build --platform all --profile preview
```

### 2. Beta Testing
- iOS: Sử dụng TestFlight
- Android: Sử dụng Google Play Internal Testing

### 3. Production Release
```bash
eas build --platform all --profile production
eas submit --platform all
```

## Monitoring & Analytics

### Setup Sentry (Error Tracking)
```bash
npm install @sentry/react-native
```

### Setup Firebase Analytics
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

## App Store Optimization (ASO)

### Screenshots
- Chuẩn bị screenshots cho các kích thước màn hình
- iOS: 6.5", 5.5", iPad Pro
- Android: Phone, 7" Tablet, 10" Tablet

### App Description
- Tiếng Việt (primary)
- English (secondary)

### Keywords
- iOS: 100 characters
- Android: Unlimited trong description

### App Icon
- iOS: 1024x1024 px
- Android: 512x512 px

## Checklist trước khi Release

- [ ] Test trên nhiều devices
- [ ] Test authentication flow
- [ ] Test API integration
- [ ] Test offline behavior
- [ ] Check performance
- [ ] Review app permissions
- [ ] Update privacy policy
- [ ] Prepare marketing materials
- [ ] Setup crash reporting
- [ ] Setup analytics
- [ ] Test deep linking
- [ ] Test push notifications
- [ ] Review app store guidelines

## Post-Release

### Monitor
- Crash reports
- User reviews
- Analytics data
- Performance metrics

### Respond
- User feedback
- Bug reports
- Feature requests

### Update
- Regular bug fixes
- New features
- Performance improvements

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [EAS Update Documentation](https://docs.expo.dev/eas-update/introduction/)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-content-policy/)
