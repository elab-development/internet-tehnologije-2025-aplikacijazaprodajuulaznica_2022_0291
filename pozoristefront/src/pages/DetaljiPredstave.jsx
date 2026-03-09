import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../api/http';
import '../css/DetaljiPredstave.css';

const DetaljiPredstave = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [predstava, setPredstava] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        http.get(`/predstave/${id}`) 
            .then(res => {
                setPredstava(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Greška pri učitavanju predstave:", err);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="text-center" style={{marginTop: '150px'}}>Učitavanje...</div>;
    if (!predstava) return <div className="text-center" style={{marginTop: '150px'}}>Predstava nije pronađena.</div>;

    return (
        <div className="show-details-container">
            {/* 1. Dugme nazad - koristi .btn-back iz CSS-a */}
            <button className="btn-back" onClick={() => navigate(-1)}>
                <i className="bi bi-arrow-left"></i> Nazad na početnu
            </button>
            
            <div className="show-layout">
                {/* 2. Levi deo: Poster */}
                <div className="poster-wrapper">
                    <img 
                        src={predstava.img_url} 
                        alt={predstava.naziv} 
                        className="show-poster"
                    />
                </div>

                {/* 3. Desni deo: Informacije */}
                <div className="show-info-box">
                    <h1 className="show-title">{predstava.naziv}</h1>
                    
                    <div className="show-meta">
                        <span className="meta-item">
                            <i className="bi bi-clock"></i> {predstava.trajanje_min} min
                        </span>
                        <span className="meta-item">
                            <i className="bi bi-person"></i> Reditelj: {predstava.reditelj}
                        </span>
                    </div>
                    
                    <hr />
                    
                    <h5>O predstavi:</h5>
                    <p className="show-description">{predstava.opis}</p>
                    
                    <button 
                        className="btn-rezervisi" 
                        onClick={() => navigate('/repertoar')}
                    >
                        Rezerviši kartu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DetaljiPredstave;