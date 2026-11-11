export interface SurveyResponse {
  id: string;
  timestamp: number;
  scores: [number, number, number, number, number]; // Q1 to Q5 (1-5)
  average: number;
  suggestion?: string;
  deviceId: string;
}

export interface SurveyQuestion {
  id: number;
  shortLabel: string;
  title: string;
  description: string;
  category: string;
}

export interface LikertLevel {
  min: number;
  max: number;
  label: string;
  badgeClass: string;
  colorHex: string;
  description: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
