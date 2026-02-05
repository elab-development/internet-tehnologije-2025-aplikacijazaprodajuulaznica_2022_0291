import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/IzvodjenjeForma.css";

const API_BASE = "http://localhost:8000/api";

const getToken = () =>
    localStorage.getItem("token") || localStorage.getItem("access_token");

// POMOĆNA: iz "2026-02-10T00:00:00.000000Z" izvuče "2026-02-10"
const extractDatePart = (datumISO) => {
  if (!datumISO) return "";
  return String(datumISO).slice(0, 10);
};

// POMOĆNA: iz "19:00:00" izvuče "19:00"
const extractTimePart = (timeString) => {
  if (!timeString) return "";
  return String(timeString).slice(0, 5);
};

// POMOĆNA: Generiše listu vremena 00:00–23:30 u koracima od 30 min
const generateTimeOptions = () => {
  const times = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      const hour = String(h).padStart(2, "0");
      const minute = String(m).padStart(2, "0");
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
};

const timeOptions = generateTimeOptions();

const IzvodjenjeForma = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const token = getToken();

  const authHeaders = useMemo(() => {
    return token
      ? { Authorization: `Bearer ${token}`, Accept: "application/json" }
      : { Accept: "application/json" };
  }, [token]);



  const [izvodjenjeData, setIzvodjenjeData] = useState({
    id: isEditing ? Number(id) : null,
    datum_part: "",
    vreme_part: "",
    osnovna_cena: "",
    predstava_id: "",
    sala_id: "",
  });

  const [predstave, setPredstave] = useState([]);
  const [sale, setSale] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        // pred: javno, sale: admin-only kod tebe -> šaljemo token za oba
        const [predstaveRes, saleRes] = await Promise.all([
          axios.get(`${API_BASE}/predstave`, { headers: authHeaders }),
          axios.get(`${API_BASE}/sale`, { headers: authHeaders }),
        ]);

        setPredstave(predstaveRes.data || []);
        setSale(saleRes.data || []);
      } catch (err) {
        console.error("Greška pri učitavanju predstava/sala:", err);
        setError(
          "Greška pri učitavanju Predstava ili Sala. Proveri da li si ulogovan kao ADMIN (ruta /sale je admin-only)."
        );
      }
    };

    const fetchIzvodjenje = async () => {
      try {
        const res = await axios.get(`${API_BASE}/izvodjenja/${id}`, {
          headers: authHeaders,
        });
        const data = res.data;

        setIzvodjenjeData({
          id: data.id,
          datum_part: extractDatePart(data.datum_izvodjenja),
          vreme_part: extractTimePart(data.vreme_pocetka),
          osnovna_cena: data.osnovna_cena ?? "",
          predstava_id: data.predstava_id ?? "",
          sala_id: data.sala_id ?? "",
        });
      } catch (err) {
        console.error("Greška pri učitavanju izvođenja:", err);
        setError(`Greška pri učitavanju izvođenja ID ${id}. Možda ne postoji.`);
      }
    };

    (async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("Niste autorizovani. Ulogujte se kao ADMIN.");
        setLoading(false);
        return;
      }

      await fetchDependencies();
      if (isEditing) await fetchIzvodjenje();

      setLoading(false);
    })();
  }, [id, isEditing, token, authHeaders]);

  if (loading) return <div className="izvodjenje-form-container">Učitavanje forme...</div>;
  if (error) return <div className="izvodjenje-form-container error-message">{error}</div>;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIzvodjenjeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const { datum_part, vreme_part, osnovna_cena, predstava_id, sala_id } = izvodjenjeData;

    if (!datum_part || !vreme_part || !osnovna_cena || !predstava_id || !sala_id) {
      alert("Sva polja su obavezna.");
      setSubmitting(false);
      return;
    }

    if (!token) {
      alert("Niste autorizovani.");
      setSubmitting(false);
      return;
    }

    // datum_izvodjenja se u bazi castuje kao date, ali u JSON-u vraća ISO.
    // za upis je najb poslati "YYYY-MM-DD".
    const payload = {
      datum_izvodjenja: datum_part,          // 2026-02-10
      vreme_pocetka: `${vreme_part}:00`,     // 19:00:00
      osnovna_cena: Number(osnovna_cena),    
      predstava_id: Number(predstava_id),
      sala_id: Number(sala_id),
    };

    let url = `${API_BASE}/izvodjenja`;
    let method = "post";

    if (isEditing) {
      url = `${API_BASE}/izvodjenja/${id}`;
      method = "put";
    }

    try {
      await axios({
        method,
        url,
        data: payload,
        headers: authHeaders,
      });

      alert(`Izvođenje je uspešno ${isEditing ? "ažurirano" : "dodato"}!`);
      navigate("/repertoar");
    } catch (err) {
      console.error("Form submit error:", err);
      const errMsg =
        err?.response?.data?.message ||
        (typeof err?.response?.data === "string" ? err.response.data : null) ||
        err.message ||
        "Došlo je do greške pri čuvanju izvođenja.";
      alert(`Greška: ${errMsg}`);
      setError(errMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const title = isEditing ? `Izmeni izvođenje ID: ${id}` : "Dodaj novo izvođenje";

  return (
    <div className="izvodjenje-form-container container">
      <h2 className="form-title">{title}</h2>

      <form onSubmit={handleSubmit} className="izvodjenje-form">
        <div className="form-group">
          <label htmlFor="predstava_id">Predstava *</label>
          <select
            id="predstava_id"
            name="predstava_id"
            value={izvodjenjeData.predstava_id}
            onChange={handleChange}
            required
          >
            <option value="">Izaberi predstavu</option>
            {predstave.map((p) => (
              <option key={p.id} value={p.id}>
                {p.naziv}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sala_id">Sala *</label>
          <select
            id="sala_id"
            name="sala_id"
            value={izvodjenjeData.sala_id}
            onChange={handleChange}
            required
          >
            <option value="">Izaberi salu</option>
            {sale.map((s) => (
              <option key={s.id} value={s.id}>
                {s.naziv} (Kapacitet: {s.kapacitet})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group-datetime-split" style={{ display: "flex", gap: "20px" }}>
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="datum_part">Datum Izvođenja *</label>
            <input
              type="date"
              id="datum_part"
              name="datum_part"
              value={izvodjenjeData.datum_part}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <label htmlFor="vreme_part">Vreme Izvođenja (HH:MM) *</label>
            <select
              id="vreme_part"
              name="vreme_part"
              value={izvodjenjeData.vreme_part}
              onChange={handleChange}
              required
            >
              <option value="">Izaberi vreme</option>
              {timeOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group" style={{ marginTop: "30px" }}>
          <label htmlFor="osnovna_cena">Osnovna cena (RSD) *</label>
          <input
            type="number"
            id="osnovna_cena"
            name="osnovna_cena"
            value={izvodjenjeData.osnovna_cena}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn primary submit-btn" disabled={submitting}>
            {submitting ? "Čuvanje..." : isEditing ? "Ažuriraj Izvođenje" : "Dodaj Izvođenje"}
          </button>

          <button
            type="button"
            className="btn secondary cancel-btn"
            onClick={() => navigate("/repertoar")}
          >
            Odustani
          </button>
        </div>

        {isEditing && (
          <p className="edit-warning">
            <i className="fa-solid fa-exclamation-triangle"></i>
            Napomena: Ako su za ovo izvođenje već prodate karte, nije dozvoljena izmena Sale ili Predstave!
          </p>
        )}
      </form>
    </div>
  );
};

export default IzvodjenjeForma;