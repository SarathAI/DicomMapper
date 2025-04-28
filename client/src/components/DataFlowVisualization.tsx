import { useEffect, useRef, useState } from "react";
import { MappingData } from "@shared/schema";

interface DataFlowVisualizationProps {
  data: MappingData;
  isLoading: boolean;
}

const DataFlowVisualization = ({ data, isLoading }: DataFlowVisualizationProps) => {
  // Show all entries for display in the visualization
  const [maxEntries, setMaxEntries] = useState(10);
  const allEntries = Object.entries(data || {});
  const visibleEntries = allEntries.slice(0, maxEntries);
  
  // Calculate how many total entries are available
  const totalEntries = allEntries.length;
  
  return (
    <div className="bg-background-darker bg-opacity-70 backdrop-blur-sm rounded-xl shadow-lg border border-gray-800 p-4 md:p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Data Flow Status</h3>
          <div className="flex items-center space-x-2">
            <div className="h-3 w-3 rounded-full bg-white"></div>
            <span className="text-gray-300">Active</span>
          </div>
        </div>
        
        <div className="flex space-x-3 mt-4 md:mt-0">
          <button 
            className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            Refresh Data
          </button>
          <button 
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
            disabled={isLoading}
          >
            Export Mapping
          </button>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-2">
          <span className="text-gray-400 text-sm">Showing {visibleEntries.length} of {totalEntries} mappings</span>
          <select 
            className="bg-gray-800 text-white text-sm px-2 py-1 rounded-md"
            value={maxEntries}
            onChange={(e) => setMaxEntries(parseInt(e.target.value))}
            disabled={isLoading}
          >
            <option value="5">5 entries</option>
            <option value="10">10 entries</option>
            <option value="15">15 entries</option>
            <option value="20">20 entries</option>
            <option value={totalEntries}>All entries</option>
          </select>
        </div>
      </div>
      
      {/* Data Flow Visualization */}
      <div className="mt-6 overflow-auto rounded-lg relative" style={{ height: "300px" }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <svg 
              width="100%" 
              height={Math.max(300, visibleEntries.length * 40 + 100)} 
              viewBox={`0 0 1000 ${Math.max(240, visibleEntries.length * 40 + 100)}`} 
              className="absolute left-0"
            >
              {/* Left Points */}
              <g className="left-nodes">
                {visibleEntries.map(([key, _], index) => (
                  <circle 
                    key={`left-${key}`} 
                    cx="100" 
                    cy={50 + index * 40} 
                    r="6" 
                    fill="hsl(var(--primary))" 
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
                    r="6" 
                    fill="hsl(var(--secondary))" 
                    className="node-pulse" 
                  />
                ))}
              </g>
              
              {/* Flow Lines */}
              {visibleEntries.map(([key, value], index) => {
                const gradientId = `gradient${index + 1}`;
                const pathId = `path${index + 1}`;
                const y = 50 + index * 40;
                const controlY1 = y - 30 + (index * 10);
                const controlY2 = y + 30 - (index * 10);
                
                return (
                  <g key={`flow-${key}`}>
                    <path 
                      id={pathId}
                      d={`M100,${y} C300,${controlY1} 700,${controlY2} 900,${y}`} 
                      className="data-path" 
                      fill="none" 
                      stroke={`url(#${gradientId})`} 
                      strokeWidth="2"
                    />
                    
                    <circle r="3" fill="#FFFFFF" className="data-particle">
                      <animateMotion
                        dur={`${3 + index * 0.5}s`}
                        repeatCount="indefinite"
                        path={`M100,${y} C300,${controlY1} 700,${controlY2} 900,${y}`}
                      />
                    </circle>
                  </g>
                );
              })}
              
              {/* Gradient Definitions */}
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.6)" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.5)" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.4)" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.35)" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                <linearGradient id="gradient5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="50%" stopColor="rgba(255, 255, 255, 0.3)" />
                  <stop offset="100%" stopColor="hsl(var(--secondary))" />
                </linearGradient>
                
                {/* Additional gradients for more entries */}
                {Array.from({ length: 15 }).map((_, i) => i + 6).map(num => (
                  <linearGradient key={`gradient${num}`} id={`gradient${num}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="50%" stopColor={`rgba(255, 255, 255, ${0.6 - (num * 0.02)})`} />
                    <stop offset="100%" stopColor="hsl(var(--secondary))" />
                  </linearGradient>
                ))}
              </defs>
            </svg>
            
            {/* Labels */}
            <div className="absolute top-0 left-4 h-full flex flex-col justify-between py-6">
              <div className="text-sm text-white font-medium">HL7 Fields</div>
              {visibleEntries.map(([key], index) => (
                <div key={`left-label-${key}`} className="text-xs text-gray-300 opacity-80">
                  {key}
                </div>
              ))}
            </div>
            
            <div className="absolute top-0 right-4 h-full flex flex-col justify-between py-6">
              <div className="text-sm text-white font-medium">DICOM Fields</div>
              {visibleEntries.map(([_, value], index) => (
                <div key={`right-label-${value}`} className="text-xs text-gray-300 opacity-80">
                  {value}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DataFlowVisualization;
