# Katabasis Web Frontend

A React-based web frontend for the Katabasis project, featuring pixel art styling and real-time chat functionality.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Katabasis API running locally

### Installation

1. Clone the repository:
```bash
git clone [your-repo-url]
cd katabasis-web
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
```

## Development

### Available Scripts

- `npm run dev` - Start development server

### Project Structure

├── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Page components
│ ├── styles/ # Global styles
│ ├── assets/ # Static assets
│ └── App.tsx # Main application component
├── public/ # Public assets
└── index.html # HTML template