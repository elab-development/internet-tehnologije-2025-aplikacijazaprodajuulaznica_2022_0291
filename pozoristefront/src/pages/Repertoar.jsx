import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/Repertoar.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api";

// POMOĆNE FUNKCIJE VAN KOMPONENTE
const isUserLoggedIn = () => !!localStorage.getItem("token");

const getMe = () => {
    try { return JSON.parse(localStorage.getItem("me") || "null"); } 
    catch { return null; }
};

const formatDateTime = (datumISO, vreme) => {
    if (!datumISO) return { date: "N/A", time: "N/A" };
    const dt = new Date(`${datumISO.slice(0, 10)}T${vreme || "00:00:00"}`);
    if (isNaN(dt.getTime())) return { date: "N/A", time: "N/A" };

    return {
        date: dt.toLocaleDateString("sr-Latn-RS", { day: "2-digit", month: "short", year: "numeric" }),
        time: dt.toLocaleTimeString("sr-Latn-RS", { hour: "2-digit", minute: "2-digit" })
    };
};

export default function Repertoar() {
    const [izvodjenja, setIzvodjenja] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [izvodjenjeToDeleteId, setIzvodjenjeToDeleteId] = useState(null);
    const navigate = useNavigate();

    // 1. DOVLAČENJE PODATAKA
    const fetchIzvodjenja = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/izvodjenja`);
            let data = res.data || [];

            data.sort((a, b) => {
                const d1 = new Date(`${a.datum_izvodjenja.substring(0, 10)}T${a.vreme_pocetka || "00:00:00"}`);
                const d2 = new Date(`${b.datum_izvodjenja.substring(0, 10)}T${b.vreme_pocetka || "00:00:00"}`);
                return d1 - d2;
            });

            setIzvodjenja(data);
        } catch (err) {
            console.error("Greška pri učitavanju:", err);
        } finally {
            setLoading(false);
        }
    };

    // 2. FUNKCIJA ZA BRISANJE
    const handleDelete = async () => {
        if (!izvodjenjeToDeleteId) return;
        try {
            const token = localStorage.getItem("token") || localStorage.getItem("access_token");
            await axios.delete(`${API_BASE}/izvodjenja/${izvodjenjeToDeleteId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            alert("Izvođenje uspešno obrisano!");
            setShowDeleteModal(false);
            fetchIzvodjenja(); // Osveži listu odmah
        } catch (err) {
            console.error("Greška pri brisanju:", err);
            alert("Ne možete obrisati izvođenje koje ima prodate karte.");
        }
    };

    useEffect(() => {
        setIsAdmin(getMe()?.uloga?.toLowerCase() === "admin");
        fetchIzvodjenja();
    }, []);

    if (loading) return <div className="loader-container"><div className="loader"></div></div>;

    return (
        <div className="theater-page">
            <header className="theater-header">
                <h1 className="main-title">Aktuelni Repertoar</h1>
                <div className="title-underline"></div>
                <p className="subtitle">Doživite magiju scene u najprestižnijim izvođenjima sezone.</p>
                
                {isAdmin && (
                    <div className="admin-quick-nav">
                        <button className="btn-admin-add" onClick={() => navigate("/izvodjenje/add")}>
                            Novo Izvođenje
                        </button>
                    </div>
                )}
            </header>

            <main className="cards-container">
                {izvodjenja.map((item) => {
                    const { date, time } = formatDateTime(item.datum_izvodjenja, item.vreme_pocetka);
                    return (
                        <div key={item.id} className="luxury-card">
                            <div className="card-image-wrapper">
                                <img src={item.predstava?.img_url || "https://via.placeholder.com/400x600"} alt={item.predstava?.naziv} />
                                <div className="card-overlay">
                                    <span className="hall-tag">{item.sala?.naziv}</span>
                                </div>
                            </div>
                            
                            <div className="card-info">
                                <div className="date-badge">
                                    <span className="day">{date.split(' ')[0]}</span>
                                    <span className="month">{date.split(' ')[1]}</span>
                                </div>
                                <h2 className="show-title">{item.predstava?.naziv}</h2>
                                <div className="show-meta">
                                    <span><i className="fa-regular fa-clock"></i> {time}h</span>
                                    <span className="show-price">{Number(item.osnovna_cena).toFixed(0)} RSD</span>
                                </div>

                                <div className="card-actions">
                                    {!isAdmin ? (
                                        <button className="btn-buy" onClick={() => isUserLoggedIn() ? navigate(`/kupi-kartu/${item.id}`) : setShowLoginModal(true)}>
                                            Rezerviši Kartu
                                        </button>
                                    ) : (
                                        <div className="admin-edit-group">
                                            <button className="btn-edit" onClick={() => navigate(`/admin/izvodjenja/izmena/${item.id}`)}>
                                                Izmeni
                                            </button>
                                            <button className="btn-del" onClick={() => {
                                                setIzvodjenjeToDeleteId(item.id); 
                                                setShowDeleteModal(true);
                                            }}>
                                                Ukloni
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </main>

            {/* MODAL ZA LOGIN */}
            {showLoginModal && (
                <div className="luxury-modal-overlay" onClick={() => setShowLoginModal(false)}>
                    <div className="luxury-modal" onClick={e => e.stopPropagation()}>
                        <h3>Članstvo</h3>
                        <p>Prijavite se kako biste pristupili online kupovini karata.</p>
                        <button className="btn-buy" onClick={() => navigate("/login")}>Prijava</button>
                    </div>
                </div>
            )}

            {/* MODAL ZA POTVRDU BRISANJA */}
            {showDeleteModal && (
                <div className="luxury-modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="luxury-modal" onClick={e => e.stopPropagation()}>
                        <h3 style={{color: "#e74c3c"}}>Potvrda brisanja</h3>
                        <p>Da li ste sigurni da želite da trajno obrišete ovo izvođenje?</p>
                        <div style={{display: "flex", gap: "10px", marginTop: "20px", justifyContent: "center"}}>
                            <button className="btn-del" onClick={handleDelete}>Obriši</button>
                            <button className="btn-edit" onClick={() => setShowDeleteModal(false)}>Odustani</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}