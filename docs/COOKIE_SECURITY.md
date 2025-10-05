# Secure Cookie Configuration

## Overview
This application implements secure cookie configurations for NextAuth.js authentication to protect against common security vulnerabilities.

## Cookie Settings

### Session Token Cookie
- **Name**: `__Secure-next-auth.session-token` (production) or `next-auth.session-token` (development)
- **httpOnly**: `true` - Prevents JavaScript access to the cookie (XSS protection)
- **secure**: `true` (production only) - Cookie only transmitted over HTTPS
- **sameSite**: `lax` - Provides CSRF protection while allowing navigation
- **path**: `/` - Cookie available throughout the application
- **domain**: Configurable via `COOKIE_DOMAIN` environment variable
- **maxAge**: 30 days (2,592,000 seconds)

### Callback URL Cookie
- **Name**: `__Secure-next-auth.callback-url` (production) or `next-auth.callback-url` (development)
- **httpOnly**: `true` - Prevents JavaScript access
- **secure**: `true` (production only) - HTTPS only
- **sameSite**: `lax` - CSRF protection
- **path**: `/` - Application-wide

### CSRF Token Cookie
- **Name**: `__Host-next-auth.csrf-token` (production) or `next-auth.csrf-token` (development)
- **httpOnly**: `true` - JavaScript cannot access
- **secure**: `true` (production only) - HTTPS only
- **sameSite**: `lax` - CSRF protection
- **path**: `/` - Application-wide

## Security Features

### 1. Cookie Prefixes
- **`__Secure-`**: Indicates the cookie must be set with the secure flag and from HTTPS
- **`__Host-`**: Even stricter - requires secure flag, HTTPS, no domain attribute, and path must be `/`

### 2. HttpOnly Flag
Prevents client-side JavaScript from accessing cookies, protecting against XSS attacks.

### 3. Secure Flag
Ensures cookies are only transmitted over HTTPS in production, preventing man-in-the-middle attacks.

### 4. SameSite Attribute
- **`lax`**: Cookies sent with top-level navigations and GET requests from external sites
- Provides CSRF protection while maintaining usability
- Alternative: `strict` (more secure but may break OAuth flows)

### 5. Session Management
- **Strategy**: JWT (JSON Web Tokens)
- **Max Age**: 30 days
- **Update Age**: Sessions updated every 24 hours to refresh expiration

## Environment Variables

Add to your `.env.local` file:

```env
# Cookie Domain (optional - for multi-subdomain support)
# Leave blank for single domain
COOKIE_DOMAIN=

# Production settings will automatically use secure cookies
NODE_ENV=production
```

## Domain Configuration

### Single Domain
Leave `COOKIE_DOMAIN` empty or undefined:
```env
COOKIE_DOMAIN=
```
Cookies will be set for the exact domain (e.g., `example.com`)

### Multiple Subdomains
Set the parent domain:
```env
COOKIE_DOMAIN=.example.com
```
Cookies will be shared across `app.example.com`, `api.example.com`, etc.

## Best Practices

### ✅ DO
- Always use HTTPS in production
- Set appropriate cookie domains for your deployment
- Keep session expiration reasonable (30 days is a good balance)
- Monitor and rotate session tokens regularly
- Implement logout functionality that clears all cookies

### ❌ DON'T
- Use `sameSite: 'none'` unless absolutely necessary for cross-site requests
- Set cookies without the secure flag in production
- Share cookies across unrelated domains
- Store sensitive data in cookies without encryption
- Use overly long session durations (>90 days)

## Testing

### Development
Cookies work over HTTP without secure flag:
```
next-auth.session-token
next-auth.callback-url
next-auth.csrf-token
```

### Production
Cookies require HTTPS with secure flag:
```
__Secure-next-auth.session-token
__Secure-next-auth.callback-url
__Host-next-auth.csrf-token
```

## Troubleshooting

### Cookies Not Being Set
1. Check browser console for cookie warnings
2. Verify HTTPS is enabled in production
3. Check domain configuration matches your deployment
4. Ensure SameSite policy allows your use case

### OAuth Redirect Issues
1. Verify callback URLs in OAuth provider settings
2. Check `NEXTAUTH_URL` environment variable
3. Ensure `sameSite: 'lax'` allows OAuth flows
4. Review callback URL cookie configuration

### Session Expiring Too Quickly
1. Check `maxAge` setting (default: 30 days)
2. Verify `updateAge` setting (default: 24 hours)
3. Ensure server time is synchronized

## Compliance

This configuration helps meet security requirements for:
- **OWASP Top 10** - Protection against common web vulnerabilities
- **GDPR** - Secure handling of user authentication data
- **PCI DSS** - Secure cookie handling for payment applications
- **SOC 2** - Security and privacy controls

## References
- [OWASP Cookie Security](https://owasp.org/www-community/controls/SecureCookieAttribute)
- [MDN Web Docs - Set-Cookie](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie)
- [NextAuth.js Cookie Options](https://next-auth.js.org/configuration/options#cookies)
