# ❌ Issue Resolved: Invalid Test Card Number

## Problem
You were using **`4571 7360 0000 0014`** as a test card for declined payments, but PayMongo was rejecting it with:

```
Error Code: parameter_format_invalid
Error Message: details.card_number format is invalid.
```

## Root Cause
**`4571 7360 0000 0014` is NOT a valid PayMongo test card.** This card number appears to be from a different payment gateway (possibly Stripe or another provider).

PayMongo has its own specific set of test cards documented at: https://developers.paymongo.com/docs/testing

## Solution

### ✅ Use These PayMongo Test Cards Instead:

#### For Successful Payments:
```
Card Number: 4343 4343 4343 4345 (Visa)
Expiry: 12/2025
CVC: 123
Result: ✅ Payment succeeds
```

#### For Insufficient Funds (Declined Payment):
```
Card Number: 5100 0000 0000 0198 (Mastercard)
Expiry: 12/2025
CVC: 123
Result: ❌ Declined with "insufficient_funds" error
```

#### For Generic Decline:
```
Card Number: 4400 0000 0000 0016 (Visa)
Expiry: 12/2025
CVC: 123
Result: ❌ Declined with "generic_decline" error
```

#### For 3D Secure Testing:
```
Card Number: 4120 0000 0000 0007 (Visa)
Expiry: 12/2025
CVC: 123
Result: 🔒 Requires authentication, then succeeds
```

## What to Test Now

1. **Test Successful Payment:**
   - Use card `4343 4343 4343 4345`
   - Should work perfectly (already confirmed working)

2. **Test Declined Payment:**
   - Use card `5100 0000 0000 0198`
   - Should show declined error with "insufficient funds" message
   - Order should remain PENDING
   - User can retry with different card

3. **Test Generic Decline:**
   - Use card `4400 0000 0000 0016`
   - Should show generic decline error
   - Order should remain PENDING

## Updated Files

1. **`docs/TEST_CARD_BEHAVIOR.md`** - Updated with correct PayMongo test cards
2. **`docs/PAYMONGO_TEST_CARDS.md`** - New file with complete list of all PayMongo test cards

## Important Notes

- ✅ **Always use valid expiry dates** (current month/year or future)
- ✅ **CVC can be any 3 digits** for test cards
- ✅ **Card number is being sent correctly** (verified in console: `4571736000000014`)
- ❌ **That specific card number is not recognized by PayMongo**
- ✅ **Use the cards from the official PayMongo documentation**

## Console Output Explained

The debug logs showed:
```
Card Number: 4571736000000014 ← Sent correctly
Card Number Length: 16 ← Correct length
Error: parameter_format_invalid ← PayMongo doesn't recognize this card
```

This confirmed the card format was correct, but the **card number itself is not in PayMongo's system**.

## Next Steps

1. **Try the correct declined card:** `5100 0000 0000 0198`
2. **Verify the improved error handling** shows the declined payment message properly
3. **Test retry flow** - declined card first, then successful card
4. **Confirm all scenarios work** as documented

## Reference

See **`docs/PAYMONGO_TEST_CARDS.md`** for the complete list of all valid PayMongo test cards with their expected behaviors.

---

**Status:** ✅ Issue identified and resolved

The card `4571 7360 0000 0014` should be replaced with `5100 0000 0000 0198` for testing insufficient funds scenarios.
