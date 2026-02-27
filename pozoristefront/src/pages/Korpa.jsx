import React, { useState, useEffect } from 'react';
import http from '../api/http';
import { useNavigate } from 'react-router-dom';
import '../css/Korpa.css'; 

const Korpa = ({ cart, removeFromCart, setCart }) => {
    const navigate = useNavigate();
    
    // 1. OBAVEZNO DODATI: State za sprečavanje duplog klika
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [rezervacijeIzBaze, setRezervacijeIzBaze] = useState([]);
    const [loadingRezervacije, setLoadingRezervacije] = useState(false);
    const [errorRezervacije, setErrorRezervacije] = useState(null);
    const [kurs, setKurs] = useState(null);

    const userData = localStorage.getItem('me');
    const ulogovaniKorisnik = userData ? JSON.parse(userData) : null;
    const token = localStorage.getItem('token');

    const fetchMojeRezervacije = async () => {
        if (!ulogovaniKorisnik || !token) return;
        setLoadingRezervacije(true);
        setErrorRezervacije(null);
        try {
            const res = await http.get('/moje-rezervacije');
            setRezervacijeIzBaze(res.data || []);
        } catch (err) {
            console.error("Greška pri dohvatanju:", err);
            setErrorRezervacije("Trenutno nije moguće učitati istoriju rezervacija.");
        } finally {
            setLoadingRezervacije(false);
        }
    };

    useEffect(() => {
        fetchMojeRezervacije();
    }, []);

    useEffect(() => {
        fetch('https://open.er-api.com/v6/latest/RSD')
            .then(res => res.json())
            .then(data => {
                setKurs(data.rates.EUR);
            })
            .catch(err => console.error("Greška pri učitavanju kursa:", err));
    }, []);

    const ukupnaCena = cart.reduce((sum, item) => sum + (Number(item.cena) || 0), 0);

    const handleCheckout = async () => {
        // Sprečavamo višestruke zahteve
        if (isProcessing) return;

        if (!ulogovaniKorisnik) {
            alert("Moraš biti ulogovana!");
            navigate('/login');
            return;
        }

        if (cart.length === 0) return;

        // Zaključavamo dugme
        setIsProcessing(true);

        const payload = {
            korisnik_id: ulogovaniKorisnik.id, 
            nacin_placanja: 'kartica', 
            karte: cart.map(item => item.id) 
        };

        try {
            await http.post('/rezervacije', payload);
            alert("Uspešna rezervacija! Tvoje karte su spremne.");
            
            // Čišćenje korpe
            setCart([]); 
            localStorage.removeItem('teatar_korpa'); // Brišemo podatke iz browsera
            
            fetchMojeRezervacije(); 
        } catch (err) {
            alert("Greška: " + (err.response?.data?.poruka || "Problem sa serverom"));
        } finally {
            // Otključavamo dugme na kraju
            setIsProcessing(false);
        }
    };

    return (
        <div className="korpa-container">
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
                            <div style={{ textAlign: 'right' }}>
                                <span className="total-amount">{ukupnaCena.toFixed(0)} RSD</span>
                                {kurs && (
                                    <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '5px', fontStyle: 'italic' }}>
                                        (informativno: {(ukupnaCena * kurs).toFixed(2)} EUR)
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ textAlign: 'right', marginTop: '20px' }}>
                            {/* Dodajemo disabled i promenu teksta na dugmetu */}
                            <button 
                                className="btn-checkout" 
                                onClick={handleCheckout} 
                                disabled={isProcessing}
                            >
                                {isProcessing ? "Obrađujem..." : "Potvrdi i plati"}
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="divider-gold"></div>

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