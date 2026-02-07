import React, { useState } from 'react';
import '../css/Kontakt.css'; 

export const Kontakt = () => {
    const [status, setStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        
        setStatus('Vaša poruka je uspešno poslata!');

        e.target.reset();

        setTimeout(() => {
            setStatus('');
        }, 3000);
    };

    return (
        <div className="contact-page-wrapper">
            <div className="contact-hero-mini">
                <h1>Kontaktirajte nas</h1>
                <p>Tu smo za sva vaša pitanja.</p>
            </div>

            <div className="contact-main-content">
                <div className="contact-card">
                    <form onSubmit={handleSubmit} className="contact-form">
                        <div className="input-group">
                            <label>Ime i prezime</label>
                            <input type="text" placeholder="Unesite vaše ime i prezime" required />
                        </div>
                        
                        <div className="input-group">
                            <label>Email adresa</label>
                            <input type="email" placeholder="primer@gmail.com" required />
                        </div>

                        <div className="input-group">
                            <label>Vaša poruka</label>
                            <textarea placeholder="Kako vam možemo pomoći?" required></textarea>
                        </div>

                        <button type="submit" className="submit-btn">Pošalji poruku</button>
                    </form>
                    {status && <div className="success-banner">{status}</div>}
                </div>
            </div>
        </div>
    );
};

export default Kontakt;