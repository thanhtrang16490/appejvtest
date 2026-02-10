# Customer Pages - TODO

## Current Status
Customer pages exist but need to be completed with:
1. Remove NativeWind (className) → Use inline StyleSheet
2. Add real functionality with Supabase queries
3. Add navigation between pages
4. Match design with Sales pages

## Pages to Complete

### 1. Dashboard (/(customer)/dashboard.tsx)
**Current**: Basic UI with NativeWind
**Needs**:
- ✅ Convert to inline styles
- ✅ Fetch customer profile
- ✅ Fetch recent orders (last 5)
- ✅ Show order statistics
- ✅ Navigation to other pages
- ✅ Pull to refresh

**Features**:
- Welcome message with customer name
- Quick action cards (Products, Orders, Account)
- Recent orders list with status
- Order statistics (total orders, pending, completed)

### 2. Products (/(customer)/products.tsx)
**Current**: Basic UI with NativeWind
**Needs**:
- ✅ Convert to inline styles
- ✅ Fetch products from Supabase
- ✅ Search functionality
- ✅ Category filter
- ✅ Product cards with image, name, price
- ✅ Add to cart functionality (if needed)
- ✅ Pull to refresh

**Features**:
- Search bar
- Category chips filter
- Product grid/list
- Product detail view
- Stock status display

### 3. Orders (/(customer)/orders.tsx)
**Current**: Basic UI with NativeWind
**Needs**:
- ✅ Convert to inline styles
- ✅ Fetch customer orders from Supabase
- ✅ Filter by status tabs
- ✅ Order cards with details
- ✅ Navigation to order detail
- ✅ Pull to refresh

**Features**:
- Status tabs (All, Pending, Shipping, Completed)
- Order cards with:
  - Order number
  - Date
  - Status badge
  - Total amount
  - Items count
- Click to view detail

### 4. Account (/(customer)/account.tsx)
**Current**: Basic UI with NativeWind
**Needs**:
- ✅ Convert to inline styles
- ✅ Fetch customer profile
- ✅ Edit profile functionality
- ✅ Change password
- ✅ Logout button

**Features**:
- Profile card with avatar
- Personal info (name, email, phone, address)
- Edit mode
- Change password
- Logout

## Design Guidelines

### Colors
- Primary: #175ead (blue)
- Success: #10b981 (green)
- Warning: #f59e0b (orange)
- Danger: #ef4444 (red)
- Background: #f0f9ff (light blue)

### Components
- Use SafeAreaView with edges={['top']}
- Header with logo and menu/back button
- Cards with borderRadius: 16, shadow
- Buttons with borderRadius: 8-12
- Consistent spacing: 16px padding

### Navigation
- Bottom tabs: Dashboard, Products, Orders, Account
- Header: Logo + Menu button
- Back button on detail pages

## Implementation Order
1. Dashboard (most important, first impression)
2. Products (core functionality)
3. Orders (track purchases)
4. Account (profile management)

## Notes
- All pages should use Supabase directly (no Go API)
- Filter data by customer_id (current user)
- Use inline styles (no NativeWind/Tailwind)
- Match design consistency with Sales pages
- Add loading states and error handling
- Add pull-to-refresh on all list pages
