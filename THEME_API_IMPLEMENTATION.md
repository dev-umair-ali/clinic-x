# Theme System - Backend API Implementation Guide

## Overview
This document describes the backend API endpoints needed to support the clinic theme system.

## Frontend Implementation Status ✅

The frontend is **fully implemented** with:

1. **Theme Service:** `lib/api/services/themeService.ts`
   - Handles all API communication
   - Follows existing service patterns
   - Type-safe with full TypeScript support

2. **Redux Slice:** `lib/slices/themeSlice.ts`
   - Manages theme state
   - Uses themeService for API calls
   - Syncs with localStorage

3. **Theme Provider:** `lib/hooks/useTheme.tsx`
   - Auto-loads theme based on user's clinicId
   - Applies CSS custom properties
   - Provides `useTheme()` hook

4. **Theme Settings Page:** `app/clinic/theme-settings/page.tsx`
   - UI for clinic admins to customize theme
   - Preset palettes
   - Live preview
   - Logo upload

## Required Backend Endpoints

### 1. Get Clinic Theme
**Endpoint:** `GET /api/theme/clinic/:clinicId`

**Description:** Fetch the theme settings for a specific clinic.

**Response (200):**
```json
{
  "_id": "theme123",
  "clinicId": "clinic456",
  "theme": {
    "primary": "167 69% 39%",
    "secondary": "167 69% 49%",
    "accent": "167 69% 29%",
    "logo": "data:image/png;base64,..."
  },
  "updatedAt": "2026-01-13T10:00:00Z",
  "createdAt": "2026-01-10T10:00:00Z"
}
```

**Response (404):** When clinic has no custom theme
```json
{
  "message": "No custom theme found for this clinic"
}
```

---

### 2. Save/Update Clinic Theme
**Endpoint:** `PUT /api/theme/clinic/:clinicId`

**Description:** Save or update the theme settings for a clinic.

**Request Body:**
```json
{
  "theme": {
    "primary": "217 91% 60%",
    "secondary": "217 91% 70%",
    "accent": "217 91% 50%",
    "logo": "data:image/png;base64,..."
  }
}
```

**Response (200):**
```json
{
  "_id": "theme123",
  "clinicId": "clinic456",
  "theme": {
    "primary": "217 91% 60%",
    "secondary": "217 91% 70%",
    "accent": "217 91% 50%",
    "logo": "data:image/png;base64,..."
  },
  "updatedAt": "2026-01-13T10:30:00Z",
  "createdAt": "2026-01-10T10:00:00Z"
}
```

---

## Database Schema (MongoDB)

### ThemeSettings Collection

```javascript
{
  _id: ObjectId,
  clinicId: {
    type: ObjectId,
    ref: 'Clinic',
    required: true,
    unique: true
  },
  theme: {
    primary: {
      type: String,
      required: true,
      default: "167 69% 39%"
    },
    secondary: {
      type: String,
      required: true,
      default: "167 69% 49%"
    },
    accent: {
      type: String,
      required: true,
      default: "167 69% 29%"
    },
    logo: {
      type: String,
      default: null
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## Authorization

All endpoints require authentication:
- User must be authenticated (valid JWT token)
- Only users with role **"clinic"** can **save/update** themes
- Users with roles **"doctor"**, **"assistant"**, **"patient"** can **fetch** themes for their clinic

---

## Example Node.js/Express Controller

```javascript
// controllers/themeController.js
const ThemeSettings = require('../models/ThemeSettings');

// Get clinic theme
exports.getClinicTheme = async (req, res) => {
  try {
    const { clinicId } = req.params;
    
    const themeSettings = await ThemeSettings.findOne({ clinicId });
    
    if (!themeSettings) {
      return res.status(404).json({ 
        message: "No custom theme found for this clinic" 
      });
    }
    
    res.json(themeSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Save/Update clinic theme
exports.saveClinicTheme = async (req, res) => {
  try {
    const { clinicId } = req.params;
    const { theme } = req.body;
    
    // Authorization check
    if (req.user.role !== 'clinic' || req.user.clinicId !== clinicId) {
      return res.status(403).json({ 
        message: "Not authorized to update this clinic's theme" 
      });
    }
    
    const themeSettings = await ThemeSettings.findOneAndUpdate(
      { clinicId },
      { 
        clinicId,
        theme,
        updatedAt: new Date()
      },
      { 
        new: true, 
        upsert: true,
        runValidators: true 
      }
    );
    
    res.json(themeSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
```

---

## Frontend Integration Summary

The frontend implementation is complete and uses the service-based architecture:

### Service Layer: `lib/api/services/themeService.ts`

```typescript
export const themeService = {
  // GET /theme/clinic/:clinicId
  async getClinicTheme(clinicId: string): Promise<FetchThemeResponse>
  
  // PUT /theme/clinic/:clinicId
  async saveClinicTheme(clinicId: string, theme: ThemeSettings): Promise<SaveThemeResponse>
  
  // DELETE /theme/clinic/:clinicId (optional)
  async deleteClinicTheme(clinicId: string): Promise<{ message: string }>
}
```

### Redux Integration: `lib/slices/themeSlice.ts`

```typescript
// Async thunks
export const fetchClinicTheme = createAsyncThunk(...)  // Uses themeService.getClinicTheme
export const saveClinicTheme = createAsyncThunk(...)   // Uses themeService.saveClinicTheme

// Actions
export const { setTheme, resetTheme, loadThemeFromStorage, clearTheme }

// Selectors
export const selectTheme, selectThemeLoading, selectThemeError, selectIsDefaultTheme
```

### Global Provider: `lib/hooks/useTheme.tsx`

- Auto-loads theme on app mount based on user's clinicId
- Applies CSS custom properties to `:root`
- Provides `useTheme()` hook for components

### Usage Example

```typescript
// In any component
import { useTheme } from '@/lib/hooks/useTheme';

function MyComponent() {
  const { theme, loading, isDefault } = useTheme();
  
  return (
    <div style={{ color: `hsl(${theme.primary})` }}>
      {isDefault ? 'Using default theme' : 'Using clinic theme'}
    </div>
  );
}
```

---

## Frontend Integration Summary (OLD - DEPRECATED)

The frontend implementation is complete with:

1. **Redux Slice:** `lib/slices/themeSlice.ts`
   - Manages theme state
   - Handles API calls (fetch/save)
   - Syncs with localStorage

2. **Theme Provider:** `lib/hooks/useTheme.tsx`
   - Auto-loads theme based on user's clinicId
   - Applies CSS custom properties
   - Provides `useTheme()` hook

3. **Theme Settings Page:** `app/clinic/theme-settings/page.tsx`
   - UI for clinic admins to customize theme
   - Preset palettes
   - Live preview
   - Logo upload

4. **Global Integration:** `app/layout.tsx`
   - Theme provider wraps entire app
   - Auto-applies theme on login

---

## How It Works

1. **User logs in** → Auth response includes `clinicId`
2. **ThemeProvider detects clinicId** → Dispatches `fetchClinicTheme(clinicId)`
3. **Backend returns theme** → Applied to CSS variables
4. **Fallback:** If no theme found → Default teal theme applied
5. **Admin saves theme** → `saveClinicTheme()` → All clinic users see new theme

---

## Testing Checklist

- [ ] Backend endpoints implemented
- [ ] Database schema created
- [ ] Clinic admin can save theme
- [ ] Theme persists across sessions
- [ ] Doctor/Assistant/Patient see clinic theme
- [ ] Admin sees default theme
- [ ] Theme updates in real-time
- [ ] Logo upload works (max 2MB)
- [ ] Preset palettes work
- [ ] Reset to default works
