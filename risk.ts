export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface RiskAssessment {
  score: number;
  level: RiskLevel;
  factors: string[];
  recommendation: string;
}

export function calculateRisk(meanTemp: number, maxTemp: number): RiskAssessment {
  let score = 0;
  const factors: string[] = [];
  
  // Base score from peak temperature (maxTemp)
  if (maxTemp >= 40) { // 104F
    score += 90;
    factors.push('Extreme peak temperatures forecasted (>= 40°C).');
  } else if (maxTemp >= 35) { // 95F
    score += 70;
    factors.push('Dangerous peak temperatures forecasted (>= 35°C).');
  } else if (maxTemp >= 30) { // 86F
    score += 50;
    factors.push('Elevated peak temperatures expected (>= 30°C).');
  } else if (maxTemp >= 25) { // 77F
    score += 30;
    factors.push('Warm peak temperatures expected.');
  } else {
    score += 10;
    factors.push('Temperatures within normal safe operating ranges.');
  }

  // Add risk based on mean/average temp for the day (prolonged exposure)
  if (meanTemp >= 32) {
    score += 25;
    factors.push('Prolonged exposure risk: high average daily temperature.');
  } else if (meanTemp >= 28) {
    score += 15;
    factors.push('Prolonged exposure risk: elevated average daily temperature.');
  }

  // Cap at 100
  score = Math.min(100, Math.max(0, score));

  let level: RiskLevel = 'Low';
  let recommendation = '';

  if (score >= 85) {
    level = 'Critical';
    recommendation = 'Halt non-essential outdoor tasks. Enforce mandatory rest and hydration cycles. Continuous monitoring required.';
  } else if (score >= 60) {
    level = 'High';
    recommendation = 'Review outdoor task scheduling. Consider moving non-critical outdoor work to a cooler time window. Prioritize supervisor attention.';
  } else if (score >= 30) {
    level = 'Moderate';
    recommendation = 'Increase monitoring during the identified risk period. Ensure workers have access to shade and water.';
  } else {
    level = 'Low';
    recommendation = 'Standard safety operating procedures. Monitor for unexpected weather changes.';
  }

  return { score, level, factors, recommendation };
}
