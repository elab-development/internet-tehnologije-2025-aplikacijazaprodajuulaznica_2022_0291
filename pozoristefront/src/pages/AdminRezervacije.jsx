import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/AdminRezervacije.css';

const API_BASE = 'http://localhost:8000/api';

const AdminRezervacije = () => {
    const navigate = useNavigate();
    const [rezervacije, setRezervacije] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // USKLAĐENO SA SLIKOM IZ BAZE
    const possibleStatuses = ['kreirana', 'potvrdjena', 'otkazana', 'istekla'];

    const getToken = () => localStorage.getItem("token");
    const getMe = () => {
        try { return JSON.parse(localStorage.getItem("me") || "null"); } 
        catch { return null; }
    };

    const isAdmin = () => getMe()?.uloga?.toLowerCase() === 'admin';

    const fetchAllReservations = useCallback(async () => {
        if (!isAdmin()) {
            setError("Pristup zabranjen. Niste administrator.");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            // BITNO: Backend mora da vrati "with('korisnik')" da ne bi pisalo Nepoznato
            const res = await axios.get(`${API_BASE}/rezervacije`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            const data = Array.isArray(res.data) ? res.data : res.data.data || [];
            setRezervacije(data);
        } catch (err) {
            console.error("Greška pri dohvatanju:", err);
            setError("Neuspešno učitavanje. Proveri da li kontroler šalje relaciju 'korisnik'.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllReservations();
    }, [fetchAllReservations]);

    const handleStatusChange = async (rezervacijaId, newStatus) => {
        const token = getToken();
        try {
            // Putanja mora odgovarati tvom Laravelu (npr. /rezervacije/{id}/status)
            await axios.put(`${API_BASE}/rezervacije/${rezervacijaId}/status`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            
            // Odmah ažuriramo lokalni state da korisnik vidi promenu bez reloada
            setRezervacije(prev => prev.map(rez => 
                rez.id === rezervacijaId ? { ...rez, status: newStatus } : rez
            ));
        } catch (err) {
            alert(`Greška: ${err.response?.data?.message || "Nije moguće izmeniti status."}`);
        }
    };

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="theater-page">
            <header className="theater-header">
                <h1 className="main-title">Upravljanje Rezervacijama</h1>
                <div className="title-underline"></div>
                <p className="subtitle">Administratorski uvid u sve kreirane rezervacije karata.</p>
            </header>

            <main className="admin-rez-content">
                <div className="stats-bar">
                    <span>Ukupno u sistemu: <strong>{rezervacije.length}</strong></span>
                </div>

                <div className="table-wrapper">
                    <table className="luxury-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Korisnik (Username)</th>
                                <th>Datum</th>
                                <th>Iznos</th>
                                <th>Metod</th>
                                <th>Trenutni Status</th>
                                <th>Promeni Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rezervacije.map((rez) => (
                                <tr key={rez.id} className={`row-status-${rez.status}`}>
                                    <td>#{rez.id}</td>
                                    <td>
                                        <div className="user-info">
                                            {/* Koristimo korisnicko_ime iz relacije */}
                                            <span className="user-name">
                                                {rez.korisnik ? rez.korisnik.korisnicko_ime : `Korisnik ID: ${rez.korisnik_id}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{new Date(rez.datum_kreiranja || rez.created_at).toLocaleDateString("sr-Latn-RS")}</td>
                                    <td className="price-cell">{Number(rez.ukupna_cena).toFixed(0)} RSD</td>
                                    <td><span className="pay-tag">{rez.nacin_placanja}</span></td>
                                    <td>
                                        <span className={`status-badge ${rez.status}`}>
                                            {rez.status}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={rez.status}
                                            onChange={(e) => handleStatusChange(rez.id, e.target.value)}
                                            className="status-select-pro"
                                        >
                                            {possibleStatuses.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
};

export default AdminRezervacije;