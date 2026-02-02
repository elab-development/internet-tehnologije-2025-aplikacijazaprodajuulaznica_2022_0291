import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // <--- DODATO: Uvozimo useNavigate
import http from '../api/http';
import '../css/LogIn.css'; 


const initialFormState = {
    korisnicko_ime: '',
    lozinka: '',
};


export default function LogIn({ onLoginSuccess }) {
    const navigate = useNavigate();
    
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        setError('');
        setLoading(true);

        try {
            const loginRes = await http.post("/login", form);
            const token = loginRes.data.token;
            const user = loginRes.data.korisnik; 

            localStorage.setItem("token", token);
            localStorage.setItem("me", JSON.stringify(user));
            
            if (typeof onLoginSuccess === "function") {
                onLoginSuccess(user);
            }
            
            navigate('/');
            
            window.dispatchEvent(new Event('storage')); 
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Prijava nije uspela. Proverite korisničko ime i lozinku.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <h2>Prijava</h2>
                    <p>Prijavite se na vaš Teatar Maska nalog</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    
                    {/* Polje: Korisničko ime */}
                    <div className="form-group">
                        <label htmlFor="korisnicko_ime">Korisničko ime</label>
                        <div className="input-with-icon">
                            {/* {<FaUser className="input-icon" />} */}
                            <input 
                                id="korisnicko_ime"
                                type="text" 
                                name="korisnicko_ime" 
                                value={form.korisnicko_ime} 
                                onChange={handleChange} 
                                placeholder="Unesite korisničko ime"
                                required
                                aria-label="Korisničko ime"
                            />
                        </div>
                    </div>

                    {/* Polje: Lozinka */}
                    <div className="form-group">
                        <label htmlFor="lozinka">Lozinka</label>
                        <div className="input-with-icon">
                            {/* {<FaLock className="input-icon" />} */}
                            <input 
                                id="lozinka"
                                type="lozinka" 
                                name="lozinka" 
                                value={form.lozinka} 
                                onChange={handleChange} 
                                placeholder="Unesite lozinku"
                                required
                                aria-label="Lozinka"
                            />
                        </div>
                    </div>
                    
                    {/* Prikaz greške */}
                    {error && <p className="error-message">{error}</p>}
                    
                    {/* Dugme za prijavu */}
                    <button type="submit" disabled={loading} className="login-button">
                        {loading ? 'Prijavljujem se...' : 'Prijavi se'}
                    </button>
                    
                    {/* Link za registraciju */}
                    <p className="register-link-text">
                        Nemate nalog? <a href="/register">Registrujte se ovde.</a>
                    </p>

                </form>
            </div>
        </div>
    );
}
