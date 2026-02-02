import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import { Pocetna } from './pages/Pocetna';
import LogIn from './pages/LogIn'; 

function App() {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("me");
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const handleLoginSuccess = (userData) => {
        setUser(userData);
        console.log("Korisnik ulogovan u App.js:", userData);
    };

    return (
        <BrowserRouter>
            <div className="App"> 
                {/* Ovde kasnije dodati:
                   <Header user={user} /> 
                */}
                
                <main>
                    <Routes>
                        <Route path="/" element={<Pocetna />} />
                        
                        {/* Dodajemo rutu za Login i prosleđujemo funkciju za uspeh */}
                        <Route 
                            path="/login" 
                            element={<LogIn onLoginSuccess={handleLoginSuccess} />} 
                        />
                        
                        <Route path="/test" element={<h1>Ruter radi! 🎭</h1>} />
                    </Routes>
                </main>
                
                {/* <Footer /> */}
            </div>
        </BrowserRouter>
    );
}

export default App;