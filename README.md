# HeatShield-AI: Intelligent Heat Risk & Worker Safety Management System

HeatShield-AI is a full-stack, enterprise-grade occupational heat risk monitoring platform. Powered by **FortyGuard Thermal API** intelligence, HeatShield-AI delivers hyper-local surface temperature modeling, real-time WBGT (Wet Bulb Globe Temperature) heat strain assessments, and automated AI safety agent workflows for indoor and outdoor worksites.

---

## 🌟 Key Features

- **Hyper-Local Thermal Monitoring**: Integrates with the **FortyGuard Thermal API** (down to 2-meter street-level granularity) for microclimate heat risk analysis.
- **Heat Strain Index Calculation**: Real-time compute engine for WBGT, Heat Index, and OSHA/ACGIH heat stress thresholds.
- **AI Safety Agent**: Continuous background worker safety agent analyzing environmental factors, work intensity, solar radiation, and personal risk profiles to auto-trigger safety alerts.
- **Worksite Dashboard**: Interactive GIS spatial mapping, zone monitoring, active hazard alerts, and real-time sensor telematics.
- **Automated Mitigation Workflows**: Actionable protocol generation including mandatory hydration breaks, shade rotation, work-rest cycles, and emergency response escalation.
- **Incident & Health Logging**: Incident tracking, safety compliance reporting, and historical microclimate analytics.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide React Icons, Recharts, Motion animations.
- **Backend**: Node.js, Express, TypeScript (bundled via `esbuild`).
- **Database**: SQLite / Drizzle ORM for local persistent storage of worksites, alerts, worker profiles, and incident logs.
- **External Integrations**: FortyGuard Heatmap & Microclimate API (`/v1/heatmap`), Google GenAI / Gemini API for intelligent protocol recommendations.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v9 or higher

### Environment Variables

Create a `.env` file in the project root directory based on `.env.example`:

```env
# FortyGuard Thermal API Key
FORTYGUARD_API_KEY=your_fortyguard_api_key_here

# Optional: Google Gemini API Key for AI Agent recommendations
GEMINI_API_KEY=your_gemini_api_key_here

# Server Port Configuration
PORT=3000
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aliyaabbasi05/HeatShield-AI.git
   cd HeatShield-AI
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in Development Mode:
   ```bash
   npm run dev
   ```

4. Build for Production:
   ```bash
   npm run build
   ```

5. Start Production Server:
   ```bash
   npm start
   ```

---

## 📄 License

This project is licensed under the MIT License.
