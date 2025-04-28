import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("visual");
  
  const [visualSettings, setVisualSettings] = useState({
    darkMode: true,
    animationEnabled: true,
    highContrast: false,
    dataPointSize: 6,
    lineThickness: 2,
    showLabels: true,
  });
  
  const [apiSettings, setApiSettings] = useState({
    apiEndpoint: "/api/mapping-data",
    pollingInterval: 60,
    enablePolling: false,
    timeoutDuration: 30,
    retryCount: 3,
  });
  
  const [userPreferences, setUserPreferences] = useState({
    defaultView: "visualization",
    showDescriptions: true,
    showStatusBadges: true,
    pageSize: 10,
    enableNotifications: true,
  });
  
  const handleVisualSettingsChange = (key: string, value: any) => {
    setVisualSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleApiSettingsChange = (key: string, value: any) => {
    setApiSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleUserPreferencesChange = (key: string, value: any) => {
    setUserPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const saveSettings = () => {
    // In a real app, we would save these settings to the server
    toast({
      title: "Settings Saved",
      description: "Your preferences have been updated successfully.",
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Page Title */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <p className="text-gray-400 mt-2">Customize the application to suit your needs</p>
      </div>
      
      {/* Settings Tabs */}
      <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="visual">Visual Settings</TabsTrigger>
            <TabsTrigger value="api">API Settings</TabsTrigger>
            <TabsTrigger value="preferences">User Preferences</TabsTrigger>
          </TabsList>
          
          {/* Visual Settings Tab */}
          <TabsContent value="visual" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Visual Appearance</CardTitle>
                <CardDescription>Customize how the visualization looks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <Switch 
                        id="darkMode" 
                        checked={visualSettings.darkMode} 
                        onCheckedChange={(checked) => handleVisualSettingsChange("darkMode", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="animationEnabled">Enable Animations</Label>
                      <Switch 
                        id="animationEnabled" 
                        checked={visualSettings.animationEnabled} 
                        onCheckedChange={(checked) => handleVisualSettingsChange("animationEnabled", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="highContrast">High Contrast Mode</Label>
                      <Switch 
                        id="highContrast" 
                        checked={visualSettings.highContrast} 
                        onCheckedChange={(checked) => handleVisualSettingsChange("highContrast", checked)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="dataPointSize">Data Point Size (px)</Label>
                      <Input 
                        id="dataPointSize" 
                        type="number" 
                        value={visualSettings.dataPointSize} 
                        onChange={(e) => handleVisualSettingsChange("dataPointSize", parseInt(e.target.value))}
                        min={2}
                        max={12}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="lineThickness">Line Thickness (px)</Label>
                      <Input 
                        id="lineThickness" 
                        type="number" 
                        value={visualSettings.lineThickness} 
                        onChange={(e) => handleVisualSettingsChange("lineThickness", parseInt(e.target.value))}
                        min={1}
                        max={5}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showLabels">Show Field Labels</Label>
                      <Switch 
                        id="showLabels" 
                        checked={visualSettings.showLabels} 
                        onCheckedChange={(checked) => handleVisualSettingsChange("showLabels", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* API Settings Tab */}
          <TabsContent value="api" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
                <CardDescription>Configure how the application interacts with the backend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input 
                      id="apiEndpoint" 
                      value={apiSettings.apiEndpoint} 
                      onChange={(e) => handleApiSettingsChange("apiEndpoint", e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pollingInterval">Polling Interval (seconds)</Label>
                      <Input 
                        id="pollingInterval" 
                        type="number" 
                        value={apiSettings.pollingInterval} 
                        onChange={(e) => handleApiSettingsChange("pollingInterval", parseInt(e.target.value))}
                        min={5}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="timeoutDuration">Request Timeout (seconds)</Label>
                      <Input 
                        id="timeoutDuration" 
                        type="number" 
                        value={apiSettings.timeoutDuration} 
                        onChange={(e) => handleApiSettingsChange("timeoutDuration", parseInt(e.target.value))}
                        min={5}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enablePolling">Enable Auto-Refresh</Label>
                      <Switch 
                        id="enablePolling" 
                        checked={apiSettings.enablePolling} 
                        onCheckedChange={(checked) => handleApiSettingsChange("enablePolling", checked)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="retryCount">Retry Count on Failure</Label>
                      <Input 
                        id="retryCount" 
                        type="number" 
                        value={apiSettings.retryCount} 
                        onChange={(e) => handleApiSettingsChange("retryCount", parseInt(e.target.value))}
                        min={0}
                        max={10}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* User Preferences Tab */}
          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Preferences</CardTitle>
                <CardDescription>Customize your experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="defaultView">Default View</Label>
                      <select 
                        id="defaultView" 
                        value={userPreferences.defaultView} 
                        onChange={(e) => handleUserPreferencesChange("defaultView", e.target.value)}
                        className="w-full mt-1 bg-gray-800 text-white px-3 py-2 rounded-md"
                      >
                        <option value="visualization">Visualization</option>
                        <option value="table">Table View</option>
                        <option value="json">JSON Editor</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="pageSize">Table Page Size</Label>
                      <Input 
                        id="pageSize" 
                        type="number" 
                        value={userPreferences.pageSize} 
                        onChange={(e) => handleUserPreferencesChange("pageSize", parseInt(e.target.value))}
                        min={5}
                        max={50}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showDescriptions">Show Field Descriptions</Label>
                      <Switch 
                        id="showDescriptions" 
                        checked={userPreferences.showDescriptions} 
                        onCheckedChange={(checked) => handleUserPreferencesChange("showDescriptions", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="showStatusBadges">Show Status Badges</Label>
                      <Switch 
                        id="showStatusBadges" 
                        checked={userPreferences.showStatusBadges} 
                        onCheckedChange={(checked) => handleUserPreferencesChange("showStatusBadges", checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableNotifications">Enable Notifications</Label>
                      <Switch 
                        id="enableNotifications" 
                        checked={userPreferences.enableNotifications} 
                        onCheckedChange={(checked) => handleUserPreferencesChange("enableNotifications", checked)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={saveSettings}>Save All Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
