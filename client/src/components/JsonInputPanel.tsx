import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { MappingData } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";

interface JsonInputPanelProps {
  data: MappingData;
  isLoading: boolean;
  updateData: (data: MappingData) => void;
  lastUpdated: Date | null;
}

const JsonInputPanel = ({ data, isLoading, updateData, lastUpdated }: JsonInputPanelProps) => {
  const [jsonString, setJsonString] = useState<string>(() => JSON.stringify(data, null, 2));
  const { toast } = useToast();
  const preRef = useRef<HTMLPreElement>(null);
  
  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonString);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonString(formatted);
      toast({
        title: "JSON Formatted",
        description: "JSON has been formatted successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The JSON is invalid and cannot be formatted.",
        variant: "destructive",
      });
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(jsonString).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "The JSON has been copied to your clipboard.",
      });
    });
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonString(e.target.value);
  };
  
  const applyChanges = () => {
    try {
      const parsed = JSON.parse(jsonString);
      updateData(parsed);
      toast({
        title: "Changes applied",
        description: "The JSON has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Invalid JSON",
        description: "The JSON is invalid and cannot be applied.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card className="bg-white border border-gray-200 shadow-sm rounded-lg h-full">
      <CardContent className="p-4">
        <div className="text-center mb-8 pt-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p className="text-gray-600 text-sm mb-2">Upload a text file to process with the AI workflow</p>
          
          <div className="flex space-x-2 justify-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={formatJson}
              disabled={isLoading}
              className="border-gray-300 text-gray-700"
            >
              Format
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={copyToClipboard}
              disabled={isLoading}
              className="border-gray-300 text-gray-700"
            >
              Copy
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={applyChanges}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Apply
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-[180px]">
          <textarea
            className="text-sm font-mono text-gray-700 whitespace-pre-wrap w-full h-24 bg-transparent outline-none resize-none"
            value={jsonString}
            onChange={handleInputChange}
            disabled={isLoading}
            placeholder="Enter your JSON data..."
          />
        </div>
        
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
            {isLoading ? (
              <>
                <div className="h-2 w-2 rounded-full bg-yellow-500 animate-pulse"></div>
                <span>Processing...</span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span>Ready</span>
              </>
            )}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            {lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleString()}` : 'No uploads yet'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JsonInputPanel;
