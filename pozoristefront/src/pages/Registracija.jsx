import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import http from '../api/http';
import '../css/Registracija.css'; 

const initialFormState = {
    korisnicko_ime: '', 
    email: '',
    lozinka: '',        
};

export default function Register({ onRegisterSuccess }) {
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
            await http.post("/registracija", form);
            
            alert("Uspešna registracija! Poslali smo vam mejl za verifikaciju. Molimo potvrdite nalog pre prijave.");
            
            navigate('/login'); 
            
            
        } catch (err) {
            console.error("Full error object:", err.response?.data);
            
            const serverError = err.response?.data?.poruka || 
                                err.response?.data?.message || 
                                err.response?.data?.error;

            if (err.response?.status === 500 && serverError?.includes('kreiran')) {
                alert("Nalog je kreiran, ali postoji problem sa slanjem mejla. Probajte da se ulogujete.");
                navigate('/login');
            } else {
                setError(serverError || "Greška pri registraciji. Proverite bazu ili internet.");
            }
        }
    };

    return (
        <div className="register-page-wrapper">
            <div className="register-container">
                <div className="register-header">
                    <h2>Registracija</h2>
                    <p>Kreirajte nalog za Teatar Maska</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="korisnicko_ime">Korisničko ime</label>
                        <input 
                            id="korisnicko_ime"
                            type="text" 
                            name="korisnicko_ime"
                            value={form.korisnicko_ime} 
                            onChange={handleChange} 
                            placeholder="Unesite korisničko ime"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="email">Email adresa</label>
                        <input 
                            id="email"
                            type="email" 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange} 
                            placeholder="Unesite email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="lozinka">Lozinka</label>
                        <input 
                            id="lozinka"
                            type="password" 
                            name="lozinka"
                            value={form.lozinka} 
                            onChange={handleChange} 
                            placeholder="Min. 8 karaktera"
                            required
                        />
                    </div>
                    
                    {error && <p className="error-message" style={{color: 'red'}}>{error}</p>}
                    
                    <button type="submit" disabled={loading} className="register-button">
                        {loading ? 'Slanje...' : 'Registruj se'}
                    </button>
                    
                    <p className="login-link-text">
                        Već imate nalog? <a href="/login">Prijavite se</a>
                    </p>
                </form>
            </div>
        </div>
    );
}