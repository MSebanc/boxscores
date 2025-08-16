import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/mainpage';

const ROUTER_CONFIG = {
    basename: '/boxscores',
    routes: [
        { path: '/:date', component: MainPage },
        { path: '/', component: MainPage }
    ]
};

const createRoute = (route, index) => (
    <Route
        key={index}
        path={route.path}
        element={<route.component />}
    />
);

const renderRoutes = (routes) => routes.map(createRoute);

function App() {
    return (
        <Router basename={ROUTER_CONFIG.basename}>
            <Routes>
                {renderRoutes(ROUTER_CONFIG.routes)}
            </Routes>
        </Router>
    );
}

export default App;