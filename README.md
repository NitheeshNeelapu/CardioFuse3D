# CardioFuse 3D — Multimodal Cardiovascular Decision Support

An interactive, 3D multimodal research prototype for coronary vascular evidence visualization and anatomical localization. CardioFuse 3D operates as a **weighted multimodal scorer (clinical + ECG + text + ECG photo) with a tool-using LLM agent for explanation, translation and extraction. The LLM never computes risk.**

> **RESEARCH PROTOTYPE DISCLAIMER**: CardioFuse 3D is an investigational software prototype using demonstration scoring. It is NOT a medical diagnostic device, does NOT predict actual coronary artery disease, and must NOT be used for clinical triage or patient management.

---

## 🌟 Key Features

- **3D Coronary Artery Visualization**: Interactive 3D heart with selectable LAD, LCX, and RCA coronary vessels powered by Three.js and `@react-three/fiber`.
- **Transparent Multimodal Scorer**: Deterministic, weighted rule-based scorer across Clinical, ECG, and Text modalities. Outputs relative demonstration scores (0–100 scale) and normalized shares summing to 100%. The LLM never calculates or modifies risk scores.
- **AHA 17-Segment Polar Bullseye**: Standard left-ventricular myocardial segment diagram mapped to coronary supply territories with live score opacity and click-to-focus synchronization.
- **12-Lead ECG Grid & Territory Highlighting**: Interactive 12-lead ECG viewer with electrophysiological waveform synthesis and territory highlights matching the target vessel (LAD: V1–V4, LCX: I/aVL/V5/V6, RCA: II/III/aVF).
- **What-If Exploration Sliders**: Real-time sliders for age, systolic BP, BMI, and resting HR with instant debounced recalculation and vessel delta chips ($\Delta$ pts vs baseline).
- **Evidence Conflict Detector**: Automatically analyzes active modalities in isolation to detect whether evidence sources agree or discordantly favor different coronary territories.
- **Tool-Using Missing-Evidence Agent**: Step-by-step agent workflow that inspects active evidence, ranks uncollected modalities by expected diagnostic yield, and consults clinical guideline criteria.
- **Multilingual Patient Explanations & Voice**: Explains findings directly to patients in English, हिन्दी (Hindi), and తెలుగు (Telugu) at a 6th-grade reading level, with integrated speech synthesis and Web Speech voice dictation.
- **Assistive Paper ECG Photo Extraction**: Ingests paper ECG tracing photos, downscales locally, extracts printed metrics via Gemini, and presents a manual confirmation form before applying values to analysis.

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env.local` to configure optional Gemini features:

```env
# Gemini API Key (Required for LLM features: Agent explanation, patient summary, translation, ECG photo extraction)
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Model name (Defaults to gemini-1.5-flash)
LLM_MODEL=gemini-1.5-flash
```

*Note: All LLM features include complete deterministic fallbacks. If no API key is provided, the dashboard remains 100% operational with pre-written templates.*

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management**: Zustand
- **Serverless Backend**: `@vercel/node` API proxy (`/api/llm`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/NitheeshNeelapu/CardioFuse3D.git

# Navigate into the project
cd CardioFuse3D

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

---

## 📄 License

MIT License. Designed for research demonstration and educational purposes.
