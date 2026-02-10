# Troubleshooting Guide - APPE JV Expo

## Common Issues & Solutions

### 1. ❌ Cannot find module 'babel-preset-expo'

**Error:**
```
ERROR Error: Cannot find module 'babel-preset-expo'
```

**Solution:**
```bash
npm install babel-preset-expo --save-dev --legacy-peer-deps
```

---

### 1.1. ❌ Cannot find module '@babel/plugin-proposal-nullish-coalescing-operator'

**Error:**
```
Error: Cannot find module '@babel/plugin-proposal-nullish-coalescing-operator'
```

**Solution:**
```bash
npm install @babel/plugin-transform-nullish-coalescing-operator @babel/plugin-transform-optional-chaining --save-dev --legacy-peer-deps
```

---

### 1.2. ❌ Cannot find module 'react-native-worklets/plugin'

**Error:**
```
Error: Cannot find module 'react-native-worklets/plugin'
```

**Solution:**
```bash
npm install react-native-worklets-core --legacy-peer-deps
npx expo start --clear
```

---

### 1.3. ⚠️ Package version warnings

**Warning:**
```
The following packages should be updated for best compatibility
```

**Solution:**
```bash
npx expo install react-native-gesture-handler@~2.28.0 react-native-reanimated@~4.1.1 react-native-screens@~4.16.0 -- --legacy-peer-deps
```

---

### 2. ❌ Unable to resolve asset

**Error:**
```
Unable to resolve asset "./assets/splash.png" from "splash.image"
```

**Solution:**
Đảm bảo các file assets tồn tại:
```bash
ls -la assets/
```

Cần có các file:
- `icon.png` (1024x1024)
- `splash.png` (1284x2778)
- `adaptive-icon.png` (1024x1024)
- `favicon.png` (48x48)

Copy từ appejv-app:
```bash
cp ../appejv-app/public/appejv-logo.png assets/icon.png
cp assets/icon.png assets/splash.png
cp assets/icon.png assets/adaptive-icon.png
cp assets/icon.png assets/favicon.png
```

---

### 3. ❌ Port already in use

**Error:**
```
Port 8081 is running this app in another window
```

**Solution:**
```bash
# Kill process on port 8081
lsof -ti:8081 | xargs kill -9

# Or use different port
npx expo start --port 8082
```

---

### 4. ❌ Metro bundler cache issues

**Error:**
```
Metro bundler failed to start
```

**Solution:**
```bash
# Clear cache
npx expo start --clear

# Or
npm run reset

# Or delete cache manually
rm -rf .expo
rm -rf node_modules/.cache
```

---

### 5. ❌ Dependency conflicts

**Error:**
```
npm error ERESOLVE could not resolve
```

**Solution:**
```bash
# Use legacy peer deps
npm install --legacy-peer-deps

# Or force install
npm install --force
```

---

### 6. ❌ TypeScript errors

**Error:**
```
Cannot find module '@/*' or its corresponding type declarations
```

**Solution:**
```bash
# Regenerate TypeScript config
npx expo customize tsconfig.json

# Or restart TypeScript server in VS Code
# Cmd+Shift+P -> "TypeScript: Restart TS Server"
```

---

### 7. ❌ Supabase connection failed

**Error:**
```
Error: Invalid Supabase URL or Key
```

**Solution:**
1. Check `.env` file exists
2. Verify Supabase credentials:
```bash
cat .env
```
3. Make sure variables start with `EXPO_PUBLIC_`
4. Restart Expo:
```bash
npx expo start --clear
```

---

### 8. ❌ API connection failed

**Error:**
```
Network request failed
```

**Solution:**
1. Check API is running:
```bash
curl http://localhost:8081/api/v1/health
```

2. Start API if not running:
```bash
cd ../appejv-api
make run
```

3. Check `.env` has correct API URL:
```env
EXPO_PUBLIC_API_URL=http://localhost:8081/api/v1
```

---

### 9. ❌ iOS Simulator not opening

**Error:**
```
Unable to run simctl
```

**Solution:**
```bash
# Open Xcode and accept license
sudo xcodebuild -license accept

# Open simulator manually
open -a Simulator

# Then press 'i' in Expo terminal
```

---

### 10. ❌ Android Emulator not opening

**Error:**
```
No Android emulators found
```

**Solution:**
1. Open Android Studio
2. Tools -> AVD Manager
3. Create/Start an emulator
4. Then press 'a' in Expo terminal

---

## Quick Reset

If nothing works, try complete reset:

```bash
# 1. Clean everything
rm -rf node_modules
rm -rf .expo
rm package-lock.json

# 2. Reinstall
npm install --legacy-peer-deps

# 3. Install babel preset
npm install babel-preset-expo --save-dev --legacy-peer-deps

# 4. Clear cache and start
npx expo start --clear
```

---

## Environment Setup Checklist

Before running the app, ensure:

- [ ] Node.js >= 20.9.0 installed
- [ ] npm >= 10.0.0 installed
- [ ] Expo CLI installed (`npm install -g expo-cli`)
- [ ] `.env` file created and configured
- [ ] Assets exist in `assets/` folder
- [ ] `babel-preset-expo` installed
- [ ] appejv-api is running (if testing API)
- [ ] iOS Simulator or Android Emulator ready

---

## Getting Help

1. Check this troubleshooting guide
2. Review [QUICK-START.md](./QUICK-START.md)
3. Check [Expo Documentation](https://docs.expo.dev/)
4. Search [Expo Forums](https://forums.expo.dev/)
5. Ask team members

---

## Useful Commands

```bash
# Start with cache clear
npx expo start --clear

# Start on specific port
npx expo start --port 8082

# Start in tunnel mode (for physical device)
npx expo start --tunnel

# Check Expo doctor
npx expo-doctor

# Update Expo SDK
npx expo install --fix

# View logs
npx expo start --dev-client

# Build preview
eas build --platform android --profile preview
```

---

## Development Tips

### Hot Reload Not Working
- Shake device to open Dev Menu
- Enable "Fast Refresh"
- Or press `r` in terminal to reload

### Slow Performance
- Use Release build instead of Debug
- Disable Remote JS Debugging
- Check for memory leaks
- Optimize images

### Network Issues on Physical Device
- Use same WiFi network
- Or use tunnel mode: `npx expo start --tunnel`
- Or use ngrok for API

---

## Platform-Specific Issues

### iOS
- Accept Xcode license: `sudo xcodebuild -license accept`
- Install CocoaPods: `sudo gem install cocoapods`
- Clear derived data: `rm -rf ~/Library/Developer/Xcode/DerivedData`

### Android
- Set ANDROID_HOME environment variable
- Accept Android licenses: `sdkmanager --licenses`
- Clear gradle cache: `cd android && ./gradlew clean`

---

## Still Having Issues?

Create an issue with:
1. Error message (full stack trace)
2. Steps to reproduce
3. Environment info: `npx expo-doctor`
4. Screenshots if applicable
