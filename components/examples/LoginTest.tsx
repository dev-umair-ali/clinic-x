'use client'

import { useState } from 'react';
import { authService } from '@/lib/api/services/authService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function LoginTest() {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTestLogin = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await authService.login({ email, password });
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login API Test</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </div>

        <Button 
          onClick={handleTestLogin} 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Testing...' : 'Test Login API'}
        </Button>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm px-4 py-2 rounded-md border border-destructive/20">
            Error: {error}
          </div>
        )}

        {result && (
          <div className="bg-muted/50 p-4 rounded-md">
            <h4 className="font-semibold mb-2">API Response:</h4>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          <p><strong>Note:</strong> This tests the login API endpoint at:</p>
          <p className="font-mono bg-muted p-2 rounded mt-1">
            {process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'https://api.clinicx.io'}/auth/login
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
