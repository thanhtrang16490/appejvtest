# Documentation Index

Tài liệu hệ thống APPE JV Monorepo.

## 📖 Main Documentation

### Getting Started
- [README](../README.md) - Tổng quan dự án
- [Quick Start Guide](QUICK-START.md) - Hướng dẫn nhanh
- [Environment Setup](ENVIRONMENT-SETUP.md) - Cấu hình môi trường
- [Testing Guide](TESTING.md) - Hướng dẫn test
- [Deployment Guide](DEPLOYMENT.md) - Hướng dẫn deploy

### Project Documentation
- [API Documentation](../appejv-api/README.md) - Go Fiber API
- [App Documentation](../appejv-app/README.md) - Next.js App
- [Web Documentation](../appejv-web/README.md) - Astro Website

## 📚 Guides

### Migration & Setup
- [Fiber Migration Complete](guides/FIBER-MIGRATION-COMPLETE.md) - Chi tiết migration sang Fiber
- [Web API Integration](guides/WEB-API-INTEGRATION-COMPLETE.md) - Tích hợp Web với API
- [Fiber App Test Results](guides/FIBER-APP-TEST-RESULTS.md) - Kết quả test

## 🧪 Testing

### Test Scripts
Located in `docs/testing/`:
- `test-web-api-integration.sh` - Test Web + API
- `test-fiber-app-integration.sh` - Test App + API
- `test-with-login.sh` - Test auth flow
- `test-auth-flow.sh` - Test authentication

### Running Tests
```bash
# From root directory
./test-web-api-integration.sh
./test-fiber-app-integration.sh
./test-with-login.sh
```

## 📦 Archive

Tài liệu cũ và lịch sử migration trong `archive/`:
- API Implementation Summary
- Auth Authorization Audit
- Migration Summary
- Monorepo Setup
- Phase Completions
- Test Results

## 🗂️ Structure

```
docs/
├── INDEX.md                    # This file
├── QUICK-START.md             # Quick start guide
├── TESTING.md                 # Testing guide
├── guides/                    # Detailed guides
│   ├── FIBER-MIGRATION-COMPLETE.md
│   ├── WEB-API-INTEGRATION-COMPLETE.md
│   └── FIBER-APP-TEST-RESULTS.md
├── testing/                   # Test scripts
│   ├── test-web-api-integration.sh
│   ├── test-fiber-app-integration.sh
│   ├── test-with-login.sh
│   └── test-auth-flow.sh
└── archive/                   # Old documentation
    ├── API-APP-INTEGRATION-TEST.md
    ├── API-IMPLEMENTATION-SUMMARY.md
    ├── AUTH-AUTHORIZATION-AUDIT.md
    ├── MIGRATION-SUMMARY.md
    ├── MONOREPO-*.md
    ├── PHASE-*.md
    └── ...
```

## 🔗 Quick Links

### Development
- [API Setup](../appejv-api/SETUP.md)
- [App Development](../appejv-app/README.md)
- [Web Development](../appejv-web/README.md)

### Testing
- [Testing Guide](TESTING.md)
- [Test Scripts](testing/)

### Deployment
- Coming soon

## 📝 Contributing

When adding new documentation:
1. Place in appropriate directory (guides/, testing/, archive/)
2. Update this INDEX.md
3. Link from main README.md if needed
4. Use clear, descriptive filenames

## 🔄 Updates

- **9/2/2026:** Reorganized documentation structure
- **9/2/2026:** Completed Web + API integration
- **9/2/2026:** Completed Fiber migration

---

**Last Updated:** 9/2/2026
