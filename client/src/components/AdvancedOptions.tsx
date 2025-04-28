import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface AdvancedOptionsProps {
  isLoading: boolean;
}

const AdvancedOptions = ({ isLoading }: AdvancedOptionsProps) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    animationSpeed: 5,
    flowPathComplexity: "Standard",
    autoMapping: false,
    validateFields: true,
    showDescriptions: true,
    refreshInterval: 60,
    errorHandling: "Notify & Log"
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
    
    // In a real application, we would send this to the backend
    console.log("Applied settings:", settings);
  };
  
  return (
    <div className="mt-8 bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-white">Advanced Data Flow Options</h3>
        <Button 
          onClick={handleSubmit} 
          disabled={isLoading}
        >
          Apply Settings
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <h4 className="text-white font-medium mb-3">Visualization Settings</h4>
          <div className="space-y-3">
            <div>
              <Label className="block text-sm text-gray-400 mb-1">Animation Speed</Label>
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
                <span className="text-white text-sm">{settings.animationSpeed}</span>
              </div>
            </div>
            <div>
              <Label className="block text-sm text-gray-400 mb-1">Flow Path Complexity</Label>
              <Select 
                value={settings.flowPathComplexity} 
                onValueChange={(value) => handleSettingChange("flowPathComplexity", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-gray-800 w-full text-white">
                  <SelectValue placeholder="Standard" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Simple">Simple</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Complex">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-3">Data Mapping Options</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="auto-mapping" 
                checked={settings.autoMapping}
                onCheckedChange={(checked) => handleSettingChange("autoMapping", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="auto-mapping" className="text-sm text-gray-300">Enable auto-mapping</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="validate-fields" 
                checked={settings.validateFields}
                onCheckedChange={(checked) => handleSettingChange("validateFields", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="validate-fields" className="text-sm text-gray-300">Validate field formats</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="show-descriptions" 
                checked={settings.showDescriptions}
                onCheckedChange={(checked) => handleSettingChange("showDescriptions", checked)}
                disabled={isLoading}
              />
              <Label htmlFor="show-descriptions" className="text-sm text-gray-300">Show field descriptions</Label>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-medium mb-3">API Connection</h4>
          <div className="space-y-3">
            <div>
              <Label className="block text-sm text-gray-400 mb-1">Refresh Interval (seconds)</Label>
              <Input 
                type="number" 
                value={settings.refreshInterval} 
                min={5}
                onChange={(e) => handleSettingChange("refreshInterval", parseInt(e.target.value))}
                className="bg-gray-800 text-white"
                disabled={isLoading}
              />
            </div>
            <div>
              <Label className="block text-sm text-gray-400 mb-1">Error Handling</Label>
              <Select 
                value={settings.errorHandling} 
                onValueChange={(value) => handleSettingChange("errorHandling", value)}
                disabled={isLoading}
              >
                <SelectTrigger className="bg-gray-800 w-full text-white">
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
    </div>
  );
};

export default AdvancedOptions;
