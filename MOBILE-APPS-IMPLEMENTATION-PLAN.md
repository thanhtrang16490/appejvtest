# Mobile Apps Implementation Plan

## Overview

Triển khai 3 mobile apps với tính năng giống 100% appejv-app:

1. **appejv-expo** - React Native (Cross-platform) ✅ Setup completed
2. **appejv-ios** - Swift (iOS Native) 
3. **appejv-android** - Kotlin (Android Native)

---

## Comparison Matrix

| Feature | Expo (RN) | iOS (Swift) | Android (Kotlin) |
|---------|-----------|-------------|------------------|
| **Development Time** | 10-15 days | 15-20 days | 15-20 days |
| **Code Sharing** | 100% shared | iOS only | Android only |
| **Performance** | Good | Excellent | Excellent |
| **Native Features** | Limited | Full access | Full access |
| **Maintenance** | Single codebase | Separate | Separate |
| **Team Required** | React/TS devs | iOS devs | Android devs |
| **Cost** | Low | High | High |

---

## Recommendation

### Option 1: Expo Only (Recommended) ⭐
**Pros:**
- Single codebase cho cả iOS và Android
- Faster development (10-15 days vs 30-40 days)
- Easier maintenance
- Lower cost
- 90% features đủ dùng

**Cons:**
- Một số native features phức tạp cần custom modules
- Performance hơi kém hơn native (nhưng không đáng kể)

**Use case:** Phù hợp cho MVP, startup, team nhỏ

### Option 2: Native Apps
**Pros:**
- Full control over platform features
- Best performance
- Best UX (platform-specific)
- Access to latest platform APIs

**Cons:**
- 2 codebases riêng biệt
- Gấp đôi thời gian development
- Gấp đôi maintenance effort
- Cần 2 teams (iOS + Android)

**Use case:** Enterprise apps, performance-critical apps, apps cần deep platform integration

### Option 3: Hybrid Approach
**Pros:**
- Start với Expo
- Add native modules khi cần
- Có thể eject sang native sau

**Cons:**
- Complexity tăng dần
- Cần hiểu cả RN và native

---

# appejv-ios Implementation Plan

## Tech Stack

### Core
- **Language:** Swift 5.9+
- **UI Framework:** SwiftUI
- **Architecture:** MVVM + Clean Architecture
- **Minimum iOS:** 15.0

### Dependencies
- **Networking:** Alamofire
- **Auth:** Supabase Swift SDK
- **Database:** Realm / Core Data
- **Image Loading:** Kingfisher
- **Navigation:** SwiftUI Navigation
- **State Management:** Combine + @Observable

### Tools
- Xcode 15+
- CocoaPods / Swift Package Manager
- Fastlane (CI/CD)

---

## Project Structure

