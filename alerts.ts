import { db } from '../../db/index';
import { alerts } from '../../db/schema';
import { eq, and } from 'drizzle-orm';
import { RiskAssessment } from './risk';

export interface SiteInfo {
  id: string;
  name: string;
  city: string;
  state: string;
}

export interface TempInfo {
  current: number;
  max: number;
}

/**
 * Evaluates real site risk and persists/updates alerts in the database.
 * Rules:
 * - If thermal data or risk assessment is null/unavailable: NO alert generated.
 * - If risk level is High or Critical: Create active alert (or update existing active alert for deduplication).
 * - If risk level is Low or Moderate: Resolve any existing active alerts for this site.
 */
export async function evaluateSiteForAlert(
  site: SiteInfo,
  risk: RiskAssessment | null,
  temp: TempInfo | null
) {
  // If thermal data or risk assessment is unavailable / null, DO NOT create alerts.
  if (!risk || !temp) {
    return null;
  }

  const isHighOrCritical = risk.level === 'High' || risk.level === 'Critical';
  const severity = risk.level.toUpperCase(); // 'HIGH' | 'CRITICAL'

  try {
    // Query existing active alerts for this site
    const existingActiveAlerts = await db
      .select()
      .from(alerts)
      .where(and(eq(alerts.siteId, site.id), eq(alerts.status, 'ACTIVE')));

    if (isHighOrCritical) {
      const message = `${risk.level.toUpperCase()} Heat Risk at ${site.name} (${site.city}, ${site.state}): Peak ${temp.max.toFixed(1)}°C (Score ${risk.score}/100). ${risk.recommendation}`;

      if (existingActiveAlerts.length > 0) {
        // Deduplicate: update existing active alert rather than creating duplicate row
        const existing = existingActiveAlerts[0];
        await db
          .update(alerts)
          .set({
            severity,
            message,
            createdAt: Date.now()
          })
          .where(eq(alerts.id, existing.id));

        return {
          ...existing,
          severity,
          message,
          createdAt: Date.now()
        };
      } else {
        // Create new active alert
        const newAlert = {
          id: `alert-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          siteId: site.id,
          severity,
          message,
          status: 'ACTIVE' as const,
          createdAt: Date.now(),
          resolvedAt: null
        };
        await db.insert(alerts).values(newAlert);
        return newAlert;
      }
    } else {
      // Risk is Low or Moderate. If there are active alerts for this site, resolve them.
      for (const activeAlert of existingActiveAlerts) {
        await db
          .update(alerts)
          .set({
            status: 'RESOLVED',
            resolvedAt: Date.now()
          })
          .where(eq(alerts.id, activeAlert.id));
      }
      return null;
    }
  } catch (err) {
    console.error(`Error evaluating alert for site ${site.id}:`, err);
    return null;
  }
}
