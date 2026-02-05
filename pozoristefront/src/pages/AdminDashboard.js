import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ borderBottom: '2px solid #eee', marginBottom: '30px', paddingBottom: '20px' }}>
                <h1>Admin Dashboard</h1>
                <h2>Dobrodošli, {user?.korisnicko_ime ?? 'Administrator'}!</h2>
                <p>Status sesije: <span style={{ color: 'green', fontWeight: 'bold' }}>Aktivan</span></p>
                <p>Uloga na sistemu: <strong style={{ textTransform: 'capitalize' }}>{user?.uloga}</strong></p>
            </header>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div style={cardStyle}>
                    <h3>Predstave</h3>
                    <p>Dodaj nove ili izmeni postojeće predstave.</p>
                    <Link to="/predstave" className="btn-admin">Upravljaj</Link>
                </div>

                <div style={cardStyle}>
                    <h3>Izvođenja</h3>
                    <p>Kreiraj repertoar i dodeli termine izvođenja.</p>
                    <Link to="/izvodjenja" className="btn-admin">Dodaj termin</Link>
                </div>

                <div style={cardStyle}>
                    <h3>Rezervacije</h3>
                    <p>Pregledaj sve rezervacije i potvrdi kupovine.</p>
                    <Link to="/admin/rezervacije" className="btn-admin">Pogledaj</Link>
                </div>
            </div>
        </div>
    );
}

// Mali inline stil za kartice dok ne sredimo CSS
const cardStyle = {
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
};