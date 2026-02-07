import React, { useState } from 'react'; // SPOJENO
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Context
import { AuthProvider } from './context/AuthContext';

// Komponente
import Header from './components/Header'; 
import Footer from './components/Footer';

// Pages
import Pocetna from './pages/Pocetna';
import LogIn from './pages/LogIn';
import Registracija from './pages/Registracija';
import Repertoar from './pages/Repertoar';
import Predstave from './pages/Predstave';
import IzvodjenjeForma from './pages/IzvodjenjeForma';
import Kontakt from './pages/Kontakt';
import  AdminRezervacije from './pages/AdminRezervacije';
import KupiKartu from './pages/KupiKartu'; 
import Korpa from './pages/Korpa';
import AdminDashboard from './pages/AdminDashboard';

function App() {
    const [cart, setCart] = useState([]);

    const addToCart = (karta) => {
        setCart((prev) => [...prev, karta]);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    return (
        <BrowserRouter>
            <AuthProvider>
                <div
                    className="App"
                    style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
                >
                    <Header cartItemCount={cart.length} />

                    <main style={{ flex: 1 }}>
                        <Routes>
                            <Route path="/" element={<Pocetna />} />
                            <Route path="/login" element={<LogIn />} />
                            <Route path="/registracija" element={<Registracija />} />

                            {/* JAVNE STRANICE */}
                            <Route path="/repertoar" element={<Repertoar />} /> 
                            <Route path="/predstave" element={<Predstave />} />
                            <Route path="/kontakt" element={<Kontakt />} /> 
                            
                            {/* RUTE ZA KUPCE */}
                            <Route path="/kupi-kartu/:idIzvodjenja" element={<KupiKartu addToCart={addToCart} />} />
                            <Route path="/korpa" element={<Korpa cart={cart} setCart={setCart} removeFromCart={removeFromCart} />} />

                            {/* ADMIN RUTE */}
                            <Route path="/admin" element={<AdminDashboard/>} />
                            <Route path="/admin/test" element={<h1>Test radi!</h1>} />
                            <Route path="/admin/izvodjenja/dodavanje" element={<IzvodjenjeForma />} />
                            <Route path="/admin/izvodjenja/izmena/:id" element={<IzvodjenjeForma />} />
                            <Route path="/admin/rezervacije" element={<AdminRezervacije />} />
                        </Routes>
                    </main>

                    <Footer />
                </div>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;