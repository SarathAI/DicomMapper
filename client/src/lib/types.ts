import { MappingData } from "@shared/schema";

// Visual appearance settings
export interface VisualSettings {
  animationSpeed: number;
  flowPathComplexity: "Simple" | "Standard" | "Complex";
  dataPointSize: number;
  lineThickness: number;
  showLabels: boolean;
  darkMode: boolean;
  highContrast: boolean;
}

// API and data fetching settings
export interface ApiSettings {
  endpoint: string;
  pollingInterval: number;
  enablePolling: boolean;
  retryOnFailure: boolean;
  retryCount: number;
  timeoutDuration: number;
}

// User preference settings
export interface UserPreferences {
  defaultView: "visualization" | "table" | "json";
  showDescriptions: boolean;
  showStatusBadges: boolean;
  tablePageSize: number;
  enableNotifications: boolean;
}

// Data mapping settings
export interface MappingSettings {
  autoMapping: boolean;
  validateFields: boolean;
  showDescriptions: boolean;
  errorHandling: "Log Only" | "Notify & Log" | "Auto-retry & Notify";
}

// Combined settings object
export interface AppSettings {
  visual: VisualSettings;
  api: ApiSettings;
  user: UserPreferences;
  mapping: MappingSettings;
}

// Mapping status types
export type MappingStatus = "Mapped" | "Needs Review" | "Unmapped" | "Error";
