import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

import '../css/AdminDashboard.css'; 

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div className="admin-container">
            <header className="admin-header">
                <h1>Admin Dashboard</h1>
                <h2>Dobrodošli, {user?.korisnicko_ime ?? 'Administrator'}!</h2>
                <p>Status sesije: <span className="status-active">Aktivan</span></p>
                <p>Uloga na sistemu: <strong style={{ textTransform: 'capitalize' }}>{user?.uloga || 'admin'}</strong></p>
            </header>
            
            <div className="admin-grid">
                {/* ZAMENILI SMO style={cardStyle} sa className="admin-card" */}
                <div className="admin-card">
                    <h3>Predstave</h3>
                    <p>Dodaj nove ili izmeni postojeće predstave.</p>
                    <Link to="/predstave" className="btn-admin">Upravljaj</Link>
                </div>

                <div className="admin-card">
                    <h3>Izvođenja</h3>
                    <p>Kreiraj repertoar i dodeli termine izvođenja.</p>
                    <Link to="/admin/izvodjenja/dodavanje" className="btn-admin">Dodaj termin</Link>
                </div>

                <div className="admin-card">
                    <h3>Rezervacije</h3>
                    <p>Pregledaj sve rezervacije i potvrdi kupovine.</p>
                    <Link to="/admin/rezervacije" className="btn-admin">Pogledaj</Link>
                </div>
            </div>
        </div>
    );
}