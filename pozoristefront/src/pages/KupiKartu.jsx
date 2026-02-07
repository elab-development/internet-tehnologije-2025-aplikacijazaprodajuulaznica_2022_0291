import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../css/KupiKartu.css'; 

const KupiKartu = ({ addToCart }) => {
    const { idIzvodjenja } = useParams();
    const navigate = useNavigate();
    const [karte, setKarte] = useState([]);
    const [izvodjenje, setIzvodjenje] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const podaci = async () => {
            try {
                // 1. Dohvatamo karte
                const res = await axios.get(`http://localhost:8000/api/izvodjenja/${idIzvodjenja}/karte`);
                setKarte(res.data);
                
                // 2. Dohvatamo info o izvođenju
                const resIzv = await axios.get(`http://localhost:8000/api/izvodjenja/${idIzvodjenja}`);
                setIzvodjenje(resIzv.data);
            } catch (e) {
                console.error("Greška pri učitavanju podataka:", e);
            } finally {
                setLoading(false);
            }
        };
        podaci();
    }, [idIzvodjenja]);

    // Grupišemo karte u redove (npr. po 5 sedišta po redu)
    const grupisaneKarte = [];
    const brojSedistaURedu = 5;
    for (let i = 0; i < karte.length; i += brojSedistaURedu) {
        grupisaneKarte.push(karte.slice(i, i + brojSedistaURedu));
    }

    const handleKupovina = (karta) => {
        addToCart({
            id: karta.id,
            sediste: karta.broj_sedista || `Sedište ${karta.id}`,
            naziv: izvodjenje?.predstava?.naziv || "Predstava",
            cena: karta.cena || izvodjenje?.osnovna_cena
        });
        alert(`Sedište ${karta.broj_sedista || karta.id} je dodato u korpu!`);
    };

    if (loading) return <div className="loading-screen">Učitavanje sale...</div>;

    return (
        <div className="kupi-kartu-container">
            <header className="page-header">
                <h1>Izbor sedišta</h1>
                {izvodjenje && (
                    <div className="izvodjenje-info-card">
                        <h3>{izvodjenje.predstava?.naziv}</h3>
                        <p>
                            <span>Sala: {izvodjenje.sala?.naziv}</span>
                            <span className="price-tag">{izvodjenje.osnovna_cena} RSD</span>
                        </p>
                    </div>
                )}
            </header>

            <div className="seat-selection-block">
                {/* Vizuelni prikaz bine */}
                <div className="stage-container">
                    <div className="stage-label">SCENA / BINA</div>
                </div>
                
                <div className="seat-layout-grid">
                    {grupisaneKarte.map((red, index) => (
                        <div key={index} className="seat-row">
                            {/* Oznaka reda (A, B, C...) */}
                            <div className="row-label">{String.fromCharCode(65 + index)}</div>
                            
                            <div className="seat-grid-inner">
                                {red.map(karta => {
                                    // KLJUČNO: Gledamo kolonu 'prodata' iz tvoje baze
                                    const isAvailable = Number(karta.prodata) === 0;
                                    const seatClass = isAvailable ? 'available' : 'sold';

                                    return (
                                        <button 
                                            key={karta.id}
                                            className={`seat-btn ${seatClass}`}
                                            disabled={!isAvailable}
                                            onClick={() => handleKupovina(karta)}
                                            title={isAvailable ? `Slobodno: ${karta.cena} RSD` : "Zauzeto"}
                                        >
                                            {karta.broj_sedista}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="legenda-container">
                    <div className="legenda-item">
                        <span className="dot available-dot"></span> Slobodno
                    </div>
                    <div className="legenda-item">
                        <span className="dot sold-dot"></span> Zauzeto
                    </div>
                </div>
            </div>

            <div className="action-footer">
                <button className="btn-secondary" onClick={() => navigate(-1)}>← Nazad</button>
                <button className="btn-buy" onClick={() => navigate('/korpa')}>
                    Idi na plaćanje (Korpa) →
                </button>
            </div>
        </div>
    );
};

export default KupiKartu;