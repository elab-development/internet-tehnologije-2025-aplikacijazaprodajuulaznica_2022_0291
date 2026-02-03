import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Komponente
import Header from './components/Header'; 
import Footer from './components/Footer';

// Pages
import { Pocetna } from './pages/Pocetna';
import LogIn from './pages/LogIn'; 

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("me");
        try {
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        console.log("Korisnik ulogovan u App.js:", userData);
    };

    return (
        <BrowserRouter>
            <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}> 
                
                {/* Header je sada uvek vidljiv i prima user podatke */}
                <Header cartItemCount={0} /> 
                
                <main style={{ flex: 1 }}>
                    <Routes>
                        <Route path="/" element={<Pocetna />} />
                        
                        <Route 
                            path="/login" 
                            element={<LogIn onLoginSuccess={handleLoginSuccess} />} 
                        />
                        
                        
                        <Route path="/repertoar" element={<h1>dodati repertoar</h1>} />
                        <Route path="/predstave" element={<h1>dodati predstave</h1>} />
                        <Route path="/kontakt" element={<h1>Kontakt stranica</h1>} />
                        
                        {/* Admin rute */}
                        <Route path="/izvodjenje/add" element={<h1>Dodaj izvođenje (Admin)</h1>} />
                        <Route path="/admin/rezervacije" element={<h1>Sve rezervacije (Admin)</h1>} />

                        <Route path="/test" element={<h1>Ruter radi!</h1>} />
                    </Routes>
                </main>
                
                {/* Footer na dnu svake stranice */}
                <Footer />
            </div>
        </BrowserRouter>
    );
}

export default App;