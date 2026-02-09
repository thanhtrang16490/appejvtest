# Testing Guide

Hướng dẫn test toàn bộ hệ thống APPE JV.

## Test Scripts

### 1. Web + API Integration
```bash
./test-web-api-integration.sh
```

**Tests:**
- ✅ API health check
- ✅ Web health check
- ✅ Products fetching from API
- ✅ Web configuration
- ✅ Page loading
- ✅ API integration verification
- ✅ CORS configuration

### 2. App + API Integration
```bash
./test-fiber-app-integration.sh
```

**Tests:**
- ✅ API and App health
- ✅ Public endpoints (no auth)
- ✅ Protected endpoints (reject without token)
- ✅ CORS configuration
- ✅ App pages loading

### 3. Full Auth Flow
```bash
./test-with-login.sh
```

**Tests:**
- ✅ Supabase login
- ✅ JWT token generation
- ✅ Profile retrieval
- ✅ Role-based access
- ✅ Permission checks

## Manual Testing

### API Endpoints

#### Health Check
```bash
curl http://localhost:8081/health
```

#### Get Products (Public)
```bash
curl http://localhost:8081/api/v1/products
```

#### Get Profile (Protected)
```bash
# First, get token from login
TOKEN="your-jwt-token"

curl http://localhost:8081/api/v1/profile \
  -H "Authorization: Bearer $TOKEN"
```

#### Get Customers (Sales only)
```bash
curl http://localhost:8081/api/v1/customers \
  -H "Authorization: Bearer $TOKEN"
```

### Web Pages

#### Homepage
```bash
curl http://localhost:4321/
```

#### Products Page
```bash
curl http://localhost:4321/san-pham
```

#### Product Detail
```bash
curl http://localhost:4321/san-pham/arabica-special-113
```

### App Pages

#### Login Page
```bash
curl http://localhost:3000/auth/login
```

#### Sales Dashboard (Protected)
```bash
# Requires authentication
# Open in browser: http://localhost:3000/sales
```

## Test Data

### Users

**Admin:**
- Email: admin@demo.com
- Role: admin
- Access: All endpoints

**Sales:**
- Email: sale@demo.com
- Role: sale
- Access: Sales endpoints

**Customer:**
- Email: customer@demo.com
- Role: customer
- Access: Customer endpoints

### Products

Sample products in database:
- Arabica Special (Coffee)
- Premium Coffee Beans (Coffee)
- Green Tea Matcha (Tea)
- HH cho lợn sữa (Lợn)
- HH cho gà siêu thịt (Gà)

## Performance Testing

### API Response Times
```bash
# Test API performance
time curl http://localhost:8081/api/v1/products

# Expected: < 200ms
```

### Load Testing (Optional)
```bash
# Install hey
go install github.com/rakyll/hey@latest

# Run load test
hey -n 1000 -c 10 http://localhost:8081/api/v1/products
```

## Integration Testing

### Test Flow: Web → API → Database
1. Open http://localhost:4321/san-pham
2. Check browser console for API calls
3. Verify products display correctly
4. Check API logs for requests

### Test Flow: App → API → Database
1. Login at http://localhost:3000/auth/login
2. Navigate to sales dashboard
3. Check network tab for API calls with JWT
4. Verify data loads correctly

## Error Testing

### Test Invalid Token
```bash
curl http://localhost:8081/api/v1/profile \
  -H "Authorization: Bearer invalid-token"

# Expected: 401 Unauthorized
```

### Test Missing Token
```bash
curl http://localhost:8081/api/v1/profile

# Expected: 401 Unauthorized
```

### Test Insufficient Permissions
```bash
# Login as customer, try to access sales endpoint
curl http://localhost:8081/api/v1/customers \
  -H "Authorization: Bearer $CUSTOMER_TOKEN"

# Expected: 403 Forbidden
```

## Automated Testing

### Run All Tests
```bash
# From root directory
./test-web-api-integration.sh && \
./test-fiber-app-integration.sh && \
./test-with-login.sh
```

### CI/CD Integration
```yaml
# Example GitHub Actions
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run tests
        run: |
          ./test-web-api-integration.sh
          ./test-fiber-app-integration.sh
```

## Troubleshooting

### Tests Fail: Connection Refused
- Ensure all services are running
- Check ports: 8081 (API), 3000 (App), 4321 (Web)

### Tests Fail: Authentication Error
- Verify Supabase credentials
- Check token expiration
- Ensure user exists in database

### Tests Fail: CORS Error
- Check API CORS configuration
- Verify allowed origins include test URLs

## Test Coverage

### Current Coverage
- ✅ API endpoints (public & protected)
- ✅ Authentication flow
- ✅ Authorization checks
- ✅ Web page rendering
- ✅ App page rendering
- ✅ CORS configuration

### TODO
- [ ] Unit tests for API handlers
- [ ] Unit tests for React components
- [ ] E2E tests with Playwright
- [ ] Performance benchmarks
- [ ] Security testing

## Best Practices

1. **Run tests before commit**
2. **Test on clean database**
3. **Use test data, not production data**
4. **Check all error cases**
5. **Verify CORS for all origins**
6. **Test with different roles**
7. **Monitor performance metrics**

---

**Last Updated:** 9/2/2026
