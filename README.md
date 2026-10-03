# CardioFuse 3D — Multimodal Cardiovascular Decision Support

An interactive, 3D multimodal dashboard for coronary artery disease prediction and anatomical localization. CardioFuse 3D integrates clinical tabular data, 12-lead ECG waveforms, and medical text narratives into a unified cross-attention fusion model with real-time 3D heart and coronary vessel visualization.

---

## 🌟 Key Features

- **3D Coronary Artery Visualization**: Interactive 3D heart model with selectable LAD, LCX, and RCA coronary vessels powered by Three.js and `@react-three/fiber`.
- **Multimodal AI Fusion**: Dynamic weighting and probability recalculation across Clinical, ECG, and Text modalities with masking support.
- **Explainability & Attribution**: Feature impact breakdown and BioClinicalBERT narrative token attribution.
- **Synthetic Patient Cohort**: Realistic clinical demo scenarios with ECG waveform data.
- **Modern Medical Dashboard**: High-density glassmorphism UI built with Tailwind CSS, Lucide icons, and Recharts.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **3D Graphics**: Three.js, `@react-three/fiber`, `@react-three/drei`
- **State Management**: Zustand
- **Styling**: Tailwind CSS, CSS Glassmorphism
- **Charts**: Recharts
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

### Production Build & Preview

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📄 License

MIT License. Designed for clinical demonstration and educational purposes.
