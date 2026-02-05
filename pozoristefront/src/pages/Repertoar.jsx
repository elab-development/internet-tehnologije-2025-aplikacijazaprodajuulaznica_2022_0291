import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "../css/Repertoar.css";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000/api"; // prilagodi port po potrebi

const isUserLoggedIn = () => !!localStorage.getItem("token");

const getMe = () => {
  try {
    return JSON.parse(localStorage.getItem("me") || "null");
  } catch {
    return null;
  }
};

// datum_izvodjenja dolazi kao ISO string (npr. "2026-02-10T00:00:00.000000Z")
// vreme_pocetka kao "19:00:00"
const buildDateTime = (datumISO, vreme) => {
  if (!datumISO) return null;

  // izvučemo samo YYYY-MM-DD iz ISO datuma
  const datePart = String(datumISO).slice(0, 10); // "2026-02-10"
  const timePart = vreme ? String(vreme) : "00:00:00";

  return new Date(`${datePart}T${timePart}`);
};

const formatDateTime = (datumISO, vreme) => {
  const dt = buildDateTime(datumISO, vreme);
  if (!dt || isNaN(dt.getTime())) return { date: "Nije dostupan", time: "Nije definisano" };

  const date = dt.toLocaleDateString("sr-RS", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const time = dt.toLocaleTimeString("sr-RS", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return { date, time };
};

export default function Repertoar() {
  const [izvodjenja, setIzvodjenja] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [izvodjenjeToDeleteId, setIzvodjenjeToDeleteId] = useState(null);

  const navigate = useNavigate();

  const authHeaders = useMemo(() => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  const fetchIzvodjenja = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE}/izvodjenja`);
      let data = res.data || [];

      // sortiranje po datumu + vremenu
      data.sort((a, b) => {
        const da = buildDateTime(a.datum_izvodjenja, a.vreme_pocetka);
        const db = buildDateTime(b.datum_izvodjenja, b.vreme_pocetka);
        if (!da || !db || isNaN(da.getTime()) || isNaN(db.getTime())) return 0;
        return da.getTime() - db.getTime();
      });

      setIzvodjenja(data);
    } catch (err) {
      const msg = err?.response
        ? `Greška (${err.response.status}): ${err.response.statusText}`
        : "Došlo je do greške prilikom učitavanja repertoara.";
      setError(msg);
      console.error("Greška pri dohvatanju izvođenja:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = getMe();

    const role =
      user?.uloga || "";

    setIsAdmin(String(role).toLowerCase() === "admin");
    fetchIzvodjenja();
  }, []);

  const closeModal = () => {
    setShowLoginModal(false);
    setShowDeleteModal(false);
    setIzvodjenjeToDeleteId(null);
  };

  // KLIJENT
  const handleKupiKartu = (izvodjenjeId) => {
    if (isUserLoggedIn()) navigate(`/karte/${izvodjenjeId}`);
    else setShowLoginModal(true);
  };

  // ADMIN
  const handleDodajIzvodjenje = () => navigate("/izvodjenje/add");

  const handleIzmeniIzvodjenje = (id) => navigate(`/admin/izvodjenja/izmena/${id}`);

  const handleObrisiIzvodjenjeModal = (id) => {
    setIzvodjenjeToDeleteId(id);
    setShowDeleteModal(true);
  };

  const handlePotvrdiBrisanje = async () => {
    if (!izvodjenjeToDeleteId) return;

    try {
        await axios.delete(`${API_BASE}/izvodjenja/${izvodjenjeToDeleteId}`, {
            headers: authHeaders,
        });

        alert(`Izvođenje sa ID ${izvodjenjeToDeleteId} je uspešno obrisano.`);
        closeModal();
        fetchIzvodjenja();
    } catch (err) {
      console.error("Greška pri brisanju izvođenja:", err);
      const msg =
        err?.response?.data?.message ||
        "Greška pri brisanju izvođenja. Proverite admin privilegije i token.";
      alert(msg);
      closeModal();
    }
  };

  if (loading) return <div className="repertoar-container">Učitavanje repertoara...</div>;
  if (error) return <div className="repertoar-container error-message">Greška: {error}</div>;

  return (
    <div className="repertoar-section container">
      <h2 className="section-title">Aktuelni Repertoar</h2>
      <p className="section-subtitle">
        Pregledaj termine i predstave. Pronađi svoje omiljeno izvođenje i kupi ulaznice!
      </p>

      {/* ADMIN BAR */}
      {isAdmin && (
        <div className="admin-actions-bar">
          <button className="btn primary admin-add-btn" onClick={handleDodajIzvodjenje}>
            <i className="fa-solid fa-plus"></i> Dodaj novo izvođenje
          </button>
          <button className="btn secondary admin-refresh-btn" onClick={fetchIzvodjenja}>
            <i className="fa-solid fa-sync"></i> Osveži
          </button>
        </div>
      )}

      {/* LOGIN MODAL */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <h3>Potrebna je prijava</h3>
            <p>Da biste kupili ulaznice, morate biti prijavljeni na sistem.</p>
            <div className="modal-actions">
              <button
                className="btn primary"
                onClick={() => {
                  closeModal();
                  navigate("/login");
                }}
              >
                Prijava
              </button>
              <button
                className="btn secondary"
                onClick={() => {
                  closeModal();
                  navigate("/register");
                }}
              >
                Registracija
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>
              &times;
            </span>
            <h3>Potvrda brisanja</h3>
            <p>Da li ste sigurni da želite da obrišete izvođenje sa ID {izvodjenjeToDeleteId}?</p>
            <p className="warning-text">
              Ovo će trajno ukloniti sve povezane karte i stavke rezervacije!
            </p>
            <div className="modal-actions">
              <button className="btn danger" onClick={handlePotvrdiBrisanje}>
                Obriši
              </button>
              <button className="btn secondary" onClick={closeModal}>
                Odustani
              </button>
            </div>
          </div>
        </div>
      )}

      {izvodjenja.length === 0 ? (
        <div className="no-izvodjenja">
          <p>Trenutno nema dostupnih izvođenja.</p>
          <p>Molimo proverite kasnije ili kontaktirajte podršku.</p>
          <img
            src="https://via.placeholder.com/400x250?text=Nema+Izvodjenja"
            alt="Nema izvođenja"
          />
        </div>
      ) : (
        <div className="repertoar-grid">
          {izvodjenja.map((izvodjenje) => {
            const predstavaNaziv = izvodjenje?.predstava?.naziv || "Nepoznata Predstava";
            const slikaUrl =
              izvodjenje?.predstava?.img_url || "https://via.placeholder.com/300x200?text=Predstava";
            const salaNaziv = izvodjenje?.sala?.naziv || "Nepoznata Sala";

            const { date, time } = formatDateTime(
              izvodjenje.datum_izvodjenja,
              izvodjenje.vreme_pocetka
            );

            const cena = izvodjenje.osnovna_cena;

            return (
              <div key={izvodjenje.id} className="izvodjenje-card">
                <img src={slikaUrl} alt={predstavaNaziv} className="izvodjenje-image" />

                <div className="card-content">
                  <h3>{predstavaNaziv}</h3>

                  <p className="details">
                    <i className="fa-solid fa-calendar-alt"></i> Datum: {date}
                  </p>
                  <p className="details">
                    <i className="fa-solid fa-clock"></i> Vreme: {time}
                  </p>
                  <p className="details">
                    <i className="fa-solid fa-location-dot"></i> Sala: {salaNaziv}
                  </p>

                  {cena != null && !isNaN(Number(cena)) && (
                    <p className="price">
                      <i className="fa-solid fa-tag"></i> Cena: {Number(cena).toFixed(2)} RSD
                    </p>
                  )}

                  {/* KLIJENT */}
                  {!isAdmin && (
                    <button
                      className="btn primary large-cta buy-ticket-btn"
                      onClick={() => handleKupiKartu(izvodjenje.id)}
                    >
                      <i className="fa-solid fa-ticket"></i> Kupi ulaznicu
                    </button>
                  )}

                  {/* ADMIN */}
                  {isAdmin && (
                    <div className="admin-card-actions">
                      <button
                        className="btn secondary admin-card-btn"
                        onClick={() => handleIzmeniIzvodjenje(izvodjenje.id)}
                      >
                        <i className="fa-solid fa-edit"></i> Izmeni
                      </button>
                      <button
                        className="btn danger admin-card-btn"
                        onClick={() => handleObrisiIzvodjenjeModal(izvodjenje.id)}
                      >
                        <i className="fa-solid fa-trash-alt"></i> Obriši
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
