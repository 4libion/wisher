import { GoogleOAuthProvider } from '@react-oauth/google';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import WishlistDetail from './pages/WishlistDetail';
import PublicWishlistDetail from './pages/PublicWishlistDetail';
import ProtectedRoute from './components/ProtectedRoute';
import { UserProvider } from './auth/UserContext';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
    return (
        <GoogleOAuthProvider clientId={googleClientId}>
            <Router>
                <UserProvider>
                    <Routes>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/wishlist/:id"
                            element={
                                <ProtectedRoute>
                                    <WishlistDetail />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/wishlist/public/:slug" element={<PublicWishlistDetail />}/>
                    </Routes>
                </UserProvider>
            </Router>
        </GoogleOAuthProvider>
    );
}

export default App;
