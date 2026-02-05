import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Komponente
import Header from './components/Header'; 
import Footer from './components/Footer';

// Pages
import { Pocetna } from './pages/Pocetna';
import LogIn from './pages/LogIn';
import Repertoar from './pages/Repertoar';
import { Predstave } from './pages/Predstave';
import IzvodjenjeForma from './pages/IzvodjenjeForma';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <div
                    className="App"
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
                >
                    <Header cartItemCount={0} />

                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Pocetna />} />
                            <Route path="/login" element={<LogIn />} />

                            {/* JAVNE STRANICE */}
                            <Route path="/repertoar" element={<Repertoar />} /> 
                            <Route path="/predstave" element={<Predstave />} />
                            <Route path="/kontakt" element={<h1>Kontakt stranica</h1>} />

                            {/* ADMIN RUTE */}
                            <Route path="/izvodjenje/add" element={<IzvodjenjeForma />} />
                            <Route path="/test" element={<h1>Ruter radi!</h1>} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
