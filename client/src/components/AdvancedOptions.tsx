import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface AdvancedOptionsProps {
  isLoading: boolean;
  onSettingsChanged?: (settings: any) => void;
}

const AdvancedOptions = ({ isLoading, onSettingsChanged }: AdvancedOptionsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    animationSpeed: 5,
    flowPathComplexity: "Standard" as "Simple" | "Standard" | "Complex",
    showLabels: true,
    autoMapping: false,
    validateFields: true,
    showDescriptions: true,
    refreshInterval: 60,
    errorHandling: "Notify & Log" as "Log Only" | "Notify & Log" | "Auto-retry & Notify"
  });
  
  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleSubmit = () => {
    toast({
      title: "Settings Applied",
      description: "Your visualization settings have been updated.",
    });
    
    // Log to the console
    console.log("Applied settings:", settings);
    
    // Call the callback if provided to update parent components
    if (onSettingsChanged) {
      onSettingsChanged(settings);
    }
    
    // We would also send this to the backend in a real application
  };
  
  return (
    <Card className="mt-8 border border-gray-200 shadow-sm">
      <CardHeader className="border-b border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-xl font-semibold text-gray-800">Advanced Settings</CardTitle>
          <Button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Apply Settings
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="text-gray-800 font-medium mb-3">Visualization Settings</h4>
            <div className="space-y-3">
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Animation Speed</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={[settings.animationSpeed]}
                    onValueChange={(value) => handleSettingChange("animationSpeed", value[0])}
                    disabled={isLoading}
                    className="my-2"
                  />
                  <span className="text-gray-800 text-sm">{settings.animationSpeed}</span>
                </div>
              </div>
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Flow Path Complexity</Label>
                <Select 
                  value={settings.flowPathComplexity} 
                  onValueChange={(value: "Simple" | "Standard" | "Complex") => handleSettingChange("flowPathComplexity", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-gray-300 w-full text-gray-800">
                    <SelectValue placeholder="Standard" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Standard">Standard</SelectItem>
                    <SelectItem value="Complex">Complex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-labels" 
                  checked={settings.showLabels}
                  onCheckedChange={(checked) => handleSettingChange("showLabels", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="show-labels" className="text-sm text-gray-700">Show field labels</Label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-800 font-medium mb-3">Data Mapping Options</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="auto-mapping" 
                  checked={settings.autoMapping}
                  onCheckedChange={(checked) => handleSettingChange("autoMapping", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="auto-mapping" className="text-sm text-gray-700">Enable auto-mapping</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="validate-fields" 
                  checked={settings.validateFields}
                  onCheckedChange={(checked) => handleSettingChange("validateFields", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="validate-fields" className="text-sm text-gray-700">Validate field formats</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="show-descriptions" 
                  checked={settings.showDescriptions}
                  onCheckedChange={(checked) => handleSettingChange("showDescriptions", checked)}
                  disabled={isLoading}
                />
                <Label htmlFor="show-descriptions" className="text-sm text-gray-700">Show field descriptions</Label>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="text-gray-800 font-medium mb-3">API Connection</h4>
            <div className="space-y-3">
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Refresh Interval (seconds)</Label>
                <Input 
                  type="number" 
                  value={settings.refreshInterval} 
                  min={5}
                  onChange={(e) => handleSettingChange("refreshInterval", parseInt(e.target.value))}
                  className="border-gray-300"
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label className="block text-sm text-gray-600 mb-1">Error Handling</Label>
                <Select 
                  value={settings.errorHandling} 
                  onValueChange={(value: "Log Only" | "Notify & Log" | "Auto-retry & Notify") => 
                    handleSettingChange("errorHandling", value)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger className="bg-white border-gray-300 w-full text-gray-800">
                    <SelectValue placeholder="Notify & Log" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Log Only">Log Only</SelectItem>
                    <SelectItem value="Notify & Log">Notify & Log</SelectItem>
                    <SelectItem value="Auto-retry & Notify">Auto-retry & Notify</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdvancedOptions;
