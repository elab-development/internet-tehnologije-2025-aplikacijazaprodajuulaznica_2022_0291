import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../css/Korpa.css'; 

const Korpa = ({ cart, removeFromCart, setCart }) => {
    const navigate = useNavigate();
    
    // State za istoriju rezervacija iz baze
    const [rezervacijeIzBaze, setRezervacijeIzBaze] = useState([]);
    const [loadingRezervacije, setLoadingRezervacije] = useState(false);
    const [errorRezervacije, setErrorRezervacije] = useState(null);

    const userData = localStorage.getItem('me');
    const ulogovaniKorisnik = userData ? JSON.parse(userData) : null;
    const token = localStorage.getItem('token');

    // Funkcija za dohvatanje rezervacija ulogovanog korisnika
    const fetchMojeRezervacije = async () => {
        if (!ulogovaniKorisnik || !token) return;
        
        setLoadingRezervacije(true);
        setErrorRezervacije(null);
        try {
            // Koristimo novu, namensku rutu za klijenta
            const res = await axios.get('http://localhost:8000/api/moje-rezervacije', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRezervacijeIzBaze(res.data);
        } catch (err) {
            console.error("Greška pri dohvatanju:", err);
            setErrorRezervacije("Trenutno nije moguće učitati istoriju rezervacija.");
        } finally {
            setLoadingRezervacije(false);
        }
    };

    // Učitaj istoriju čim se komponenta pokrene
    useEffect(() => {
        fetchMojeRezervacije();
    }, []);

    // Računanje ukupne cene trenutne korpe
    const ukupnaCena = cart.reduce((sum, item) => sum + (Number(item.cena) || 0), 0);

    const handleCheckout = async () => {
        if (!ulogovaniKorisnik) {
            alert("Moraš biti ulogovana!");
            return navigate('/login');
        }

        if (cart.length === 0) return;

        const payload = {
            korisnik_id: ulogovaniKorisnik.id, 
            nacin_placanja: 'kartica', 
            karte: cart.map(item => item.id) 
        };

        try {
            await axios.post('http://localhost:8000/api/rezervacije', payload, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Uspešna rezervacija! Tvoje karte su spremne.");
            setCart([]); 
            // Osvežavamo listu ispod da se pojavi nova rezervacija
            fetchMojeRezervacije(); 
        } catch (err) {
            alert("Greška: " + (err.response?.data?.poruka || "Problem sa serverom"));
        }
    };

    return (
        <div className="korpa-container">
            {/* SEKCIJA 1: AKTIVNA KORPA (LOKALNA) */}
            <div className="cart-section">
                <h2 className="section-title">Vaša korpa</h2>
                
                {cart.length === 0 ? (
                    <div className="empty-message">
                        <p>Vaša korpa je trenutno prazna. Izaberite predstave sa repertoara.</p>
                        <button className="btn-checkout" onClick={() => navigate('/repertoar')} style={{marginTop: '15px'}}>
                            Nazad na repertoar
                        </button>
                    </div>
                ) : (
                    <>
                        <ul className="cart-list">
                            {cart.map(item => (
                                <li key={item.id} className="cart-item">
                                    <div className="item-info">
                                        <div className="item-name">{item.naziv}</div>
                                        <div className="item-details">Sedište: <strong>{item.sediste}</strong></div>
                                    </div>
                                    <div className="item-actions">
                                        <span className="item-price">{Number(item.cena).toFixed(0)} RSD</span>
                                        <button className="btn-remove" onClick={() => removeFromCart(item.id)}>Ukloni</button>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="cart-summary">
                            <p>Ukupno za uplatu:</p>
                            <span className="total-amount">{ukupnaCena.toFixed(0)} RSD</span>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            <button className="btn-checkout" onClick={handleCheckout}>
                                Potvrdi i plati
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="divider-gold"></div>

            {/* SEKCIJA 2: ISTORIJA IZ BAZE */}
            <div className="reservations-section">
                <h2 className="section-title">Moje prethodne rezervacije</h2>
                
                {loadingRezervacije && <p className="loading-text">Učitavanje istorije...</p>}
                {errorRezervacije && <p className="error-message">{errorRezervacije}</p>}

                {!loadingRezervacije && !errorRezervacije && (
                    rezervacijeIzBaze.length === 0 ? (
                        <p className="empty-message">Nemate istoriju rezervacija u sistemu.</p>
                    ) : (
                        <div className="reservation-list">
                            {rezervacijeIzBaze.map(rezervacija => (
                                <div key={rezervacija.id} className="reservation-card">
                                    <div className="res-card-header">
                                        <span className="res-id">Rezervacija #{rezervacija.id}</span>
                                        <span className="res-date">{new Date(rezervacija.created_at).toLocaleDateString('sr-RS')}</span>
                                    </div>
                                    
                                <div className="res-items-detail">
                                    {/* Prolazimo kroz stavke i ispisujemo naziv predstave i tačan broj sedišta */}
                                    {rezervacija.stavke && rezervacija.stavke.map(stavka => (
                                        <div key={stavka.id} className="res-mini-item">
                                            • {stavka.karta?.izvodjenje?.predstava?.naziv || "Predstava"} 
                                            <span style={{ marginLeft: '5px' }}>
                                                (Sedište: <strong>{stavka.karta?.broj_sedista || "N/A"}</strong>)
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                    <div className="res-card-footer">
                                        <div className="res-status-box">
                                            Status: <strong className={`status-text ${rezervacija.status}`}>{rezervacija.status.toUpperCase()}</strong>
                                        </div>
                                        <div className="res-price-total">
                                            Ukupno: <strong>{Number(rezervacija.ukupna_cena).toFixed(0)} RSD</strong>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Korpa;