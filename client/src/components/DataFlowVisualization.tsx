import { useEffect, useRef } from "react";
import { MappingData } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface VisualizationSettings {
  animationSpeed: number;
  flowPathComplexity: "Simple" | "Standard" | "Complex";
  showLabels: boolean;
}

interface DataFlowVisualizationProps {
  data: MappingData;
  isLoading: boolean;
  settings?: VisualizationSettings;
}

const defaultSettings: VisualizationSettings = {
  animationSpeed: 5,
  flowPathComplexity: "Standard",
  showLabels: true
};

const DataFlowVisualization = ({ 
  data, 
  isLoading, 
  settings = defaultSettings 
}: DataFlowVisualizationProps) => {
  // Filter the first 5 entries for display in the visualization
  const visibleEntries = Object.entries(data || {}).slice(0, 5);
  
  // Calculate path complexity based on settings
  const getPathData = (index: number, y: number) => {
    switch(settings.flowPathComplexity) {
      case "Simple":
        return `M100,${y} L900,${y}`;
      case "Complex":
        const wiggle = 25 + (index * 15);
        const controlY1 = y - wiggle;
        const controlY2 = y + wiggle;
        return `M100,${y} C300,${controlY1} 700,${controlY2} 900,${y}`;
      case "Standard":
      default:
        const offset = 20 + (index * 10);
        const midY1 = y - offset;
        const midY2 = y + offset;
        return `M100,${y} C300,${midY1} 700,${midY2} 900,${y}`;
    }
  };
  
  // Calculate animation speed based on settings
  const getAnimationDuration = (index: number) => {
    // Invert the scale so higher numbers = faster animation
    const speed = 11 - settings.animationSpeed;
    return `${speed + (index * 0.5)}s`;
  };
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 md:p-6 mb-8 shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <span className="text-green-600 font-medium">Active</span>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700"
            disabled={isLoading}
          >
            Refresh Data
          </Button>
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700"
            disabled={isLoading}
          >
            Export Mapping
          </Button>
        </div>
      </div>
      
      {/* Data Flow Visualization */}
      <div className="mt-6 overflow-hidden rounded-lg relative border border-gray-100 p-2" style={{ height: "240px" }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <svg width="100%" height="100%" viewBox="0 0 1000 240" className="absolute inset-0">
              {/* Left Points */}
              <g className="left-nodes">
                {visibleEntries.map(([key, _], index) => (
                  <circle 
                    key={`left-${key}`} 
                    cx="100" 
                    cy={50 + index * 40} 
                    r={settings.animationSpeed / 2 + 2} 
                    fill="#4F46E5" 
                    className="node-pulse" 
                  />
                ))}
              </g>
              
              {/* Right Points */}
              <g className="right-nodes">
                {visibleEntries.map(([_, value], index) => (
                  <circle 
                    key={`right-${value}`} 
                    cx="900" 
                    cy={50 + index * 40} 
                    r={settings.animationSpeed / 2 + 2} 
                    fill="#4F46E5" 
                    className="node-pulse" 
                  />
                ))}
              </g>
              
              {/* Flow Lines */}
              {visibleEntries.map(([key, value], index) => {
                const gradientId = `gradient${index + 1}`;
                const pathId = `path${index + 1}`;
                const y = 50 + index * 40;
                const pathData = getPathData(index, y);
                
                return (
                  <g key={`flow-${key}`}>
                    <path 
                      id={pathId}
                      d={pathData} 
                      className="data-path" 
                      fill="none" 
                      stroke={`url(#${gradientId})`} 
                      strokeWidth={Math.max(1, settings.animationSpeed / 4)}
                    />
                    
                    <circle r="3" fill="#3B82F6" className="data-particle">
                      <animateMotion
                        dur={getAnimationDuration(index)}
                        repeatCount="indefinite"
                        path={pathData}
                      />
                    </circle>
                  </g>
                );
              })}
              
              {/* Gradient Definitions */}
              <defs>
                {[1, 2, 3, 4, 5].map(i => (
                  <linearGradient key={`grad-${i}`} id={`gradient${i}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#4F46E5" />
                    <stop offset="50%" stopColor="#3B82F6" />
                    <stop offset="100%" stopColor="#4F46E5" />
                  </linearGradient>
                ))}
              </defs>
            </svg>
            
            {/* Labels - only show if settings.showLabels is true */}
            {settings.showLabels && (
              <>
                <div className="absolute top-0 left-4 h-full flex flex-col justify-between py-6">
                  <div className="text-sm text-blue-700 font-medium">HL7 Fields</div>
                  {visibleEntries.map(([key], index) => (
                    <div key={`left-label-${key}`} className="text-xs text-gray-700">
                      {key}
                    </div>
                  ))}
                </div>
                
                <div className="absolute top-0 right-4 h-full flex flex-col justify-between py-6">
                  <div className="text-sm text-blue-700 font-medium">DICOM Fields</div>
                  {visibleEntries.map(([_, value], index) => (
                    <div key={`right-label-${value}`} className="text-xs text-gray-700">
                      {value}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DataFlowVisualization;
