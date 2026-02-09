# Documentation

Tài liệu hệ thống APPE JV Monorepo.

## 📖 Quick Links

- [Documentation Index](INDEX.md) - Danh mục đầy đủ
- [Quick Start Guide](QUICK-START.md) - Hướng dẫn nhanh
- [Testing Guide](TESTING.md) - Hướng dẫn test

## 📁 Structure

```
docs/
├── README.md                  # This file
├── INDEX.md                   # Full documentation index
├── QUICK-START.md            # Quick start guide
├── TESTING.md                # Testing guide
├── guides/                   # Detailed guides
│   ├── FIBER-MIGRATION-COMPLETE.md
│   ├── WEB-API-INTEGRATION-COMPLETE.md
│   └── FIBER-APP-TEST-RESULTS.md
├── testing/                  # Test scripts
│   ├── test-web-api-integration.sh
│   ├── test-fiber-app-integration.sh
│   ├── test-with-login.sh
│   └── test-auth-flow.sh
└── archive/                  # Old documentation
    └── ...
```

## 🚀 Getting Started

1. Read [Quick Start Guide](QUICK-START.md)
2. Set up your environment
3. Run test scripts from root:
   ```bash
   ./test-web-api-integration.sh
   ./test-fiber-app-integration.sh
   ./test-with-login.sh
   ```

## 📚 Main Documentation

### For Developers
- [Quick Start](QUICK-START.md) - Get up and running
- [Testing](TESTING.md) - How to test the system
- [API Docs](../appejv-api/README.md) - Backend API
- [App Docs](../appejv-app/README.md) - Internal app
- [Web Docs](../appejv-web/README.md) - Public website

### For DevOps
- [Deployment Guide](guides/) - Coming soon
- [Monitoring Setup](guides/) - Coming soon

### Migration History
- [Fiber Migration](guides/FIBER-MIGRATION-COMPLETE.md)
- [Web API Integration](guides/WEB-API-INTEGRATION-COMPLETE.md)
- [Archive](archive/) - Old documentation

## 🔗 External Links

- [Main README](../README.md)
- [Project Summary](../SUMMARY.md)

---

**Last Updated:** 9/2/2026
