import React, { useState } from 'react';
import Mapa from '../components/Mapa'; 
import '../css/Kontakt.css'; 

export const Kontakt = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus('Vaša poruka je uspešno poslata!');
        e.target.reset();
        setTimeout(() => setStatus(''), 3000);
    };

    return (
        <div className="final-page-container">
            <div className="final-hero-section">
                <h1>Kontaktirajte nas</h1>
                <p>Tu smo za sva vaša pitanja.</p>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-11 col-xl-10">
                        {/* d-flex i gap-5 prave razmak */}
                        <div className="final-flex-layout">
                            
                            {/* LEVA STRANA: FORMA */}
                            <div className="final-card-box">
                                <h3 className="final-title">Pošaljite nam poruku</h3>
                                <form onSubmit={handleSubmit} className="final-form">
                                    <div className="final-input-group">
                                        <label>Ime i prezime</label>
                                        <input type="text" placeholder="Unesite vaše ime i prezime" required />
                                    </div>
                                    <div className="final-input-group">
                                        <label>Email adresa</label>
                                        <input type="email" placeholder="primer@gmail.com" required />
                                    </div>
                                    <div className="final-input-group">
                                        <label>Vaša poruka</label>
                                        <textarea placeholder="Kako vam možemo pomoći?" rows="5" required></textarea>
                                    </div>
                                    <button type="submit" className="final-submit-btn">POŠALJI PORUKU</button>
                                </form>
                                {status && <div className="alert alert-success mt-3">{status}</div>}
                            </div>

                            {/* DESNA STRANA: MAPA */}
                            <div className="final-card-box">
                                <h3 className="final-title">Gde se nalazimo</h3>
                                <div className="final-map-container">
                                    <Mapa />
                                </div>
                                <div className="final-info-list">
                                <p><i className="bi bi-geo-alt-fill"></i> <strong>Adresa:</strong> Bulevar umetnosti 10, Novi Beograd</p>
                                <p><i className="bi bi-clock-fill"></i> <strong>Radno vreme:</strong> 10:00 - 20:00</p>
                                <p><i className="bi bi-telephone-fill"></i> <strong>Telefon:</strong> +381 21 555 333</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Kontakt;