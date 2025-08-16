# MLB Boxscores Website

A React-based web application for viewing MLB game data, schedules, and detailed boxscores using the official MLB Stats API.

## Features

- **Game Schedules**: View MLB games for any date
- **Live Scores**: Real-time game scores and line scores
- **Team Information**: Detailed team data and statistics
- **Boxscores**: Complete game boxscores with player statistics
- **Date Validation**: Smart date handling with future date prevention
- **Responsive Design**: Mobile-friendly interface

## Technology Stack

- **React** - Frontend framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **MLB Stats API** - Official MLB data source
- **Custom Hooks** - Reusable data fetching logic

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Available Scripts

### `npm start`
Runs the app in development mode with hot reloading.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production deployment.

## API Integration

The application uses the official MLB Stats API (`https://statsapi.mlb.com/api/v1`) to fetch:
- Game schedules
- Live scores and line scores
- Team information
- Detailed boxscores

## Project Structure

- **Custom Hooks**: Reusable API data fetching logic
- **Date Validation**: Robust date handling and validation
- **Route Configuration**: Centralized routing setup
- **Performance Monitoring**: Web vitals tracking

## Deployment

The application is configured for deployment with the basename `/boxscores` and can be easily deployed to any static hosting service.

## Contributing

This project follows modern React best practices including:
- Custom hooks for data management
- Configuration-driven architecture
- Error handling and loading states
- Clean, maintainable code structure