```
appejv-ios/
├── appejv-ios/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── SceneDelegate.swift
│   │   └── appejv_iosApp.swift
│   ├── Core/
│   │   ├── Network/
│   │   │   ├── APIClient.swift
│   │   │   ├── APIEndpoint.swift
│   │   │   └── APIError.swift
│   │   ├── Auth/
│   │   │   ├── AuthManager.swift
│   │   │   ├── TokenStorage.swift
│   │   │   └── SessionValidator.swift
│   │   ├── Database/
│   │   │   └── LocalStorage.swift
│   │   └── Utils/
│   │       ├── Extensions/
│   │       ├── Helpers/
│   │       └── Constants.swift
│   ├── Features/
│   │   ├── Auth/
│   │   │   ├── Views/
│   │   │   │   └── LoginView.swift
│   │   │   ├── ViewModels/
│   │   │   │   └── LoginViewModel.swift
│   │   │   └── Models/
│   │   │       └── User.swift
│   │   ├── Customer/
│   │   │   ├── Dashboard/
│   │   │   │   ├── Views/
│   │   │   │   │   └── CustomerDashboardView.swift
│   │   │   │   └── ViewModels/
│   │   │   │       └── CustomerDashboardViewModel.swift
│   │   │   ├── Products/
│   │   │   │   ├── Views/
│   │   │   │   │   ├── ProductsListView.swift
│   │   │   │   │   └── ProductDetailView.swift
│   │   │   │   └── ViewModels/
│   │   │   │       └── ProductsViewModel.swift
│   │   │   ├── Orders/
│   │   │   │   ├── Views/
│   │   │   │   │   ├── OrdersListView.swift
│   │   │   │   │   └── OrderDetailView.swift
│   │   │   │   └── ViewModels/
│   │   │   │       └── OrdersViewModel.swift
│   │   │   ├── Selling/
│   │   │   │   ├── Views/
│   │   │   │   │   └── CustomerSellingView.swift
│   │   │   │   └── ViewModels/
│   │   │   │       └── SellingViewModel.swift
│   │   │   └── Account/
│   │   │       ├── Views/
│   │   │       │   └── AccountView.swift
│   │   │       └── ViewModels/
│   │   │           └── AccountViewModel.swift
│   │   └── Sales/
│   │       ├── Dashboard/
│   │       ├── Inventory/
│   │       ├── Customers/
│   │       ├── Orders/
│   │       ├── Selling/
│   │       ├── Reports/
│   │       └── Settings/
│   ├── Shared/
│   │   ├── Components/
│   │   │   ├── Buttons/
│   │   │   ├── Cards/
│   │   │   ├── Forms/
│   │   │   └── Loading/
│   │   ├── Modifiers/
│   │   └── Styles/
│   │       ├── Colors.swift
│   │       ├── Typography.swift
│   │       └── Spacing.swift
│   ├── Resources/
│   │   ├── Assets.xcassets/
│   │   ├── Fonts/
│   │   └── Localizable.strings
│   └── Info.plist
├── appejv-iosTests/
└── appejv-iosUITests/
```

---

## Implementation Phases - iOS

### Phase 1: Project Setup (2 days)
- [ ] Create Xcode project
- [ ] Setup SwiftUI + MVVM architecture
- [ ] Configure SPM dependencies
- [ ] Setup folder structure
- [ ] Configure Info.plist
- [ ] Setup color scheme & typography
- [ ] Create base components

### Phase 2: Core Infrastructure (3 days)
- [ ] API Client with Alamofire
- [ ] Supabase integration
- [ ] Auth manager with Keychain
- [ ] Session validation
- [ ] Error handling
- [ ] Network monitoring
- [ ] Local storage setup

### Phase 3: Authentication (2 days)
- [ ] Login screen UI
- [ ] Login ViewModel
- [ ] Token storage
- [ ] Auto logout on deleted user
- [ ] Session persistence
- [ ] Biometric auth (optional)

### Phase 4: Customer Features (4 days)
- [ ] Customer Dashboard
- [ ] Products list & detail
- [ ] Orders list & detail
- [ ] Selling screen
- [ ] Account screen
- [ ] Cart management

### Phase 5: Sales Features (5 days)
- [ ] Sales Dashboard
- [ ] Inventory management
- [ ] Customer management
- [ ] Order management
- [ ] Selling screen
- [ ] Reports
- [ ] Settings & admin

### Phase 6: UI Polish (2 days)
- [ ] Animations
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Pull to refresh
- [ ] Haptic feedback

### Phase 7: Testing & Optimization (2 days)
- [ ] Unit tests
- [ ] UI tests
- [ ] Performance optimization
- [ ] Memory leak fixes
- [ ] TestFlight build

**Total: 20 days**

---

# appejv-android Implementation Plan

## Tech Stack

### Core
- **Language:** Kotlin 1.9+
- **UI Framework:** Jetpack Compose
- **Architecture:** MVVM + Clean Architecture
- **Minimum Android:** API 24 (Android 7.0)

### Dependencies
- **Networking:** Retrofit + OkHttp
- **Auth:** Supabase Kotlin SDK
- **Database:** Room
- **Image Loading:** Coil
- **Navigation:** Jetpack Navigation Compose
- **DI:** Hilt
- **Async:** Coroutines + Flow
- **State:** ViewModel + StateFlow

### Tools
- Android Studio Hedgehog+
- Gradle 8.0+
- Kotlin DSL

---

## Project Structure

