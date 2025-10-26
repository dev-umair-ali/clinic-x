# Global Axios Configuration

This directory contains the global axios configuration for the clinic portal application with automatic JWT token management.

## Features

- **Automatic JWT Token Management**: Every request automatically includes the JWT token from localStorage
- **Global Error Handling**: 401 responses automatically clear tokens and redirect to login
- **Request/Response Interceptors**: Centralized request and response handling
- **TypeScript Support**: Full type safety for API responses

## Usage

### 1. Basic API Calls

```typescript
import api from '@/lib/api/axios';

// GET request (automatically includes auth header)
const appointments = await api.get('/appointments');

// POST request (automatically includes auth header)
const newAppointment = await api.post('/appointments', appointmentData);

// PUT request (automatically includes auth header)
await api.put(`/appointments/${id}`, updateData);

// DELETE request (automatically includes auth header)
await api.delete(`/appointments/${id}`);
```

### 2. Using the useApi Hook

```typescript
import { useApi } from '@/lib/hooks/useApi';

function MyComponent() {
  const api = useApi();

  const handleSubmit = async () => {
    const { data, error } = await api.post('/appointments', formData);
    
    if (error) {
      // Handle error
      console.error(error);
    } else {
      // Handle success
      console.log(data);
    }
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### 3. Using Services

```typescript
import { appointmentService } from '@/lib/api';

// Get all appointments
const appointments = await appointmentService.getAppointments();

// Create new appointment
const newAppointment = await appointmentService.createAppointment(appointmentData);

// Update appointment
await appointmentService.updateAppointment(id, updateData);

// Delete appointment
await appointmentService.deleteAppointment(id);
```

### 4. Manual Token Management

```typescript
import { setAuthToken, clearAuthToken } from '@/lib/api/axios';

// Set token manually (usually done automatically after login)
setAuthToken('your-jwt-token');

// Clear token manually (usually done automatically after logout)
clearAuthToken();
```

## How It Works

### 1. Request Interceptor
- Automatically adds `Authorization: Bearer {token}` header to every request
- Gets token from localStorage
- No need to manually add auth headers

### 2. Response Interceptor
- Automatically handles 401 unauthorized responses
- Clears invalid tokens from localStorage
- Redirects to login page when authentication fails

### 3. Auth Integration
- Redux auth slice automatically manages axios headers
- Login success sets token in axios headers
- Logout clears token from axios headers
- App initialization restores token from localStorage

## Environment Variables

Make sure to set the following environment variable:

```bash
NEXT_PUBLIC_BACKEND_BASE_URL=http://localhost:8000
```

## Error Handling

All API calls automatically handle common errors:

- **401 Unauthorized**: Automatically clears tokens and redirects to login
- **Network Errors**: Proper error messages for network issues
- **Validation Errors**: Server validation errors are properly displayed

## Adding New Services

To add a new API service:

1. Create a new service file in `lib/api/services/`
2. Import and use the global `api` instance
3. Export the service from `lib/api/index.ts`

Example:

```typescript
// lib/api/services/patientService.ts
import api from '../axios';

export const patientService = {
  async getPatients() {
    const response = await api.get('/patients');
    return response.data;
  },
  
  async createPatient(patientData: any) {
    const response = await api.post('/patients', patientData);
    return response.data;
  }
};

// lib/api/index.ts
export { patientService } from './services/patientService';
```

## Testing

The global axios configuration works seamlessly with testing:

- Mock the `api` module in tests
- Test interceptors independently
- Easy to mock auth tokens for different test scenarios
