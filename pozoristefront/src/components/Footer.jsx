import React from 'react';
import '../css/Footer.css'; 

const Footer = () => {
  const currentYear = new Date().getFullYear(); 
  
  //URL ZA GOOGLE MAPS"
  const mapUrl = 'https://www.google.com/maps/search/?api=1&query=Bulevar+Umetnosti+10,+Beograd';

  return (
    <footer className="footer-section">
      <div className="container footer-grid">

        {/* KOLONA 1: Logo, Opis, Društvene mreže... */}
        <div className="footer-col about">
          <h3 className="footer-logo">Teatar Maska</h3>
          <p className="footer-description">
            Pronađite nas na društvenim mrežama!
          </p>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/slike/facebook-logo.png" alt="FB" className="social-icon-img" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/slike/instagram-logo.png" alt="IG" className="social-icon-img" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              <img src="/slike/youtube-logo2.png" alt="YT" className="social-icon-img" />
            </a>
          </div>
          
          <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="map-button">
             <i className="bi bi-geo-alt-fill"></i> Pronađite nas na mapi
          </a>
          
        </div>
        
        {/* KOLONA 2: Navigacija */}
        <div className="footer-col links">
          <h4>Mapa Sajta</h4>
          <ul>
            <li><a href="/">Početna</a></li>
            <li><a href="/predstave">Sve Predstave</a></li>
            <li><a href="/kontakt">Kontakt</a></li>
            <li><a href="/o-nama">O nama</a></li>
          </ul>
        </div>
        
        {/* KOLONA 3: Pomoć i Pravila */}
        <div className="footer-col links">
          <h4>Pravna pitanja</h4>
          <ul>
            <li><a href="/faq">Česta pitanja (FAQ)</a></li>
            <li><a href="/politika-privatnosti">Politika privatnosti</a></li>
            <li><a href="/uslovi-koriscenja">Uslovi korišćenja</a></li>
            <li><a href="/blagajna">Lokacije blagajni</a></li>
          </ul>
        </div>
        
        {/* KOLONA 4: Kontakt Detalji */}
        <div className="footer-col contact">
          <h4>Kontaktirajte nas</h4>
          <p>
            <i className="bi bi-geo-alt-fill"></i> Adresa: Bulevar umetnosti 10, Beograd
          </p>
          <p>
            <i className="bi bi-telephone-fill"></i> Telefon: +381 21 555 333
          </p>
          <p>
            <i className="bi bi-envelope-fill"></i> Email: info@teatarmaska.rs
          </p>
        </div>

      </div>

      {/* DONJI DEO FUTERA (Copyright) */}
      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {currentYear} Teatar Maska. Sva prava zadržana.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;