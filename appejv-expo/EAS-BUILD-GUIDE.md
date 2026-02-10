# EAS Build & Deploy Guide

## Project Info
- **Project ID**: 79692cfc-9c63-4807-89cc-ed56cc0903bc
- **Slug**: appejv
- **Owner**: thanhtrang16490
- **Bundle ID (iOS)**: com.appejv.app
- **Package (Android)**: com.appejv.android

## Prerequisites
✅ EAS CLI installed globally
✅ Project linked to EAS
✅ Expo account logged in

## Build Commands

### 1. Build for Android (APK - Preview)
```bash
cd appejv-expo
eas build --platform android --profile preview
```

### 2. Build for Android (Production)
```bash
eas build --platform android --profile production
```

### 3. Build for iOS (Development)
```bash
eas build --platform ios --profile development
```

### 4. Build for iOS (Production)
```bash
eas build --platform ios --profile production
```

### 5. Build for Both Platforms
```bash
eas build --platform all --profile preview
```

## Build Profiles

### Development
- Development client enabled
- Internal distribution
- For testing with Expo Go features

### Preview
- Internal distribution
- Android: APK format (easy to install)
- iOS: Ad-hoc distribution
- For testing before production

### Production
- Production-ready builds
- Android: APK format
- iOS: App Store distribution
- For release to stores

## Environment Variables

Nếu cần environment variables trong build, tạo file `.env.production`:

```bash
# .env.production
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
EXPO_PUBLIC_API_URL=your_api_url
```

Hoặc set trực tiếp trong EAS:
```bash
eas secret:create --scope project --name EXPO_PUBLIC_SUPABASE_URL --value "your_value"
```

## Build Process

1. **Start Build**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Monitor Build**
   - Build sẽ chạy trên EAS servers
   - Xem progress tại: https://expo.dev/accounts/thanhtrang16490/projects/appejv/builds
   - Hoặc trong terminal

3. **Download Build**
   - Sau khi build xong, download APK/IPA từ link
   - Hoặc dùng: `eas build:download --platform android`

4. **Install on Device**
   - Android: Transfer APK và install
   - iOS: Install via TestFlight hoặc ad-hoc

## Update Over-The-Air (OTA)

Để update app mà không cần build lại:

```bash
# Update to preview channel
eas update --branch preview --message "Fix product modal"

# Update to production channel
eas update --branch production --message "Release v1.0.1"
```

## Useful Commands

### Check build status
```bash
eas build:list
```

### View build details
```bash
eas build:view [BUILD_ID]
```

### Cancel build
```bash
eas build:cancel [BUILD_ID]
```

### Configure project
```bash
eas build:configure
```

### Login to Expo
```bash
eas login
```

### Check account
```bash
eas whoami
```

## Troubleshooting

### Build fails with "Missing credentials"
```bash
eas credentials
```

### Build fails with dependency issues
- Check `package.json` dependencies
- Ensure all native modules are compatible
- Run `npm install` locally first

### Environment variables not working
- Use `EXPO_PUBLIC_` prefix for client-side variables
- Set secrets with `eas secret:create`
- Check `.env.production` file

### iOS build requires Apple Developer account
- Need paid Apple Developer account ($99/year)
- Configure in EAS credentials

## Next Steps

1. **Build Preview APK**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Test on Device**
   - Download APK from build page
   - Install on Android device
   - Test all features

3. **Build Production**
   ```bash
   eas build --platform android --profile production
   ```

4. **Submit to Store** (Optional)
   ```bash
   eas submit --platform android
   ```

## Resources
- EAS Build Docs: https://docs.expo.dev/build/introduction/
- EAS Update Docs: https://docs.expo.dev/eas-update/introduction/
- Project Dashboard: https://expo.dev/accounts/thanhtrang16490/projects/appejv
