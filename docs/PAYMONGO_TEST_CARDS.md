# PayMongo Test Cards - Quick Reference

## ✅ Success Cards (Always Approve)

| Card Number | Type | CVC | Expiry | Result |
|-------------|------|-----|--------|--------|
| `4343 4343 4343 4345` | Visa | Any 3 digits | Any future date | ✅ Payment succeeds |
| `4571 7360 0000 0075` | Visa (debit) | Any 3 digits | Any future date | ✅ Payment succeeds |
| `4009 9300 0000 1421` | Visa (credit - PH) | Any 3 digits | Any future date | ✅ Payment succeeds |
| `5555 4444 4444 4457` | Mastercard | Any 3 digits | Any future date | ✅ Payment succeeds |
| `5455 5900 0000 0009` | Mastercard (debit) | Any 3 digits | Any future date | ✅ Payment succeeds |

---

## ❌ Declined Cards (Test Error Scenarios)

### Insufficient Funds
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `5100 0000 0000 0198` | `insufficient_funds` | The card does not have sufficient funds |
| `5240 4600 0000 1466` | `insufficient_funds` | The card does not have sufficient funds (PH credit card) |

### Generic Decline
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `4400 0000 0000 0016` | `generic_decline` | Payment failed due to unknown reasons |
| `4028 2200 0000 1457` | `generic_decline` | Payment failed (PH credit card) |

### Card Expired
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `4200 0000 0000 0018` | `card_expired` | The card used has already expired |

### Invalid CVC
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `4300 0000 0000 0017` | `cvc_invalid` | The inputted CVC/CVN is incorrect |

### Fraudulent / Blocked
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `4500 0000 0000 0015` | `fraudulent` | Payment blocked as suspected fraudulent |
| `4600 0000 0000 0014` | `blocked` | Transaction blocked by fraud detection |
| `5200 0000 0000 0197` | `processor_blocked` | Transaction blocked by processor |

### Lost / Stolen Card
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `5300 0000 0000 0196` | `lost_card` | The card used is reported lost |
| `5483 5300 0000 1462` | `lost_card` | Card reported lost (PH credit card) |
| `5400 0000 0000 0195` | `stolen_card` | The card used is reported stolen |

### Processor Issues
| Card Number | Error Code | Message |
|-------------|------------|---------|
| `5500 0000 0000 0194` | `processor_unavailable` | Processing failed due to unknown reason |

---

## 🔒 3D Secure Test Cards

| Card Number | Behavior |
|-------------|----------|
| `4120 0000 0000 0007` | ✅ Requires 3DS authentication, then succeeds |
| `4230 0000 0000 0004` | ❌ Declined with `generic_decline` **before** authentication |
| `5234 0000 0000 0106` | ❌ Declined with `generic_decline` **after** successful authentication |
| `5123 0000 0000 0001` | ✅ 3DS supported but not required, payment succeeds |

---

## 📋 Testing Workflow

### Test Successful Payment
```
Card: 4343 4343 4343 4345
Expiry: 12/2025 (or any future date)
CVC: 123 (or any 3 digits)
Result: ✅ Payment succeeds immediately
```

### Test Insufficient Funds
```
Card: 5100 0000 0000 0198
Expiry: 12/2025
CVC: 123
Result: ❌ Declined with "insufficient_funds" error
```

### Test Generic Decline
```
Card: 4400 0000 0000 0016
Expiry: 12/2025
CVC: 123
Result: ❌ Declined with "generic_decline" error
```

### Test 3D Secure
```
Card: 4120 0000 0000 0007
Expiry: 12/2025
CVC: 123
Result: 🔒 Redirects to authentication page, then succeeds
```

---

## 🚨 Important Notes

1. **Always use future expiry dates** (e.g., 12/2025, 01/2026)
2. **CVC can be any 3 digits** (e.g., 123, 456, 789)
3. **Do NOT use these cards in production** - they only work in test mode
4. **Card format**: Can enter with or without spaces (both `4343434343434345` and `4343 4343 4343 4345` work)
5. **For fraud/lost/stolen cards**: Don't expose specific error codes to users - show generic decline message

---

## 🔗 Source

Official PayMongo Documentation: https://developers.paymongo.com/docs/testing

Last Updated: October 3, 2025
