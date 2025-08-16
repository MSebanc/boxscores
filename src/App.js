import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/mainpage';

const ROUTER_CONFIG = {
    basename: '/boxscores',
    routes: [
        { path: '/:date', component: MainPage },
        { path: '/', component: MainPage }
    ]
};

function App() {
    return (
        <Router basename={ROUTER_CONFIG.basename}>
            <Routes>
                <Route path="/:date" element={<MainPage />} />
                <Route path="/" element={<MainPage />} />
            </Routes>
        </Router>
    );
}

export default App;