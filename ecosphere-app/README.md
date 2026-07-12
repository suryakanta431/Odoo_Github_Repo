# EcoSphere

EcoSphere is an ESG (Environmental, Social, and Governance) management platform built as a futuristic dashboard for organizations to monitor sustainability performance, manage compliance, and drive employee engagement through gamified participation.

## Project Purpose

EcoSphere brings together three core goals:

- Unify data from operations, compliance, and employee activity into one centralized experience.
- Automate ESG tracking with live score calculation, compliance visibility, and workflow automation.
- Drive engagement through XP, badges, rewards, and challenge-based participation.

## Key Features

### 1. Dynamic ESG Dashboard
- Live ESG score calculation from department metrics.
- Visual indicators for environmental, social, and governance performance.
- Real-time dashboard cards for overall health and progress.

### 2. Governance and Compliance Tracking
- Compliance watchlist for active issues.
- Open, overdue, and resolved status management.
- Clear ownership and due-date visibility for each issue.

### 3. Challenge and Approval Workflow
- Submit sustainability or compliance tasks for manager review.
- Required evidence upload flow for approval.
- Approval simulation with XP reward feedback.

### 4. Gamified Engagement
- XP-based progression.
- Badge unlocks for achievements.
- Reward marketplace where users can redeem points for meaningful rewards.

### 5. Interactive 3D Ecosystem Monitor
- 3D scene powered by React Three Fiber.
- Zoom and orbit interactions for an immersive monitoring experience.
- Fallback island scene for robust loading behavior.

Note: The 3D monitor canvas has been enlarged and the island model scaled up to better fill available layout space on wide screens. Camera and fog settings were adjusted for a fuller, more immersive view. See `src/components/ESGScene.jsx` for implementation details.

### 6. Reporting and Export
- Export dashboard snapshots as CSV for sharing and review.
- Persisted local state for scores, workflow progress, and criteria settings.
- Interactive judging criteria panel for evaluation workflows.

## Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- JavaScript/JSX

### 3D & Visualization
- React Three Fiber
- Drei
- Three.js

### Animation & UI Enhancements
- GSAP

### State & Logic
- React Context API
- Local storage persistence

### Tooling & Quality
- ESLint
- Vitest
- npm

## Project Structure

```text
src/
  App.jsx                  # Main dashboard layout and UI flows
  components/
    CriteriaPanel.jsx      # Interactive judging criteria editor
    ESGScene.jsx           # 3D ecosystem monitor
    NotificationGuide.jsx  # Notification animations and feedback
  context/
    ESGContext.jsx         # Context provider and business logic
    ESGContextValue.js     # Context object definition
    esgLogic.js            # Shared ESG logic and validation helpers
    esgLogic.test.js       # Unit tests for core logic
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run tests:
   ```bash
   npm test
   ```

## Notes

EcoSphere is designed as a polished product-style prototype for showcasing how ESG management can be made more operational, measurable, and engaging across teams.
