import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SingUp from './pages/SingUp';
import Profile from './pages/Profile';
import About from './pages/About';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/sing-in' element={<SignIn />} />
                <Route path='/sing-up' element={<SingUp />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/about' element={<About />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
