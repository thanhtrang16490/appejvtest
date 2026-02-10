# APPE JV Android App

Android native app built with Kotlin and Jetpack Compose.

## Tech Stack

- **Language:** Kotlin 1.9+
- **UI:** Jetpack Compose + Material 3
- **Architecture:** MVVM + Clean Architecture
- **DI:** Hilt
- **Networking:** Retrofit + OkHttp
- **Auth:** Supabase Kotlin SDK
- **Async:** Coroutines + Flow
- **Navigation:** Jetpack Navigation Compose
- **Image Loading:** Coil
- **Security:** EncryptedSharedPreferences

## Requirements

- Android Studio Hedgehog or later
- JDK 17
- Android SDK 34
- Minimum Android 7.0 (API 24)

## Setup

1. Clone the repository
2. Open project in Android Studio
3. Sync Gradle
4. Run on emulator or device

## Project Structure

```
app/
├── core/
│   ├── auth/          # Authentication & token management
│   ├── data/          # Data models
│   ├── di/            # Dependency injection
│   ├── network/       # API client
│   └── utils/         # Utilities & constants
├── features/
│   ├── auth/          # Login, logout
│   ├── customer/      # Customer features
│   └── sales/         # Sales features
└── ui/
    ├── navigation/    # Navigation graph
    └── theme/         # Theme, colors, typography
```

## Features Implemented

### Phase 1: Core & Authentication ✅
- [x] Project setup with Jetpack Compose
- [x] Hilt dependency injection
- [x] Retrofit API client
- [x] Encrypted token storage
- [x] Login screen with validation
- [x] Role-based navigation
- [x] Material 3 theme

### Phase 2: Customer Features (TODO)
- [ ] Customer dashboard
- [ ] Products list & detail
- [ ] Orders list & detail
- [ ] Selling screen
- [ ] Account management

### Phase 3: Sales Features (TODO)
- [ ] Sales dashboard
- [ ] Inventory management
- [ ] Customer management
- [ ] Order management
- [ ] Reports
- [ ] Settings

## API Configuration

API endpoint is configured in `Constants.kt`:
- Base URL: `https://api.appejv.app/api/v1/`
- Supabase URL: `https://mrcmratcnlsoxctsbalt.supabase.co`

## Build

### Debug Build
```bash
./gradlew assembleDebug
```

### Release Build
```bash
./gradlew assembleRelease
```

## Testing

```bash
./gradlew test
./gradlew connectedAndroidTest
```

## License

© 2026 APPE JV. All rights reserved.
