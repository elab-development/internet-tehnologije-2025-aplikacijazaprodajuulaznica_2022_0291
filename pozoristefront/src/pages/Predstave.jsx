import React, { useEffect, useState, useMemo } from "react";
import http from "../api/http";
import "../css/Predstave.css";

const getMe = () => {
  try {
    return JSON.parse(localStorage.getItem("me") || "null");
  } catch {
    return null;
  }
};

const isAdminUser = () => {
  const me = getMe();
  return me && String(me.uloga).toLowerCase() === "admin";
};

export const Predstave = () => {
  const [predstave, setPredstave] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [inputTerm, setInputTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "naziv", direction: "asc" });

  const [selectedImage, setSelectedImage] = useState(null);

  const [showNewPredstavaModal, setShowNewPredstavaModal] = useState(false);
  const [newPredstavaData, setNewPredstavaData] = useState({
    naziv: "",
    opis: "",
    img_url: "",
    trajanje_min: "",
    reditelj: "",
  });

  const [showEditPredstavaModal, setShowEditPredstavaModal] = useState(false);
  const [editPredstavaData, setEditPredstavaData] = useState(null);

  const [formError, setFormError] = useState(null);

  const isAdmin = isAdminUser();

  const fetchPredstave = () => {
    setLoading(true);
    setError(null);
    setInputTerm("");
    setSearchTerm("");
    setSortConfig({ key: "naziv", direction: "asc" });

    http
      .get("/predstave")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];
        setPredstave(data);
      })
      .catch((e) => {
        const errorMessage =
          e.response?.data?.poruka ||
          e.response?.data?.message ||
          e.message ||
          "Došlo je do greške prilikom učitavanja predstava.";
        setError(errorMessage);
        console.error("Greška pri fetchanju predstava:", e);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPredstave();
  }, []);

  const handleDeletePredstava = (predstavaId, predstavaNaziv) => {
    if (!isAdmin) {
      alert("Nemate ovlašćenje za brisanje predstava.");
      return;
    }

    if (!window.confirm(`Da li ste sigurni da želite da obrišete predstavu "${predstavaNaziv}"?`)) {
      return;
    }

    setLoading(true);

    http
      .delete(`/predstave/${predstavaId}`)
      .then(() => {
        alert(`Predstava "${predstavaNaziv}" je uspešno obrisana!`);
        setPredstave((prev) => prev.filter((p) => p.id !== predstavaId));
      })
      .catch((e) => {
        const errorMessage =
          e.response?.data?.poruka || e.response?.data?.message || "Greška prilikom brisanja predstave.";
        setError(errorMessage);
        console.error("Greška pri brisanju predstave:", e);
      })
      .finally(() => setLoading(false));
  };

  const handleSearch = () => setSearchTerm(inputTerm);
  const handleRefresh = () => fetchPredstave();

  const handleNewPredstava = () => {
    if (!isAdmin) return;
    setNewPredstavaData({
      naziv: "",
      opis: "",
      img_url: "",
      trajanje_min: "",
      reditelj: "",
    });
    setFormError(null);
    setShowNewPredstavaModal(true);
  };

  const handleSort = (key) => {
    let direction = "asc";

    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    else if (sortConfig.key === key && sortConfig.direction === "desc") {
      setSortConfig({ key: "naziv", direction: "asc" });
      return;
    }

    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? <i className="bi bi-arrow-up"></i> : <i className="bi bi-arrow-down"></i>;
  };

  const openImageModal = (imgUrl) => setSelectedImage(imgUrl);
  const closeImageModal = () => setSelectedImage(null);

  // NEW modal input
  const handleNewPredstavaInputChange = (e) => {
    const { name, value } = e.target;
    setNewPredstavaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveNewPredstava = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setFormError(null);

    if (!newPredstavaData.naziv || !newPredstavaData.opis || !newPredstavaData.reditelj || !newPredstavaData.trajanje_min) {
      setFormError("Sva polja osim URL slike su obavezna.");
      return;
    }

    if (isNaN(newPredstavaData.trajanje_min) || Number(newPredstavaData.trajanje_min) <= 0) {
      setFormError("Trajanje mora biti pozitivan broj.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        naziv: newPredstavaData.naziv,
        opis: newPredstavaData.opis,
        reditelj: newPredstavaData.reditelj,
        trajanje_min: Number(newPredstavaData.trajanje_min),
        img_url: newPredstavaData.img_url || "",
      };

      const res = await http.post("/predstave", payload);
      alert(`Predstava "${res.data.naziv}" uspešno dodata!`);
      setShowNewPredstavaModal(false);
      fetchPredstave();
    } catch (e) {
      const errorMessage = e.response?.data?.poruka || e.response?.data?.message || "Greška prilikom dodavanja predstave.";
      setFormError(errorMessage);
      console.error("Greška pri dodavanju predstave:", e);
    } finally {
      setLoading(false);
    }
  };

  // EDIT modal
  const handleEditPredstava = (predstava) => {
    if (!isAdmin) return;
    setEditPredstavaData({
      ...predstava,
      trajanje_min: predstava.trajanje_min ?? "",
      img_url: predstava.img_url ?? "",
    });
    setFormError(null);
    setShowEditPredstavaModal(true);
  };

  const handleEditPredstavaInputChange = (e) => {
    const { name, value } = e.target;
    setEditPredstavaData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePredstava = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;

    setFormError(null);

    if (!editPredstavaData?.naziv || !editPredstavaData?.opis || !editPredstavaData?.reditelj || !editPredstavaData?.trajanje_min) {
      setFormError("Sva polja osim URL slike su obavezna.");
      return;
    }

    if (isNaN(editPredstavaData.trajanje_min) || Number(editPredstavaData.trajanje_min) <= 0) {
      setFormError("Trajanje mora biti pozitivan broj.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        naziv: editPredstavaData.naziv,
        opis: editPredstavaData.opis,
        reditelj: editPredstavaData.reditelj,
        trajanje_min: Number(editPredstavaData.trajanje_min),
        img_url: editPredstavaData.img_url || "",
      };

      await http.put(`/predstave/${editPredstavaData.id}`, payload);
      alert(`Predstava "${editPredstavaData.naziv}" uspešno izmenjena!`);
      setShowEditPredstavaModal(false);
      setEditPredstavaData(null);
      fetchPredstave();
    } catch (e) {
      const errorMessage = e.response?.data?.poruka || e.response?.data?.message || "Greška prilikom izmene predstave.";
      setFormError(errorMessage);
      console.error("Greška pri izmeni predstave:", e);
    } finally {
      setLoading(false);
    }
  };

  // Filter
  const filteredPredstave = predstave.filter((predstava) => {
    if (!searchTerm) return true;

    const q = searchTerm.toLowerCase();
    const matchNaziv = String(predstava.naziv || "").toLowerCase().includes(q);
    const matchOpis = String(predstava.opis || "").toLowerCase().includes(q);
    return matchNaziv || matchOpis;
  });

  // Sort
  const sortedPredstave = useMemo(() => {
    const sortable = [...filteredPredstave];

    sortable.sort((a, b) => {
      const key = sortConfig.key;

      if (key === "trajanje_min") {
        const aNum = Number(a[key] || 0);
        const bNum = Number(b[key] || 0);
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      const aStr = String(a[key] || "");
      const bStr = String(b[key] || "");
      const cmp = aStr.localeCompare(bStr, "sr", { sensitivity: "base" });
      return sortConfig.direction === "asc" ? cmp : -cmp;
    });

    return sortable;
  }, [filteredPredstave, sortConfig]);

  if (loading && !showNewPredstavaModal && !showEditPredstavaModal) {
    return (
      <div className="container" style={{ padding: "80px 0", textAlign: "center", fontSize: "1.2rem" }}>
        Učitavanje predstava...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: "80px 0", color: "#A52A2A", textAlign: "center", fontSize: "1.2rem" }}>
        Greška: {error}
      </div>
    );
  }

  return (
    <div className="admin-wrap">
      <div className="container">
        <div className="admin-head">
          <div className="admin-title-group">
            <h1>Predstave</h1>
            <p className="muted">Ukupno: {sortedPredstave.length}</p>
          </div>

          <div className="admin-actions">
            <input
              type="text"
              className="input"
              placeholder="Pretraga po nazivu ili opisu..."
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />

            <button className="btn primary" onClick={handleSearch} title="Pretraži listu">
              <i className="bi bi-search"></i> Pretraži
            </button>

            <button className="btn" onClick={handleRefresh} title="Osveži listu">
              <i className="bi bi-arrow-clockwise"></i> Osveži
            </button>

            {isAdmin && (
              <button className="btn primary" onClick={handleNewPredstava} title="Dodaj novu predstavu">
                <i className="bi bi-plus-lg"></i> Nova Predstava
              </button>
            )}
          </div>
        </div>

        {sortedPredstave.length === 0 && !loading && !error ? (
          <div style={{ textAlign: "center", padding: "50px 0" }}>
            Nema rezultata za "{searchTerm}". Pokušajte sa drugim terminom ili kliknite Osveži.
          </div>
        ) : (
          <table className="predstave-tabela">
            <thead>
              <tr>
                <th>Slika</th>
                <th onClick={() => handleSort("naziv")}><span>Naziv</span> {getSortIcon("naziv")}</th>
                <th onClick={() => handleSort("opis")}><span>Opis</span> {getSortIcon("opis")}</th>
                <th onClick={() => handleSort("reditelj")}><span>Reditelj</span> {getSortIcon("reditelj")}</th>
                <th onClick={() => handleSort("trajanje_min")}><span>Trajanje</span> {getSortIcon("trajanje_min")}</th>
                <th>{isAdmin ? "Akcije" : ""}</th>
              </tr>
            </thead>

            <tbody>
              {sortedPredstave.map((predstava) => (
                <tr key={predstava.id}>
                  <td className="image-cell">
                    {predstava.img_url ? (
                      <img
                        src={predstava.img_url}
                        alt={`Slika predstave ${predstava.naziv}`}
                        className="predstava-thumbnail clickable"
                        onClick={() => openImageModal(predstava.img_url)}
                      />
                    ) : (
                      <span className="no-image-placeholder">Nema slike</span>
                    )}
                  </td>

                  <td>{predstava.naziv}</td>
                  <td>{predstava.opis || "Nema dostupnog opisa"}</td>
                  <td>{predstava.reditelj || "N/A"}</td>
                  <td>{predstava.trajanje_min ? `${predstava.trajanje_min} min` : "N/A"}</td>

                  <td className="actions-cell">
                    {isAdmin && (
                      <>
                        <button className="btn edit-btn" onClick={() => handleEditPredstava(predstava)} title={`Izmeni ${predstava.naziv}`}>
                          <i className="bi bi-pencil"></i> Izmeni
                        </button>
                        <button className="btn delete-btn" onClick={() => handleDeletePredstava(predstava.id, predstava.naziv)} title={`Obriši ${predstava.naziv}`}>
                          <i className="bi bi-trash"></i> Obriši
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedImage && (
        <div className="image-modal-overlay" onClick={closeImageModal}>
          <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Uvećana slika predstave" className="modal-image" />
            <button className="modal-close-btn" onClick={closeImageModal}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* NOVA PREDSTAVA */}
      {isAdmin && showNewPredstavaModal && (
        <div className="modal-overlay" onClick={() => setShowNewPredstavaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Dodaj Novu Predstavu</h2>

            <form onSubmit={handleSaveNewPredstava}>
              <div className="form-group">
                <label>Naziv:</label>
                <input type="text" name="naziv" value={newPredstavaData.naziv} onChange={handleNewPredstavaInputChange} className="input" />
              </div>

              <div className="form-group">
                <label>Opis:</label>
                <textarea name="opis" value={newPredstavaData.opis} onChange={handleNewPredstavaInputChange} className="textarea"></textarea>
              </div>

              <div className="form-group">
                <label>URL Slike:</label>
                <input type="text" name="img_url" value={newPredstavaData.img_url} onChange={handleNewPredstavaInputChange} className="input" />
              </div>

              <div className="form-group">
                <label>Trajanje (minuta):</label>
                <input type="number" name="trajanje_min" value={newPredstavaData.trajanje_min} onChange={handleNewPredstavaInputChange} className="input" min="1" />
              </div>

              <div className="form-group">
                <label>Reditelj:</label>
                <input type="text" name="reditelj" value={newPredstavaData.reditelj} onChange={handleNewPredstavaInputChange} className="input" />
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  <i className="bi bi-save"></i> Sačuvaj
                </button>
                <button type="button" className="btn" onClick={() => setShowNewPredstavaModal(false)}>
                  <i className="bi bi-x-lg"></i> Odustani
                </button>
              </div>
            </form>

            <button className="modal-close-btn" onClick={() => setShowNewPredstavaModal(false)}>
              &times;
            </button>
          </div>
        </div>
      )}

      {/* IZMENA */}
      {isAdmin && showEditPredstavaModal && editPredstavaData && (
        <div className="modal-overlay" onClick={() => setShowEditPredstavaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Izmeni Predstavu</h2>

            <form onSubmit={handleUpdatePredstava}>
              <div className="form-group">
                <label>Naziv:</label>
                <input type="text" name="naziv" value={editPredstavaData.naziv} onChange={handleEditPredstavaInputChange} className="input" />
              </div>

              <div className="form-group">
                <label>Opis:</label>
                <textarea name="opis" value={editPredstavaData.opis} onChange={handleEditPredstavaInputChange} className="textarea"></textarea>
              </div>

              <div className="form-group">
                <label>URL Slike:</label>
                <input type="text" name="img_url" value={editPredstavaData.img_url || ""} onChange={handleEditPredstavaInputChange} className="input" />
              </div>

              <div className="form-group">
                <label>Trajanje (minuta):</label>
                <input type="number" name="trajanje_min" value={editPredstavaData.trajanje_min} onChange={handleEditPredstavaInputChange} className="input" min="1" />
              </div>

              <div className="form-group">
                <label>Reditelj:</label>
                <input type="text" name="reditelj" value={editPredstavaData.reditelj} onChange={handleEditPredstavaInputChange} className="input" />
              </div>

              {formError && <div className="form-error">{formError}</div>}

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  <i className="bi bi-save"></i> Sačuvaj izmene
                </button>
                <button type="button" className="btn" onClick={() => setShowEditPredstavaModal(false)}>
                  <i className="bi bi-x-lg"></i> Odustani
                </button>
              </div>
            </form>

            <button className="modal-close-btn" onClick={() => setShowEditPredstavaModal(false)}>
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
