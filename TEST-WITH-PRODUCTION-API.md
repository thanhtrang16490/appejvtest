# Test appejv-app với Production API

## 🎯 Mục đích

Test Next.js app (appejv-app) locally nhưng kết nối với production API (https://api.appejv.app) thay vì local API.

## 📊 Test Results

### Production API Status: ✅ ONLINE

```
Health Check: ✓ PASSED
Products API: ✓ PASSED  
Auth Required: ✓ WORKING
CORS: ⚠️ Need to check
```

## 🔧 Cách sử dụng

### Option 1: Dùng Script (Khuyến nghị)

```bash
# Switch to production API
cd appejv-app
./switch-api.sh production

# Restart Next.js
npm run dev
```

### Option 2: Manual

Copy file `.env.local.production` thành `.env.local`:

```bash
cd appejv-app
cp .env.local.production .env.local
npm run dev
```

## 🧪 Test Scenarios

### 1. Test Products (Public)

**URL:** http://localhost:3000/sales/inventory

**Expected:**
- ✅ Products load from production API
- ✅ Data is real production data
- ✅ No CORS errors

### 2. Test Login

**URL:** http://localhost:3000/auth/login

**Expected:**
- ✅ Can login with Supabase auth
- ✅ Profile loads correctly
- ✅ No infinite recursion error

### 3. Test Orders

**URL:** http://localhost:3000/sales/orders

**Expected:**
- ✅ Orders load from production
- ✅ Can create new orders
- ✅ Customer data displays correctly

### 4. Test Customers

**URL:** http://localhost:3000/sales/customers

**Expected:**
- ✅ Customers load from production
- ✅ Can view customer details
- ✅ Assigned sales display correctly

## 📝 API Endpoints Being Used

| Endpoint | URL | Status |
|----------|-----|--------|
| Health | https://api.appejv.app/health | ✅ OK |
| Products | https://api.appejv.app/api/v1/products | ✅ OK |
| Customers | https://api.appejv.app/api/v1/customers | ✅ OK (Auth required) |
| Orders | https://api.appejv.app/api/v1/orders | ✅ OK (Auth required) |
| Profile | https://api.appejv.app/api/v1/profile | ✅ OK (Auth required) |

## 🔄 Switch Back to Local API

```bash
cd appejv-app
./switch-api.sh local

# Make sure local API is running
cd ../appejv-api
go run cmd/server/main.go
```

## 🐛 Troubleshooting

### Issue: CORS Error

**Error:**
```
Access to fetch at 'https://api.appejv.app' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:**
Production API needs to allow `http://localhost:3000` in CORS origins.

Add to production environment variables:
```bash
CORS_ORIGINS=https://app.appejv.app,https://appejv.app,http://localhost:3000
```

### Issue: 401 Unauthorized

**Error:**
```
{"error":"Authorization header required"}
```

**Solution:**
This is expected for protected endpoints. Login first at http://localhost:3000/auth/login

### Issue: Infinite Recursion

**Error:**
```
infinite recursion detected in policy for relation "profiles"
```

**Solution:**
Run the RLS fix migration in Supabase:
```sql
-- Run: appejv-api/migrations/06_fix_recursion_after_hierarchy.sql
```

## ✅ Checklist

Before testing:
- [ ] Production API is deployed and running
- [ ] Switched to production API (`./switch-api.sh production`)
- [ ] Restarted Next.js dev server
- [ ] Can access http://localhost:3000

During testing:
- [ ] Products page loads
- [ ] Can login successfully
- [ ] Profile loads without errors
- [ ] Orders page works
- [ ] Customers page works
- [ ] No CORS errors in console

## 📊 Test Script

Run automated tests:

```bash
# Test production API
./test-production-api.sh

# Expected output:
# ✓ Health Check
# ✓ Products API
# ✓ Auth protection working
```

## 🎯 Benefits of Testing with Production API

1. **Real Data** - Test with actual production data
2. **Real Performance** - See actual API response times
3. **Real Issues** - Catch production-specific bugs
4. **No Local Setup** - Don't need to run local API
5. **Team Testing** - Multiple devs can test same data

## ⚠️ Important Notes

1. **Don't modify production data** - Be careful when testing create/update/delete
2. **Use test accounts** - Don't use real customer accounts
3. **Check CORS** - Make sure localhost is allowed in production CORS
4. **Monitor logs** - Watch production logs for errors
5. **Switch back** - Remember to switch back to local API after testing

## 🔗 Related Files

- `appejv-app/.env.local` - Current API configuration
- `appejv-app/.env.local.production` - Production API config
- `appejv-app/switch-api.sh` - Script to switch APIs
- `test-production-api.sh` - API test script

---

**Last Updated:** 2026-02-09
**Status:** ✅ Production API is online and working
