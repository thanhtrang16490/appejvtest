# 🧪 Web + API Integration Testing Guide

## Prerequisites

Trước khi test, đảm bảo đã cài đặt:

### 1. Install Go (Required for API)

**macOS:**
```bash
brew install go
```

**Linux:**
```bash
wget https://go.dev/dl/go1.22.0.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.22.0.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

**Verify:**
```bash
go version
# Should show: go version go1.22.0 or higher
```

### 2. Install Node Dependencies

```bash
# Install web dependencies
cd appejv-web
npm install
cd ..

# Install API dependencies (Go modules)
cd appejv-api
go mod download
cd ..
```

## 🚀 Quick Start (All Services)

### Option 1: Start All at Once
```bash
# From root directory
npm run dev:all
```

This starts:
- Go API: http://localhost:8080
- Next.js App: http://localhost:3000
- Astro Web: http://localhost:4321

### Option 2: Start Individually

**Terminal 1 - Go API:**
```bash
npm run dev:api
# or
cd appejv-api && go run cmd/server/main.go
```

**Terminal 2 - Astro Web:**
```bash
npm run dev:web
# or
cd appejv-web && npm run dev
```

**Terminal 3 - Next.js App (Optional):**
```bash
npm run dev:app
# or
cd appejv-app && npm run dev
```

## ✅ Testing Checklist

### 1. API Health Check

```bash
curl http://localhost:8080/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "service": "appejv-api",
  "version": "1.0.0"
}
```

### 2. API Products Endpoint

```bash
curl http://localhost:8080/api/v1/products?limit=5
```

**Expected Response:**
```json
{
  "data": [
    {
      "id": 1,
      "code": "P001",
      "name": "Product Name",
      "price": 100000,
      "stock": 50,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 10,
    "total_pages": 2
  }
}
```

### 3. Web Homepage

**Browser Test:**
1. Open: http://localhost:4321
2. Check:
   - ✅ Hero section displays
   - ✅ Features section shows
   - ✅ Featured products load from API
   - ✅ Navigation works

**CLI Test:**
```bash
curl -s http://localhost:4321 | grep "Giải pháp quản lý bán hàng"
```

### 4. Web Products Page

**Browser Test:**
1. Open: http://localhost:4321/san-pham
2. Check:
   - ✅ Products grid displays
   - ✅ Products load from API
   - ✅ Category filter works
   - ✅ Search works
   - ✅ Pagination works

**CLI Test:**
```bash
curl -s http://localhost:4321/san-pham | grep "Sản phẩm"
```

### 5. Web Product Detail

**Browser Test:**
1. Open: http://localhost:4321/san-pham/1
2. Check:
   - ✅ Product info displays
   - ✅ Price shows correctly
   - ✅ Stock status shows
   - ✅ Description displays
   - ✅ CTA buttons work

### 6. Integration Test

**Test API → Web Flow:**

```bash
# 1. Get products from API
curl -s http://localhost:8080/api/v1/products?limit=3 | jq

# 2. Check if web can fetch same data
# Open browser DevTools → Network tab
# Navigate to http://localhost:4321/san-pham
# Should see request to localhost:8080/api/v1/products
```

## 🔍 Debugging

### API Not Starting

**Check Go installation:**
```bash
go version
```

**Check port 8080:**
```bash
lsof -ti:8080
# If something is using it:
lsof -ti:8080 | xargs kill -9
```

**Check API logs:**
```bash
cd appejv-api
go run cmd/server/main.go
# Look for errors in output
```

### Web Not Loading Products

**Check browser console:**
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors

**Check Network tab:**
1. Open DevTools (F12)
2. Go to Network tab
3. Navigate to products page
4. Look for API requests
5. Check if requests succeed (status 200)

**Common Issues:**
- ❌ CORS error → Check API CORS config
- ❌ 404 error → API not running
- ❌ Timeout → API too slow or not responding

### CORS Issues

If you see CORS errors in browser console:

**Check API CORS config:**
```bash
# appejv-api/.env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4321
```

**Restart API after changing .env**

## 📊 Expected Results

### Homepage
- Hero section with gradient background
- 3 feature cards
- 6 featured products (from API)
- Footer with links

### Products Page
- Product grid (responsive)
- Category filters (dynamic from API)
- Search bar
- Pagination
- Product cards with:
  - Image placeholder
  - Name
  - Price (Vietnamese format)
  - Stock count

### Product Detail
- Large product image
- Product name and category
- Price (Vietnamese format)
- Stock status (green if available, red if out)
- Description
- Specifications
- Product details table
- CTA buttons

## 🎯 Manual Testing Scenarios

### Scenario 1: Browse Products
1. ✅ Open homepage
2. ✅ Click "Xem sản phẩm" button
3. ✅ See products list
4. ✅ Click on a product
5. ✅ See product details
6. ✅ Click "Xem sản phẩm khác"
7. ✅ Return to products list

### Scenario 2: Filter Products
1. ✅ Go to products page
2. ✅ Click on a category filter
3. ✅ See filtered products
4. ✅ Click "Tất cả"
5. ✅ See all products again

### Scenario 3: Search Products
1. ✅ Go to products page
2. ✅ Type in search box
3. ✅ Press Enter
4. ✅ See search results
5. ✅ Clear search
6. ✅ See all products

### Scenario 4: Pagination
1. ✅ Go to products page
2. ✅ Scroll to bottom
3. ✅ Click "Sau →"
4. ✅ See next page
5. ✅ Click "← Trước"
6. ✅ Return to previous page

### Scenario 5: Navigation
1. ✅ Click "Giới thiệu" in header
2. ✅ See about page
3. ✅ Click "Liên hệ" in header
4. ✅ See contact page
5. ✅ Click logo
6. ✅ Return to homepage

## 📸 Screenshots to Verify

Take screenshots of:
1. Homepage with featured products
2. Products page with grid
3. Product detail page
4. About page
5. Contact page
6. Browser DevTools showing API calls

## 🐛 Common Issues & Solutions

### Issue 1: Products Not Loading
**Symptom:** Empty products grid

**Solution:**
```bash
# 1. Check API is running
curl http://localhost:8080/health

# 2. Check API has data
curl http://localhost:8080/api/v1/products

# 3. Seed data if empty
curl http://localhost:8080/api/v1/seed
```

### Issue 2: CORS Error
**Symptom:** Console shows CORS error

**Solution:**
```bash
# Check appejv-api/.env
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:4321

# Restart API
```

### Issue 3: 404 on Product Detail
**Symptom:** Product detail page shows 404

**Solution:**
- Check product ID exists in API
- Check URL format: /san-pham/1 (not /san-pham/abc)

### Issue 4: Slow Loading
**Symptom:** Pages take long to load

**Solution:**
- Check API response time
- Check network speed
- Check if API timeout is set correctly

## ✅ Success Criteria

All tests pass when:
- ✅ API responds to health check
- ✅ API returns products data
- ✅ Web homepage loads
- ✅ Web products page displays products from API
- ✅ Product detail page shows correct data
- ✅ Navigation works between pages
- ✅ No console errors
- ✅ No CORS errors
- ✅ All images/styles load correctly

## 📝 Test Report Template

```
Date: ___________
Tester: ___________

Services Status:
[ ] Go API running on port 8080
[ ] Astro Web running on port 4321

API Tests:
[ ] Health check passes
[ ] Products endpoint returns data
[ ] Single product endpoint works

Web Tests:
[ ] Homepage loads
[ ] Products page loads
[ ] Product detail loads
[ ] About page loads
[ ] Contact page loads

Integration Tests:
[ ] Products load from API on homepage
[ ] Products load from API on products page
[ ] Product detail loads from API
[ ] No CORS errors
[ ] No console errors

Issues Found:
_________________________________
_________________________________

Notes:
_________________________________
_________________________________
```

## 🚀 Next Steps After Testing

If all tests pass:
1. ✅ Deploy Go API to production
2. ✅ Deploy Astro Web to production
3. ✅ Update environment variables
4. ✅ Test production deployment

If tests fail:
1. ❌ Check error messages
2. ❌ Review logs
3. ❌ Fix issues
4. ❌ Re-test

---

**Happy Testing! 🎉**
