# Final Cart Design Implementation Prompt

## Overview
Transform the current cart page design into a fully functional, API-integrated shopping cart with complete backend connectivity, user authentication, and modern UX features while preserving the exact visual design and layout.

## Current Design Analysis
The cart currently features:
- **Clean modern layout** with shopping cart icon and title
- **Card-based item display** in responsive grid
- **Individual item controls** (checkbox, quantity +/-, delete button)
- **Sticky footer** with select all, bulk delete, and checkout
- **Green theme** (#af7928) with proper hover states
- **Professional typography** and spacing

## Implementation Requirements

### 1. Backend Integration & API Connectivity
- **Replace hardcoded data** with Zustand store integration
- **Fetch cart on page load** using `useCartStore().fetchCart()`
- **Map API data structure** to UI components properly
- **Handle API responses** and error states gracefully
- **Sync local state** with backend cart operations

### 2. Data Structure Mapping
```typescript
// Current UI expects:
interface CartItem {
  id: number;
  artist: string;
  product: string;
  price: string;
  image: string;
  quantity: number;
  selected: boolean; // Local UI state only
}

// API provides:
interface APICartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  artistName: string;
  maxStock: number;
}
```

### 3. Selection State Management
- **Local selection state** (not persisted to backend)
- **Individual item selection** with checkboxes
- **Select all functionality** in footer
- **Selection-based calculations** for totals and counts
- **Bulk delete** for selected items only

### 4. Cart Operations Integration
- **Quantity increment/decrement** → `updateQuantity(productId, quantity)`
- **Individual item delete** → `removeItem(productId)`
- **Bulk delete selected** → Multiple `removeItem()` calls
- **Clear cart** → `clearCart()` (if needed)

### 5. User Experience Features
- **Loading states** during API operations
- **Error handling** with user-friendly messages
- **Empty cart state** with helpful messaging
- **Success notifications** for cart operations
- **Optimistic updates** for better responsiveness
- **Disabled states** for invalid operations

### 6. Authentication Integration
- **Guest cart support** with session management
- **User cart sync** after login
- **Cart persistence** across sessions
- **Merge functionality** for guest → user cart

### 7. Checkout Integration
- **Calculate totals** for selected items only
- **Pass selected items** to checkout page
- **Handle empty selection** (disable checkout)
- **Proper navigation** to checkout flow

### 8. Error Scenarios
- **Network failures** during API calls
- **Product stock changes** while in cart
- **Session expiration** handling
- **Invalid product states** (deleted, unavailable)
- **Concurrent cart modifications**

### 9. Performance Considerations
- **Debounced quantity updates** to prevent excessive API calls
- **Optimistic UI updates** for immediate feedback
- **Proper loading indicators** for slow operations
- **Efficient re-rendering** with proper React optimization

### 10. Visual Design Preservation
- **Maintain exact layout** and component structure
- **Preserve all styling** including colors, spacing, typography
- **Keep responsive behavior** and grid layout
- **Maintain hover states** and animations
- **Preserve sticky footer** behavior with IntersectionObserver

## Implementation Tasks

### Phase 1: Basic Integration
1. Import Zustand store and replace hardcoded data
2. Add fetchCart call on component mount
3. Map API data structure to UI components
4. Add basic loading and error states

### Phase 2: Selection Management
1. Add local selection state (useState)
2. Implement individual item selection
3. Add select all/none functionality
4. Update calculations based on selection

### Phase 3: Cart Operations
1. Connect quantity buttons to API
2. Wire up individual delete buttons
3. Implement bulk delete for selected items
4. Add proper error handling for all operations

### Phase 4: UX Enhancements
1. Add loading indicators for operations
2. Implement success/error notifications
3. Add empty cart state handling
4. Optimize for performance

### Phase 5: Authentication & Checkout
1. Add user session handling
2. Implement cart merging
3. Connect checkout button properly
4. Add final validation and testing

## Expected Code Structure

```typescript
export default function CartPage() {
  // Zustand store
  const { items, isLoading, error, fetchCart, updateQuantity, removeItem } = useCartStore();
  
  // Local UI state
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [operationLoading, setOperationLoading] = useState<string | null>(null);
  
  // Effects
  useEffect(() => {
    fetchCart(); // Load cart on mount
  }, []);
  
  // Computed values
  const selectedCartItems = items.filter(item => selectedItems.has(item.productId));
  const totalPrice = selectedCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Event handlers with API integration
  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    setOperationLoading(productId);
    try {
      await updateQuantity(productId, newQuantity);
    } catch (error) {
      // Handle error
    } finally {
      setOperationLoading(null);
    }
  };
  
  // ... rest of component
}
```

## Success Criteria
- ✅ All cart operations work with backend API
- ✅ Visual design exactly matches current layout
- ✅ Proper error handling and loading states
- ✅ Selection functionality works correctly
- ✅ Checkout integration is functional
- ✅ Guest and authenticated user support
- ✅ No console errors or warnings
- ✅ Responsive design maintained
- ✅ Performance is optimized

## Files to Modify
- `src/app/cart/page.tsx` - Main cart component
- `src/app/cart/cart.css` - Styling (minimal changes if any)
- May need updates to Zustand store if needed

## Testing Requirements
- Test all cart operations (add, update, delete)
- Test selection functionality
- Test error scenarios and edge cases
- Test responsive design on various screen sizes
- Test authentication flows (guest → user)
- Test checkout integration

This implementation will create a production-ready cart page that combines the beautiful existing design with robust backend functionality and excellent user experience.