import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const APP_CONFIG = {
    rootElementId: 'root',
    strictMode: true,
    performanceLogging: false
};

const createRootElement = (elementId) =>
    ReactDOM.createRoot(document.getElementById(elementId));

const renderApp = (root, Component, enableStrictMode = true) => {
    const AppElement = enableStrictMode ? (
        <React.StrictMode>
            <Component />
        </React.StrictMode>
    ) : (
        <Component />
    );

    root.render(AppElement);
};

const initializePerformanceLogging = (shouldLog = false) => {
    if (shouldLog) {
        reportWebVitals(console.log);
    } else {
        reportWebVitals();
    }
};

const initializeApp = () => {
    const root = createRootElement(APP_CONFIG.rootElementId);
    renderApp(root, App, APP_CONFIG.strictMode);
    initializePerformanceLogging(APP_CONFIG.performanceLogging);
};

initializeApp();