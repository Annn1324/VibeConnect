import './App.css'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Home from './pages/Home/Home'
import Profile from './pages/Profile/Profile'
import Messages from './pages/Messages/Messages'
import RequireAuth from './routes/RequireAuth'
import RedirectIfAuthenticated from './routes/RedirectIfAuthenticated'



function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route element={<RedirectIfAuthenticated />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>
                <Route element={<RequireAuth />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/messages" element={<Messages />} />
                    {/* Trang cá nhân cũng cần đăng nhập nên đặt trong RequireAuth. */}
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default App