```
appejv-android/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/appejv/
│   │   │   │   ├── AppejvApplication.kt
│   │   │   │   ├── MainActivity.kt
│   │   │   │   ├── core/
│   │   │   │   │   ├── network/
│   │   │   │   │   │   ├── ApiClient.kt
│   │   │   │   │   │   ├── ApiService.kt
│   │   │   │   │   │   └── NetworkModule.kt
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── AuthManager.kt
│   │   │   │   │   │   ├── TokenStorage.kt
│   │   │   │   │   │   └── SessionValidator.kt
│   │   │   │   │   ├── database/
│   │   │   │   │   │   ├── AppDatabase.kt
│   │   │   │   │   │   └── dao/
│   │   │   │   │   ├── di/
│   │   │   │   │   │   ├── AppModule.kt
│   │   │   │   │   │   ├── NetworkModule.kt
│   │   │   │   │   │   └── DatabaseModule.kt
│   │   │   │   │   └── utils/
│   │   │   │   │       ├── Extensions.kt
│   │   │   │   │       ├── Constants.kt
│   │   │   │   │       └── Result.kt
│   │   │   │   ├── features/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── presentation/
│   │   │   │   │   │   │   ├── LoginScreen.kt
│   │   │   │   │   │   │   └── LoginViewModel.kt
│   │   │   │   │   │   ├── domain/
│   │   │   │   │   │   │   ├── model/
│   │   │   │   │   │   │   └── repository/
│   │   │   │   │   │   └── data/
│   │   │   │   │   │       ├── repository/
│   │   │   │   │   │       └── remote/
│   │   │   │   │   ├── customer/
│   │   │   │   │   │   ├── dashboard/
│   │   │   │   │   │   │   ├── DashboardScreen.kt
│   │   │   │   │   │   │   └── DashboardViewModel.kt
│   │   │   │   │   │   ├── products/
│   │   │   │   │   │   │   ├── ProductsScreen.kt
│   │   │   │   │   │   │   ├── ProductDetailScreen.kt
│   │   │   │   │   │   │   └── ProductsViewModel.kt
│   │   │   │   │   │   ├── orders/
│   │   │   │   │   │   │   ├── OrdersScreen.kt
│   │   │   │   │   │   │   ├── OrderDetailScreen.kt
│   │   │   │   │   │   │   └── OrdersViewModel.kt
│   │   │   │   │   │   ├── selling/
│   │   │   │   │   │   │   ├── SellingScreen.kt
│   │   │   │   │   │   │   └── SellingViewModel.kt
│   │   │   │   │   │   └── account/
│   │   │   │   │   │       ├── AccountScreen.kt
│   │   │   │   │   │       └── AccountViewModel.kt
│   │   │   │   │   └── sales/
│   │   │   │   │       ├── dashboard/
│   │   │   │   │       ├── inventory/
│   │   │   │   │       ├── customers/
│   │   │   │   │       ├── orders/
│   │   │   │   │       ├── selling/
│   │   │   │   │       ├── reports/
│   │   │   │   │       └── settings/
│   │   │   │   ├── ui/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── buttons/
│   │   │   │   │   │   ├── cards/
│   │   │   │   │   │   ├── forms/
│   │   │   │   │   │   └── loading/
│   │   │   │   │   ├── theme/
│   │   │   │   │   │   ├── Color.kt
│   │   │   │   │   │   ├── Type.kt
│   │   │   │   │   │   └── Theme.kt
│   │   │   │   │   └── navigation/
│   │   │   │   │       └── NavGraph.kt
│   │   │   │   └── data/
│   │   │   │       ├── model/
│   │   │   │       ├── repository/
│   │   │   │       └── remote/
│   │   │   ├── res/
│   │   │   │   ├── drawable/
│   │   │   │   ├── mipmap/
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   └── xml/
│   │   │   └── AndroidManifest.xml
│   │   ├── test/
│   │   └── androidTest/
│   └── build.gradle.kts
├── gradle/
├── build.gradle.kts
└── settings.gradle.kts
```

---

## Implementation Phases - Android

### Phase 1: Project Setup (2 days)
- [ ] Create Android Studio project
- [ ] Setup Jetpack Compose
- [ ] Configure Hilt DI
- [ ] Setup folder structure
- [ ] Configure build.gradle
- [ ] Setup Material 3 theme
- [ ] Create base components

### Phase 2: Core Infrastructure (3 days)
- [ ] Retrofit API client
- [ ] Supabase integration
- [ ] Auth manager with EncryptedSharedPreferences
- [ ] Session validation
- [ ] Error handling
- [ ] Network monitoring
- [ ] Room database setup

