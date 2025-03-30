
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/components/ui/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    siteName: 'MediPort Hospital',
    adminEmail: 'admin@mediport.hospital',
    apiKey: 'med-port-00xx-xxxx-xxxx-xxxxxxxxxxxx',
    notificationsEnabled: true,
    darkMode: false,
    maintenanceMode: false
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your system settings have been updated successfully",
    });
  };

  const handleReset = () => {
    toast({
      title: "Settings reset",
      description: "Settings have been reset to default values",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">System Settings</h2>
        <p className="text-gray-600 mt-1">
          Configure system settings and preferences
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your system's primary configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName" 
                name="siteName"
                value={formData.siteName} 
                onChange={handleInputChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="adminEmail">Admin Email</Label>
              <Input 
                id="adminEmail" 
                name="adminEmail"
                type="email" 
                value={formData.adminEmail} 
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Settings */}
        <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
            <CardDescription>
              Manage API keys and integration settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="relative">
                <Input 
                  id="apiKey" 
                  name="apiKey"
                  type="password" 
                  value={formData.apiKey} 
                  onChange={handleInputChange}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="absolute right-1 top-1 h-8"
                    >
                      Show
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-3">
                    {formData.apiKey}
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>
                <span className="flex items-center mb-2">
                  API Documentation
                </span>
                <a 
                  href="#" 
                  className="text-primary hover:underline text-sm block mt-1"
                >
                  View API documentation
                </a>
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* System Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
            <CardDescription>
              Manage system state and maintenance options
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "System restarted",
                    description: "The medication transport system has been restarted"
                  });
                }}
              >
                Restart System
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Diagnostics started",
                    description: "System diagnostics process has been initiated"
                  });
                }}
              >
                Run Diagnostics
              </Button>
              
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  toast({
                    title: "Logs exported",
                    description: "System logs have been exported successfully"
                  });
                }}
              >
                Export Logs
              </Button>
            </div>
          </CardContent>
          <Separator />
          <CardFooter className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={handleSave}>
              Save Settings
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
