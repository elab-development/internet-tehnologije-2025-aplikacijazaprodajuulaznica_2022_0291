import React from 'react';
import '../css/Pocetna.css'; 
import { useNavigate } from 'react-router-dom';

export const Pocetna = () => {
    const navigate = useNavigate();

    const handleKupiUlazniceClick = () => {
        navigate('/repertoar');
    };

    return (
        <div className="home-page-container">
           
            {/* 1. HERO SEKCIJA */}
            <section className="hero">
                <div className="container hero-grid">
                   
                    <div className="hero-copy">
                        <h1 className="hero-title">Nezaboravno iskustvo! 🎭</h1>
                        <p className="hero-subtitle">
                            Pronađite i rezervišite karte za najbolje dramske predstave, komedije i balet na sceni Teatra Maska!
                        </p>
                       
                        <div className="home-cta-buttons">
                           
                            {/* 1. Glavno dugme - KUPITE ULAZNICE */}
                            <button
                                className="btn primary large-cta"
                                onClick={handleKupiUlazniceClick} // <-- POZIVAM FUNKCIJU
                            >
                                Kupi Ulaznice
                            </button>
                           
                            {/* 2. Sekundarno dugme - USLOVI KORIŠĆENJA */}
                            <a
                                href="/Uslovi_Koriscenja.pdf" 
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn secondary large-cta"
                            >
                                Uslovi Korišćenja
                            </a>
                        </div>
                        {/* =================================================== */}

                        <div className="hero-stats">
                            <div className="stat-item">
                                <strong><i className="bi bi-ticket-fill"></i> 100+</strong>
                                <span>Karata u prodaji dnevno</span>
                            </div>
                            <div className="stat-item">
                                <strong><i className="bi bi-stars"></i> TOP 5</strong>
                                <span>Najpopularnijih predstava</span>
                            </div>
                            <div className="stat-item">
                                <strong><i className="bi bi-shield-lock"></i> 100%</strong>
                                <span>Sigurna kupovina</span>
                            </div>
                        </div>
                    </div>

                    <div className="hero-art">
                        <div className="youtube-container">
                            <iframe
                                className="youtube-embed"
                                src="https://www.youtube.com/embed/UYaIQNjAX_8?autoplay=1&mute=1&controls=1&start=5&rel=0&showinfo=0&modestbranding=1"
                                title="Video najava predstave"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
           
            {/* 2. SEKCIJA: ISTAKNUTE PREDSTAVE (Scrollable) */}
            <section className="featured-shows">
                <div className="container">
                    <h2 className="section-title">Popularni naslovi</h2>
                    <p className="section-subtitle">Predstave koje se ne smeju propustiti.</p>
                   
                    <div className="shows-list">
                        <div className="show-card">
                            <img src="/slike/labudovo_jezero.jpg" alt="Predstava A" />
                            <h4>Labudovo jezero</h4>
                            <p>Balet</p>
                        </div>
                        <div className="show-card">
                            <img src="/slike/krcko_orascic.jpg" alt="Predstava B" />
                            <h4>Krcko Oraščić</h4>
                            <p>Balet</p>
                        </div>
                        <div className="show-card">
                            <img src="/slike/mamma_mia.jpg" alt="Predstava C" />
                            <h4>Mamma Mia!</h4>
                            <p>Mjuzikl</p>
                        </div>
                        <div className="show-card">
                            <img src="/slike/cigani.jpg" alt="Predstava D" />
                            <h4>Cigani lete u nebo</h4>
                            <p>Mjuzikl</p>
                        </div>
                        <div className="show-card">
                            <img src="/slike/little-prince.jpg" alt="Predstava E" />
                            <h4>Mali princ</h4>
                            <p>Mjuzikl</p>
                        </div>
                        <div className="show-card">
                            <img src="/slike/fantom.jpg" alt="Predstava F" />
                            <h4>Fantom iz opere</h4>
                            <p>Mjuzikl</p>
                        </div>
                    </div>

                    <div className="center-link">
                         {/* Dugme "Pogledajte repertoar" takodje vodi na /repertoar */}
                         <button className="btn btn-primary" onClick={handleKupiUlazniceClick}> 
                            Pogledajte aktuelni repertoar <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* 3. SEKCIJA: ZAŠTO ODABRATI NAS */}
            <section className="trust-section">
                <div className="container trust-grid">
                    <div className="trust-item">
                        <i className="bi bi-star-fill"></i>
                        <h3>Pozorišna izuzetnost</h3>
                        <p>Preko 1000 izvedbi i brojne nagrade za naše predstave.</p>
                    </div>
                    <div className="trust-item">
                        <i className="bi bi-credit-card-fill"></i>
                        <h3>Bezbedno plaćanje</h3>
                        <p>Šifrovana i sigurna kupovina sa svim popularnim platnim karticama.</p>
                    </div>
                    <div className="trust-item">
                        <i className="bi bi-calendar-check-fill"></i>
                        <h3>Brza rezervacija</h3>
                        <p>Rezervišite svoje mesto u samo par jednostavnih koraka.</p>
                    </div>
                </div>
            </section>

        </div>
    );
};

export default Pocetna;