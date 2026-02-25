# Supabase Security Issues - Tổng hợp

## Tổng quan
Supabase Security Advisor phát hiện 32 vấn đề bảo mật cần được xử lý.

## Phân loại vấn đề

### 1. ✅ Security Definer Views (Đã sửa)
- 6 views đã được sửa thành SECURITY INVOKER
- Trạng thái: **HOÀN THÀNH**

### 2. ⚠️ Function Search Path Mutable (26 functions)
**Vấn đề**: Functions không có `search_path` được set, có thể bị tấn công search path injection

**Danh sách functions cần sửa**:
1. cleanup_expired_reset_tokens
2. generate_slug
3. auto_generate_product_slug
4. update_notifications_updated_at
5. create_notification
6. notify_admins
7. notify_assigned_sale
8. validate_warehouse_order_update
9. get_team_members
10. soft_delete_product
11. restore_product
12. soft_delete_customer
13. restore_customer
14. soft_delete_profile
15. restore_profile
16. cleanup_old_deleted_products
17. cleanup_old_deleted_customers
18. prevent_update_deleted_records
19. validate_warehouse_product_update
20. update_customers_updated_at
21. log_audit_event
22. get_user_activity_summary
23. cleanup_old_audit_logs
24. log_product_changes
25. log_customer_changes
26. log_order_changes

**Giải pháp**: Thêm `SET search_path = public, pg_temp` vào mỗi function

### 3. ⚠️ RLS Policy Always True (5 policies)
**Vấn đề**: Các RLS policies sử dụng `USING (true)` hoặc `WITH CHECK (true)`, bypass bảo mật

**Danh sách policies cần review**:
1. `audit_logs` - "System can insert audit logs" (INSERT)
2. `customer_details` - "Public access" (ALL)
3. `notifications` - "System can insert notifications" (INSERT)
4. `order_items` - "Public access" (ALL)
5. `products` - "Public access" (ALL)

**Lưu ý**: Một số policies có thể cố ý để public access, cần review từng case

### 4. ⚠️ Auth Leaked Password Protection Disabled
**Vấn đề**: Tính năng kiểm tra mật khẩu bị rò rỉ chưa được bật

**Giải pháp**: Bật trong Supabase Dashboard > Authentication > Policies

## Mức độ ưu tiên

### Cao (Critical)
1. ✅ Security Definer Views - **ĐÃ SỬA**
2. ⚠️ Function Search Path Mutable - **CẦN SỬA NGAY**

### Trung bình (Medium)
3. ⚠️ RLS Policy Always True - **CẦN REVIEW**

### Thấp (Low)
4. ⚠️ Auth Leaked Password Protection - **CẤU HÌNH**

## Kế hoạch sửa

### Phase 1: Fix Function Search Path (Ưu tiên cao)
- Tạo migration để thêm `SET search_path` cho tất cả functions
- File: `15_fix_function_search_path.sql`

### Phase 2: Review RLS Policies (Ưu tiên trung bình)
- Review từng policy xem có cần thiết không
- Tạo policies cụ thể hơn nếu cần

### Phase 3: Enable Auth Protection (Ưu tiên thấp)
- Bật Leaked Password Protection trong Dashboard
- Không cần migration

## Tài liệu tham khảo
- [Function Search Path Security](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable)
- [RLS Policy Best Practices](https://supabase.com/docs/guides/database/database-linter?lint=0024_permissive_rls_policy)
- [Password Security](https://supabase.com/docs/guides/auth/password-security)
