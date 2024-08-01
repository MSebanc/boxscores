import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './components/mainpage';

function App() {
    return (
        <Router basename="/boxscores">
            <Routes>
                <Route path="/:date" element={<MainPage />}/>
                <Route path="/" element={<MainPage />}/>
            </Routes>
        </Router>
    );
}

export default App;