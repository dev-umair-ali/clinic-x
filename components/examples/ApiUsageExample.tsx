'use client'

import { useState } from 'react';
import { useApi } from '@/lib/hooks/useApi';
import { appointmentService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ApiUsageExample() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const api = useApi();

  // Example using the useApi hook
  const handleGetAppointments = async () => {
    setLoading(true);
    setError(null);
    
    const { data, error: apiError } = await api.get('/appointments');
    
    if (apiError) {
      setError(apiError);
    } else {
      setResult(data);
    }
    
    setLoading(false);
  };

  // Example using the service directly
  const handleGetAppointmentsService = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await appointmentService.getAppointments();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
    
    setLoading(false);
  };

  // Example using the global axios instance directly
  const handleDirectAxiosCall = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { default: api } = await import('@/lib/api/axios');
      const response = await api.get('/appointments');
      setResult(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
    
    setLoading(false);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>API Usage Examples</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Button 
            onClick={handleGetAppointments} 
            disabled={loading}
            variant="outline"
          >
            Get Appointments (useApi Hook)
          </Button>
          
          <Button 
            onClick={handleGetAppointmentsService} 
            disabled={loading}
            variant="outline"
          >
            Get Appointments (Service)
          </Button>
          
          <Button 
            onClick={handleDirectAxiosCall} 
            disabled={loading}
            variant="outline"
          >
            Get Appointments (Direct Axios)
          </Button>
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-md border border-destructive/20">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">Result:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          <p><strong>Note:</strong> All API calls automatically include the JWT token from localStorage.</p>
          <p>If you're not logged in, you'll see authentication errors.</p>
        </div>
      </CardContent>
    </Card>
  );
}