### Phase 3: Authentication (2 days)
- [ ] Login screen UI (Compose)
- [ ] Login ViewModel
- [ ] Token storage
- [ ] Auto logout on deleted user
- [ ] Session persistence
- [ ] Biometric auth (optional)

### Phase 4: Customer Features (4 days)
- [ ] Customer Dashboard
- [ ] Products list & detail
- [ ] Orders list & detail
- [ ] Selling screen
- [ ] Account screen
- [ ] Cart management

### Phase 5: Sales Features (5 days)
- [ ] Sales Dashboard
- [ ] Inventory management
- [ ] Customer management
- [ ] Order management
- [ ] Selling screen
- [ ] Reports
- [ ] Settings & admin

### Phase 6: UI Polish (2 days)
- [ ] Animations
- [ ] Loading states
- [ ] Error states
- [ ] Empty states
- [ ] Pull to refresh
- [ ] Material Design 3

### Phase 7: Testing & Optimization (2 days)
- [ ] Unit tests
- [ ] UI tests (Compose)
- [ ] Performance optimization
- [ ] Memory leak fixes
- [ ] APK build

**Total: 20 days**

---

## Cost & Resource Comparison

### Development Cost

| App Type | Timeline | Developer Cost | Total Cost |
|----------|----------|----------------|------------|
| **Expo (RN)** | 10-15 days | 1 RN dev | $15,000 - $22,500 |
| **iOS (Swift)** | 15-20 days | 1 iOS dev | $22,500 - $30,000 |
| **Android (Kotlin)** | 15-20 days | 1 Android dev | $22,500 - $30,000 |
| **Both Native** | 30-40 days | 2 devs | $45,000 - $60,000 |
| **All Three** | 40-55 days | 3 devs | $60,000 - $82,500 |

*Assuming $1,500/day developer rate*

### Maintenance Cost (Annual)

| App Type | Updates | Bug Fixes | New Features | Total |
|----------|---------|-----------|--------------|-------|
| **Expo** | $5,000 | $3,000 | $10,000 | $18,000 |
| **iOS** | $7,000 | $4,000 | $12,000 | $23,000 |
| **Android** | $7,000 | $4,000 | $12,000 | $23,000 |
| **Both Native** | $14,000 | $8,000 | $24,000 | $46,000 |

---

## Decision Matrix

### Choose Expo (React Native) if:
- ✅ Budget is limited
- ✅ Need to launch quickly
- ✅ Team knows React/JavaScript
- ✅ Features don't require deep native integration
- ✅ Want single codebase
- ✅ MVP or startup phase

### Choose Native (Swift + Kotlin) if:
- ✅ Budget is sufficient
- ✅ Performance is critical
- ✅ Need platform-specific features
- ✅ Have dedicated iOS and Android teams
- ✅ Enterprise application
- ✅ Long-term investment

### Choose Hybrid Approach if:
- ✅ Start with Expo
- ✅ Add native modules as needed
- ✅ Can eject to native later
- ✅ Want flexibility

---

## Recommended Approach for APPE JV

### Phase 1: Expo MVP (Recommended) ⭐
**Timeline:** 10-15 days  
**Cost:** $15,000 - $22,500

**Deliverables:**
- iOS app (via Expo)
- Android app (via Expo)
- Core features working
- Published to TestFlight & Play Store (internal testing)

### Phase 2: Evaluate & Decide
After MVP launch:
- Gather user feedback
- Measure performance
- Identify limitations
- Decide if native is needed

### Phase 3: Native Migration (If needed)
Only if Expo has limitations:
- Migrate to Swift (iOS)
- Migrate to Kotlin (Android)
- Or keep Expo and add native modules

---

## Next Steps

1. **Confirm approach:**
   - Expo only? ✅ (Recommended)
   - Native only?
   - Both?

2. **Start implementation:**
   - Expo: Continue from current setup
   - iOS: Create Xcode project
   - Android: Create Android Studio project

3. **Set priorities:**
   - Which features first?
   - MVP or full implementation?

---

**Status:** Planning completed, awaiting decision  
**Created:** 9/2/2026  
**Recommendation:** Start with Expo (appejv-expo) ⭐
