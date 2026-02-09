import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AdminRoute({ children }) {
    const { user } = useAuth();

    // ako user još nije ucitan (npr. refresh)
    if (!user) {
        return <Navigate to="/" replace />;
    }

    // ako user postoji ali NIJE admin
    if (user.uloga?.toLowerCase() !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // ako je admin pusti
    return children;
}
