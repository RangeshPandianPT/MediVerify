# MediVerify

MediVerify is a user-first web application that helps consumers and healthcare workers verify the authenticity of packaged medicines using smartphone or webcam photos and a lightweight analysis pipeline. The core idea is to reduce the distribution and consumption of counterfeit medicines by making on-demand verification accessible, simple, and privacy-preserving.

## 🚀 Features

- **React 18** - React version with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **Redux Toolkit** - State management with simplified Redux setup
- **TailwindCSS** - Utility-first CSS framework with extensive customization
- **React Router v6** - Declarative routing for React applications
- **Data Visualization** - Integrated D3.js and Recharts for powerful data visualization
- **Form Management** - React Hook Form for efficient form handling
- **Animation** - Framer Motion for smooth UI animations
- **Testing** - Jest and React Testing Library setup

## 📋 Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

## 🛠️ Installation

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
   
2. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

# MediVerify

A React + Vite application for verifying medicines using camera-based image capture and AI analysis.

This README explains how to set up, run, and debug the project locally — including camera access troubleshooting (the app uses the browser's getUserMedia API).

## Project description

MediVerify is a user-first web application that helps consumers and healthcare workers verify the authenticity of packaged medicines using smartphone or webcam photos and a lightweight analysis pipeline. The core idea is to reduce the distribution and consumption of counterfeit medicines by making on-demand verification accessible, simple, and privacy-preserving.

Key goals:
- Provide a fast, guided capture experience so users can take high-quality photos of medicine labels and packaging.
- Analyze visual features (labels, holograms, logos, text patterns) using a model or remote verification service to estimate authenticity/confidence.
- Present clear, actionable results and guidance: Authentic / Suspicious / Counterfeit with confidence scores and next steps.
- Preserve user privacy: image uploads are optional (users can choose local analysis or anonymized uploads) and any sensitive data is handled with care.

Target users:
- Consumers who want a quick authenticity check before using or buying a medicine.
- Pharmacists and clinic staff who need to triage suspicious shipments or returns.
- NGOs and field workers operating in regions with high counterfeit risk.

Core features:
- Camera-first capture UI with framing guides and tips to improve photo quality.
- Upload-from-gallery fallback for users who already have pictures.
- A compact verification results screen with status indicators, confidence percentage, and recommended actions.
- Basic history and quick-access tiles for recent verifications (optional user profile features).

Privacy & data handling:
- By default, images are processed locally in the browser when possible. If server-side analysis is required, images may be uploaded to an API endpoint — this behavior should be clearly stated in the UI.
- The app aims to avoid storing PII. If accounts or histories are implemented, they should be opt-in and follow standard privacy/security practices.

Typical user flow:
1. User opens the app and navigates to "Verify Medicine".
2. User taps "Start Camera" and follows on-screen framing guides.
3. User captures a photo or selects an image from the gallery.
4. The app runs a local quick-check (or uploads/requests server analysis) and shows a status card with confidence and suggested next steps.
5. If the result is suspicious, the user can view educational material, contact support, or submit additional images for a higher-confidence analysis.


---

## Quick links
- Project root: `index.html`, `src/`, `public/`
- Dev server (Vite) is configured via `vite.config.mjs`
- Static assets: `public/` (includes `favicon.jpg` and `manifest.json`)

---

## Prerequisites
- Node.js 16+ (recommended)
- npm (or yarn)

---

## Install
1. Install dependencies:

```powershell
npm install
```

---

## Available scripts
- `npm run dev` — start the Vite dev server (development)
- `npm start` — alias for the dev server (configured to run `vite`)
- `npm run build` — build for production (`vite build`)
- `npm run serve` — preview production build (`vite preview`)

If a port is already in use, start dev on a different port:

```powershell
npm run dev -- --port 5173
```

---

## How to run the app locally
1. Start the dev server:

```powershell
npm run dev
```

2. Open the URL printed by Vite (usually `http://localhost:5173` or the configured port).

3. Use the UI's "Start Camera" button to request camera permissions. The app uses the browser's MediaDevices API and will show a permission prompt.

---

## Camera troubleshooting
The medicine verification UI depends on camera access. If the camera does not open or the preview stays blank, try the following in order:

1. Confirm the dev server URL is `localhost` (browsers treat `localhost` as a secure context). If you're using an IP or custom hostname, make sure it's HTTPS or a secure context.

2. Close other apps that might be using the webcam (Zoom, Teams, Skype, native Camera app).

3. Check browser site permissions:
  - Click the lock icon in the address bar → Site settings → Camera → Allow.
  - Or open browser settings → Privacy & security → Site settings → Camera.

4. Windows settings: Settings → Privacy & security → Camera → Ensure the browser is allowed to use the camera.

5. If you see `NotReadableError` / "Could not start video source": the camera is likely busy or hardware driver issue. Close other apps, unplug/replug the camera, and retry.

6. If you see `NotAllowedError` / permission denied: explicitly allow camera in the prompt or site settings.

7. Device enumeration: Open the browser console and run:

```js
navigator.mediaDevices.enumerateDevices().then(devs => console.log(devs.filter(d => d.kind === 'videoinput')))
```

## Files of interest
- `src/pages/medicine-verification/components/CameraInterface.jsx` — camera capture UI and getUserMedia logic.
- `src/components/ui/CameraNavigationOverlay.jsx` — overlay controls for capture/flash/cancel.
- `vite.config.mjs` — Vite configuration (port, plugins).
- `public/manifest.json` and `public/favicon.jpg` — PWA manifest and favicons.

---

How to embed in a page or slide component:

```jsx
import CrisisScaleChart from 'components/ui/CrisisScaleChart';
import CounterfeitCategoriesChart from 'components/ui/CounterfeitCategoriesChart';

export default function Presentation() {
   return (
      <div className="space-y-6">
         <CrisisScaleChart />
         <CounterfeitCategoriesChart />
      </div>
   );
}
```

## Notes for developers
- The project already includes a helper to prefer `deviceId` when selecting the rear camera. If you need a manual device picker, consider adding a small UI that lists `navigator.mediaDevices.enumerateDevices()` results and allows selecting the `deviceId`.

- When testing on mobile devices, use `localhost` forwarded via a tunnel (ngrok) or deploy to a secure domain — mobile browsers require secure contexts for camera access.

---

## Contributing
Open a PR against the `main` branch with descriptive commits. Run `npm test` (if tests exist) and ensure linting/formatting rules are followed.

---

## Authors
- Team Heisenbug Hunters
- RangeshPandian PT
- Aanish Nithin
- Nishanth Kanna 
- Aakash J


---




