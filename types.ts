export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface Site {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  siteType: string;
  operatingHours?: string;
  notes?: string;
  createdAt: number;
}

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: string[];
  recommendation: string;
}

export interface SiteAnalysis {
  site: Site;
  temperature?: {
    current: number;
    max: number;
    min: number;
  };
  risk?: RiskAssessment;
  error?: string;
}

export interface AgentResponse {
  text?: string;
  actionLog?: string[];
  error?: string;
}

export interface Alert {
  id: string;
  siteId: string;
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  message: string;
  status: 'ACTIVE' | 'RESOLVED';
  createdAt: number;
  resolvedAt?: number;
}
