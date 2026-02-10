# Quick Start Guide - APPE JV Android App

## 🚀 Getting Started

### Prerequisites
- **Android Studio** Hedgehog (2023.1.1) or later
- **JDK** 17 or later
- **Android SDK** 34
- **Minimum Android** 7.0 (API 24)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd appejv-android
```

2. **Open in Android Studio**
   - File → Open → Select `appejv-android` folder
   - Wait for Gradle sync to complete

3. **Run the app**
   - Click Run button or press `Shift + F10`
   - Select emulator or connected device

## 📱 Features Implemented

### ✅ Authentication
- Login with email/password
- Secure token storage
- Role-based navigation
- Auto-logout on token expiry

### ✅ Customer Dashboard
- Welcome screen
- Featured products
- Recent orders
- Quick actions
- Bottom navigation

### ✅ UI Components
- Product cards
- Order cards
- Status badges
- Loading states
- Error handling

## 🏗️ Project Structure

```
app/src/main/java/com/appejv/android/
├── AppejvApplication.kt          # Application class
├── MainActivity.kt                # Main activity
├── core/
│   ├── auth/
│   │   └── TokenStorage.kt       # Secure token storage
│   ├── data/model/
│   │   ├── User.kt               # User model
│   │   ├── Product.kt            # Product model
│   │   └── Order.kt              # Order model
│   ├── di/
│   │   └── NetworkModule.kt      # Dependency injection
│   ├── network/
│   │   └── ApiService.kt         # API endpoints
│   └── utils/
│       ├── Constants.kt          # App constants
│       ├── Result.kt             # Result wrapper
│       └── Extensions.kt         # Utility extensions
├── features/
│   ├── auth/
│   │   ├── data/
│   │   │   └── AuthRepository.kt
│   │   └── presentation/
│   │       ├── LoginScreen.kt
│   │       └── LoginViewModel.kt
│   └── customer/
│       ├── data/
│       │   ├── ProductRepository.kt
│       │   └── OrderRepository.kt
│       └── presentation/
│           ├── CustomerDashboardScreen.kt
│           └── CustomerDashboardViewModel.kt
└── ui/
    ├── components/
    │   ├── ProductCard.kt
    │   └── OrderCard.kt
    ├── navigation/
    │   └── AppNavigation.kt
    └── theme/
        ├── Color.kt
        ├── Theme.kt
        └── Type.kt
```

## 🔧 Configuration

### API Endpoints
Edit `Constants.kt`:
```kotlin
const val API_BASE_URL = "https://api.appejv.app/api/v1/"
const val SUPABASE_URL = "https://mrcmratcnlsoxctsbalt.supabase.co"
```

### Build Variants
- **Debug**: Development build with logging
- **Release**: Production build with ProGuard

## 🧪 Testing

### Test Credentials
```
Email: test@appejv.app
Password: test123
```

### Manual Testing Checklist
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] View dashboard
- [ ] Load products
- [ ] Load orders
- [ ] Navigate between tabs
- [ ] Logout

## 📦 Dependencies

### Core
- Kotlin 1.9.20
- Jetpack Compose (BOM 2024.01.00)
- Material 3

### Architecture
- Hilt 2.48 (Dependency Injection)
- ViewModel + StateFlow
- Navigation Compose 2.7.6

### Networking
- Retrofit 2.9.0
- OkHttp 4.12.0
- Kotlinx Serialization 1.6.2

### Image Loading
- Coil 2.5.0

### Security
- EncryptedSharedPreferences

## 🎨 Design System

### Colors
```kotlin
Primary: #175EAD
Secondary: #10B981
Error: #EF4444
Success: #10B981
```

### Typography
- Material 3 Typography
- Default font family
- Responsive text sizes

## 🐛 Troubleshooting

### Gradle Sync Failed
```bash
./gradlew clean
./gradlew build --refresh-dependencies
```

### Build Error
1. Check JDK version (must be 17)
2. Update Android SDK
3. Invalidate caches: File → Invalidate Caches → Restart

### Network Error
1. Check API URL in Constants.kt
2. Verify internet connection
3. Check API server status

### Login Failed
1. Verify credentials
2. Check API endpoint
3. Check token storage permissions

## 📚 Resources

### Documentation
- [Jetpack Compose](https://developer.android.com/jetpack/compose)
- [Material 3](https://m3.material.io/)
- [Hilt](https://dagger.dev/hilt/)
- [Retrofit](https://square.github.io/retrofit/)

### Code Style
- Follow Kotlin coding conventions
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

## 🚀 Next Steps

1. **Implement Products List**
   - Create ProductsListScreen
   - Add search functionality
   - Add filters

2. **Implement Orders List**
   - Create OrdersListScreen
   - Add status filters
   - Add order detail

3. **Implement Selling Screen**
   - Cart management
   - Customer selection
   - Order creation

4. **Add Sales Features**
   - Sales dashboard
   - Inventory management
   - Reports

## 📞 Support

For issues or questions:
- Check IMPLEMENTATION-STATUS.md
- Review code comments
- Contact development team

---

**Version:** 1.0.0  
**Last Updated:** 2026-02-10  
**Status:** Active Development
