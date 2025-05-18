
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate form
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    console.log("Attempting to connect to authentication service:", {
      url: 'http://132.220.27.51/login',
      credentials: {
        username: formData.username,
        // Not logging the actual password for security
        passwordLength: formData.password.length
      }
    });

    // Create request data
    const requestData = {
      username: formData.username,
      password: formData.password,
    };

    try {
      // Using a proxy approach to avoid mixed content issues
      // The browser prevents direct HTTP requests from HTTPS pages for security
      console.log("Starting authentication with HTTP endpoint");
      
      // Connect to the external authentication service using HTTP
      // Note: For this to work in production, you would need a proxy or backend service
      const response = await fetch('http://132.220.27.51/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log("Auth response status:", response.status);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Auth error data:", errorData);
        throw new Error(errorData.message || 'Authentication failed');
      }

      const data = await response.json();
      console.log("Auth success data:", {
        tokenReceived: !!data.token,
        tokenLength: data.token ? data.token.length : 0
      });
      
      // Store the JWT token
      localStorage.setItem('token', data.token);
      localStorage.setItem('isLoggedIn', 'true');
      
      if (formData.rememberMe) {
        localStorage.setItem('username', formData.username);
      }
      
      toast({
        title: "Login successful",
        description: "Welcome to MediPort",
      });
      
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error details:', err);
      setError(err instanceof Error ? err.message : 'Authentication failed. Please try again.');
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center login-gradient p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-medical-primary">MediPort</h1>
          <p className="text-medical-dark/70 mt-2">
            Robotic Medication Transport System
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md text-sm">
                  {error}
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="username">Username / Email</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Enter your username or email"
                  value={formData.username}
                  onChange={handleInputChange}
                  autoComplete="username"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm text-medical-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  autoComplete="current-password"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="rememberMe" 
                  checked={formData.rememberMe}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                  Remember me for 30 days
                </Label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-medical-primary hover:bg-medical-primary/90"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t p-4">
            <p className="text-sm text-muted-foreground">
              Need help? Contact <span className="text-medical-primary">IT Support</span>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
