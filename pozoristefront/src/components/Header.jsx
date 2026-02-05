import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../css/Header.css';
import axios from 'axios';

const isAuthhed = () => {
    return localStorage.getItem("token");
};

const getMe = () => {
    try {
        const authResponse = JSON.parse(localStorage.getItem("me") || "null");
        return authResponse; 
    } catch (e) {
        return null;
    }
};

const Header = ({ cartItemCount = 0 }) => {
    const nav = useNavigate();
    
    const [isAuthenticated, setIsAuthenticated] = useState(isAuthhed());
    const [me, setMe] = useState(getMe()); 

    const isAdmin = me && me.uloga === 'admin';

    useEffect(() => {
        const handleStorageChange = () => {
            setIsAuthenticated(isAuthhed());
            setMe(getMe());
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []); 
    
    useEffect(() => {
        setIsAuthenticated(isAuthhed());
        setMe(getMe());
    }, []); 
    
    const handleLogout = async () => {
        try {
            const token = localStorage.getItem("token");
            // Pozivamo Laravel da unisti token u bazi
            await axios.post('http://localhost:8000/api/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) {
            console.error("Greška pri odjavi na serveru", e);
        }
        
        localStorage.removeItem("token");
        localStorage.removeItem("me");
        setIsAuthenticated(false);
        setMe(null);
        nav("/login");
    };

    const location = useLocation();
    const currentPath = location.pathname;

    const getClassName = (path) => {
        if (path === '/') {
            return currentPath === '/' ? 'nav-item active' : 'nav-item';
        }

        if (path === '/repertoar') {
            if (currentPath === '/repertoar' || currentPath.startsWith('/karte/')) {
                return 'nav-item active';
            }
        }
        
        //Provera za admin linkove
        if (path === '/admin/izvodjenja' && (currentPath === '/izvodjenje/add' || currentPath.startsWith('/izvodjenje/edit/'))) {
             return 'nav-item active';
        }
        
        if (currentPath.startsWith(path)) { 
             return 'nav-item active';
        }

        return 'nav-item';
    };

    const getUserDisplay = () => {
        if (!me) return "Gost";
        
        // Proveri da li se polje možda zove 'name' umesto 'username'
        const nameToDisplay = me.korisnicko_ime || "Korisnik";
        
        return isAdmin 
            ? `${nameToDisplay} (ADMIN)` 
            : nameToDisplay;
    };
    
    const handleCartClick = () => {
        if (isAuthenticated) {
            nav('/korpa'); 
        } else {
            alert("Morate se prijaviti da biste pristupili korpi.");
        }
    };
    

    return (
        <header className="main-header">
            <div className="container header-content">
                
                <div className="logo">
                    <Link to="/" className="logo-text">Teatar Maska</Link> 
                </div>
                
                <nav className="main-nav">
                    <ul>
                        <li className={getClassName('/')}>
                            <Link to="/">Početna</Link>
                        </li>
                        
                        <li className={getClassName('/repertoar')}>
                            <Link to="/repertoar">Repertoar</Link>
                        </li> 

                        <li className={getClassName('/predstave')}>
                            <Link to="/predstave">Predstave</Link>
                        </li>
                        
                        {isAuthenticated && isAdmin && (
                            <>
                                <li className={getClassName('/admin/izvodjenja')}>
                                    <Link to="/izvodjenje/add">Izvođenja</Link>
                                </li>
                                <li className={getClassName('/admin/rezervacije')}>
                                    <Link to="/admin/rezervacije">Rezervacije</Link>
                                </li>
                            </>
                        )}
                        
                        <li className={getClassName('/kontakt')}>
                            <Link to="/kontakt">Kontakt</Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">
                    
                    <button 
                        className={`btn-cart ${isAuthenticated ? 'active-cart' : 'disabled-cart'}`} 
                        title={isAuthenticated ? "Korpa" : "Prijavite se za kupovinu"}
                        onClick={handleCartClick}
                    >
                        <i className="bi bi-cart-fill"></i> 
                        
                        {isAuthenticated && cartItemCount > 0 && (
                            <span className="cart-badge">{cartItemCount}</span>
                        )}
                    </button>

                    {!isAuthenticated ? (
                        <>
                            <Link to="/login" className="btn-login">Prijava</Link>
                            <Link to="/register" className="btn-register">Registracija</Link>
                        </>
                    ) : (
                        <>
                            <span className={`user-chip ${isAdmin ? 'admin-chip' : ''}`}>
                                {getUserDisplay()}
                            </span>
                            <button className="btn-logout" onClick={handleLogout}>Odjava</button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;