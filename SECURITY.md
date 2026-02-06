# Security Policy

## 🔒 Security Features

This project implements comprehensive security measures to protect user data and prevent common web vulnerabilities.

## Implemented Security Measures

### 1. Authentication & Authorization

#### Supabase Authentication
- Secure user authentication with Supabase Auth
- Phone and email-based login
- Secure session management with HTTP-only cookies
- Automatic session refresh

#### Role-Based Access Control (RBAC)
- **Customer Role**: Access to customer dashboard, orders, and profile
- **Sale Role**: Access to sales dashboard, order management, and customer management
- **Sale Admin Role**: Additional access to team management
- **Admin Role**: Full system access

#### Route Protection
- Middleware-based route protection
- Automatic redirection for unauthorized access
- Role verification on every protected route

### 2. API Security

#### Rate Limiting
```typescript
// Authentication routes: 5 attempts per 15 minutes
// API routes: 60 requests per minute
// Strict routes: 10 requests per minute
```

#### Secure API Handler
- Built-in authentication check
- Role-based authorization
- Rate limiting per endpoint
- Error handling and logging

#### Input Validation
- Email validation
- Phone number validation (Vietnamese format)
- Password strength requirements
- SQL injection prevention
- XSS prevention through sanitization

### 3. HTTP Security Headers

#### Content Security Policy (CSP)
```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data: https: blob:
connect-src 'self' https://*.supabase.co
```

#### Other Security Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - XSS protection
- `Strict-Transport-Security` - Forces HTTPS
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` - Restricts browser features

### 4. Data Protection

#### Input Sanitization
- HTML tag removal
- SQL injection prevention
- Length limitations
- Special character handling

#### Password Requirements
- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number
- At least 1 special character

#### File Upload Security
- File type validation
- File size limits (5MB default)
- Allowed types: images (JPEG, PNG, WebP)

### 5. Audit Logging

#### Logged Events
- Login attempts (success/failure)
- Logout events
- Unauthorized access attempts
- Rate limit violations
- Data modifications
- Suspicious activities

#### Log Information
- Timestamp
- User ID and email
- IP address
- User agent
- Resource accessed
- Action performed
- Success/failure status

### 6. CSRF Protection

- CSRF token generation
- Token verification
- Constant-time comparison to prevent timing attacks

## Security Best Practices

### For Developers

1. **Never commit sensitive data**
   - Use `.env.local` for secrets
   - Add `.env.local` to `.gitignore`
   - Never hardcode API keys or passwords

2. **Always validate user input**
   ```typescript
   import { sanitizeString, isValidEmail } from '@/lib/security/validation'
   
   const email = sanitizeString(formData.get('email'))
   if (!isValidEmail(email)) {
     return { error: 'Invalid email' }
   }
   ```

3. **Use the secure API handler**
   ```typescript
   import { secureAPIHandler } from '@/lib/security/api-handler'
   
   export async function POST(request: NextRequest) {
     return secureAPIHandler(
       request,
       async (req, user) => {
         // Your handler code
       },
       {
         requireAuth: true,
         allowedRoles: ['admin', 'sale'],
         rateLimit: RATE_LIMITS.STRICT
       }
     )
   }
   ```

4. **Log security events**
   ```typescript
   import { logAuditEvent, AuditEventType } from '@/lib/security/audit'
   
   logAuditEvent({
     eventType: AuditEventType.LOGIN_SUCCESS,
     userId: user.id,
     userEmail: user.email,
     ipAddress: getClientIP(request),
     success: true
   })
   ```

### For Administrators

1. **Environment Variables**
   - Keep Supabase keys secure
   - Use different keys for development and production
   - Rotate keys periodically

2. **Database Security**
   - Enable Row Level Security (RLS) in Supabase
   - Use proper database roles
   - Regularly backup data

3. **Monitoring**
   - Review audit logs regularly
   - Monitor for suspicious activities
   - Set up alerts for security events

4. **Updates**
   - Keep dependencies updated
   - Apply security patches promptly
   - Review security advisories

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please follow these steps:

1. **DO NOT** open a public issue
2. Email security details to: security@appejv.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to resolve the issue.

## Security Checklist for Deployment

- [ ] Environment variables are set correctly
- [ ] HTTPS is enabled
- [ ] Database RLS policies are configured
- [ ] Rate limiting is enabled
- [ ] Security headers are applied
- [ ] Audit logging is configured
- [ ] Backup strategy is in place
- [ ] Monitoring is set up
- [ ] Error tracking is configured
- [ ] Dependencies are up to date

## Compliance

This application implements security measures aligned with:
- OWASP Top 10 security risks
- GDPR data protection requirements
- PCI DSS guidelines (for payment data)

## Security Updates

| Date | Version | Update |
|------|---------|--------|
| 2024-02-06 | 1.0.0 | Initial security implementation |

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth/security)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)

---

Last Updated: February 6, 2024
