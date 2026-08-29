import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { db } from '../../db/index';
import { sites } from '../../db/schema';
import { getSiteTemperature } from './fortyguard';
import { calculateRisk } from './risk';
import { evaluateSiteForAlert } from './alerts';

export async function analyzeAllSites(forceRefresh = false) {
  const allSites = await db.select().from(sites);
  const timestamp = new Date().toISOString();
  
  // Use Promise.all to fetch temperatures concurrently for all sites
  const analysisPromises = allSites.map(async (site) => {
    try {
      const temp = await getSiteTemperature(site.lat, site.lng, forceRefresh);
      const risk = calculateRisk(temp.current, temp.max);
      
      // Evaluate real risk for automatic alert creation & deduplication
      await evaluateSiteForAlert(site, risk, temp);

      return {
        site,
        temperature: temp,
        risk,
        lastUpdated: timestamp
      };
    } catch (err: any) {
      console.log(`[FortyGuard Status] Site ${site.name}: No thermal cell data returned.`);
      
      // No thermal data -> evaluate with null (DOES NOT create alerts)
      await evaluateSiteForAlert(site, null, null);

      return {
        site,
        temperature: null,
        risk: null,
        error: 'FortyGuard data unavailable for this location.',
        lastUpdated: timestamp
      };
    }
  });

  const results = await Promise.all(analysisPromises);
  
  // Sort by risk score descending
  results.sort((a, b) => {
    if (a.risk && b.risk) {
      return b.risk.score - a.risk.score;
    }
    if (a.risk) return -1;
    if (b.risk) return 1;
    return 0;
  });
  
  return results;
}

const analyzeSitesDeclaration: FunctionDeclaration = {
  name: 'analyzeSites',
  description: 'Analyzes all monitored sites by retrieving real FortyGuard temperature intelligence and calculating the HeatShield Risk score for each. Returns a ranked list of sites.',
  parameters: {
    type: Type.OBJECT,
    properties: {},
  }
};

export async function processAgentRequest(userMessage: string) {
  let actionLog: string[] = [];

  if (process.env.GEMINI_API_KEY) {
    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    const systemInstruction = `You are the HeatShield AI agent. You help operations managers monitor heat risk across their outdoor worksites using FortyGuard temperature intelligence. 
You have access to the 'analyzeSites' tool which fetches real data, calculates risk scores, and ranks all sites.
Always use the tool if the user asks about site risk, monitoring sites, or generating a report.
Present the data professionally. Mention that the data is sourced from FortyGuard.
Do NOT invent temperature data or risk scores. Only use data returned by the tool.
If the tool returns an error for a site, mention that temperature intelligence is currently unavailable for that site.
If asked for an Operations Brief or Report, format it beautifully with Markdown headings, lists, bold text for key metrics, and clear sections (Executive Summary, Highest Risk Locations, Peak Heat Windows, Recommendations, Data Provenance).`;

    // Models to attempt in order of preference
    const candidateModels = ["gemini-2.5-flash", "gemini-2.5-pro"];

    for (const modelName of candidateModels) {
      try {
        const chat = ai.chats.create({
          model: modelName,
          config: {
            systemInstruction,
            tools: [{ functionDeclarations: [analyzeSitesDeclaration] }],
            temperature: 0.2
          }
        });

        let response = await chat.sendMessage({ message: userMessage });
        let functionCalls = response.functionCalls;

        if (functionCalls && functionCalls.length > 0) {
          actionLog.push("Request understood");
          const call = functionCalls[0];
          
          if (call.name === 'analyzeSites') {
            actionLog.push("Retrieving monitored sites");
            actionLog.push("Requesting current temperature intelligence from FortyGuard API");
            
            const analysisResult = await analyzeAllSites();
            
            actionLog.push("Analyzed locations and calculated HeatShield Risk");
            
            // Send concise normalized tool response back to the model for ultra-fast response
            const normalizedForLLM = analysisResult.map(item => ({
              siteName: item.site.name,
              city: item.site.city,
              currentTempC: item.temperature?.current ? Number(item.temperature.current.toFixed(1)) : null,
              maxTempC: item.temperature?.max ? Number(item.temperature.max.toFixed(1)) : null,
              riskScore: item.risk?.score,
              riskLevel: item.risk?.level,
              riskFactors: item.risk?.factors,
              recommendation: item.risk?.recommendation,
              error: item.error
            }));

            response = await chat.sendMessage({
              message: [{
                functionResponse: {
                  name: call.name,
                  response: { result: normalizedForLLM }
                }
              }]
            });
            
            actionLog.push("Operations brief ready");
          }
        }

        if (response.text) {
          return {
            text: response.text,
            actionLog
          };
        }
      } catch (err: any) {
        console.warn(`Gemini API call with model '${modelName}' encountered an issue:`, err.message || err);
        // Continue to next model if available
      }
    }
  }

  // Graceful Fallback if GEMINI_API_KEY is not set or AI quota/rate limits are hit
  console.log("Generating FortyGuard HeatShield Operations Brief fallback.");
  actionLog = [
    "Request understood",
    "Retrieving monitored sites",
    "Requesting current temperature intelligence from FortyGuard API",
    "Analyzed locations and calculated HeatShield Risk",
    "Operations brief ready (Direct FortyGuard Engine)"
  ];

  const analysisResult = await analyzeAllSites();
  const highestRisk = analysisResult[0];

  let fallbackBrief = `## 🛡️ HeatShield AI Operations Brief\n\n`;
  fallbackBrief += `### Executive Summary\n`;
  fallbackBrief += `Direct analysis generated using real **FortyGuard Thermal Intelligence** across **${analysisResult.length} monitored worksites**.\n\n`;

  if (highestRisk && highestRisk.risk) {
    fallbackBrief += `**Highest Priority Action Item:** **${highestRisk.site.name}** in ${highestRisk.site.city} currently presents the highest heat risk (**Score: ${highestRisk.risk.score}/100 - ${highestRisk.risk.level} Risk**).\n\n`;
  } else {
    fallbackBrief += `**System Notice:** Real FortyGuard thermal data is currently unavailable for monitored locations (0 thermal cells returned). No heat risk ranking or temperature estimates can be fabricated at this time.\n\n`;
  }

  fallbackBrief += `### Monitored Site Rankings\n`;
  analysisResult.forEach((item, idx) => {
    fallbackBrief += `#### ${idx + 1}. ${item.site.name} (${item.site.city})\n`;
    if (item.risk && item.temperature) {
      fallbackBrief += `- **HeatShield Risk:** ${item.risk.score}/100 (${item.risk.level})\n`;
      fallbackBrief += `- **FortyGuard Temperature:** Current ${item.temperature.current.toFixed(1)}°C | Projected Max ${item.temperature.max.toFixed(1)}°C\n`;
      fallbackBrief += `- **Key Risk Factors:** ${item.risk.factors.join(', ')}\n`;
      fallbackBrief += `- **Recommended Protocol:** ${item.risk.recommendation}\n\n`;
    } else {
      fallbackBrief += `- *Status:* ${item.error || 'FortyGuard thermal data pending'}\n\n`;
    }
  });

  fallbackBrief += `### Data Provenance\n`;
  fallbackBrief += `All surface microclimate temperatures are retrieved live from FortyGuard's high-resolution satellite and sensor thermal models.`;

  return {
    text: fallbackBrief,
    actionLog
  };
}
