import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../api/api";
import { cities } from "../data/cities";

function Dashboard() {
  const navigate = useNavigate();

  // =========================
  // STATE
  // =========================
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 NUEVO (autocomplete)
  const [originQuery, setOriginQuery] = useState("");
  const [destinationQuery, setDestinationQuery] = useState("");
  const [originSelected, setOriginSelected] = useState("");
  const [destinationSelected, setDestinationSelected] = useState("");
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestinationDropdown, setShowDestinationDropdown] = useState(false);

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // =========================
  // GET SHIPMENTS
  // =========================
  const fetchShipments = async () => {
    try {
      const res = await API.get("/shipments");
      setShipments(res.data);
    } catch (err) {
      console.log("❌ Error cargando envíos", err);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // =========================
  // FILTRO CIUDADES
  // =========================
  const filterCities = (query) =>
    cities.filter((city) =>
      city.toLowerCase().includes(query.toLowerCase())
    );

  // =========================
  // CREATE SHIPMENT
  // =========================
  const createShipment = async () => {
    // 🔥 VALIDACIÓN OBLIGATORIA
    if (!originSelected || !destinationSelected) {
      alert("⚠️ Debes seleccionar ciudades válidas de la lista");
      return;
    }

    try {
      setLoading(true);

      await API.post("/shipments", {
        origin: originSelected,
        destination: destinationSelected,
      });

      await fetchShipments();

      // limpiar
      setOriginQuery("");
      setDestinationQuery("");
      setOriginSelected("");
      setDestinationSelected("");

    } catch (error) {
      console.error("Error creando envío:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = (e) => {
    e.preventDefault();
    createShipment();
  };

  // =========================
  // DELETE SHIPMENT
  // =========================
  const deleteShipment = async (code) => {
    const confirmDelete = window.confirm("¿Abortar esta ruta?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/shipments/${code}`);
      setShipments((prev) => prev.filter((s) => s.code !== code));
    } catch (error) {
      console.error("Error eliminando envío:", error);
    }
  };

  // =========================
  // STATS
  // =========================
  const total = shipments.length;
  const inTransit = shipments.filter(s => s.status === "En camino").length;
  const delivered = shipments.filter(s => s.status === "Entregado").length;

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">🚚 Dashboard Colombia</h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* FORM */}
      <div className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl mb-8">
        <h2 className="text-xl mb-4">➕ Crear nuevo envío</h2>

        <form onSubmit={handleCreate} className="grid md:grid-cols-3 gap-4">

          {/* 🔥 ORIGEN */}
          <div className="relative">
  <input
    type="text"
    placeholder="Ciudad origen"
    value={originQuery}
    onFocus={() => setShowOriginDropdown(true)}
    onChange={(e) => {
      setOriginQuery(e.target.value);
      setOriginSelected("");
      setShowOriginDropdown(true);
    }}
    className="p-3 rounded-lg bg-white/10 border border-white/20 w-full"
  />

  {showOriginDropdown && (
    <div className="absolute bg-[#1e293b] w-full rounded-lg mt-1 max-h-40 overflow-y-auto z-50 border border-white/10">

      {filterCities(originQuery).length > 0 ? (
        filterCities(originQuery).map((city) => (
          <div
            key={city}
            onClick={() => {
              setOriginQuery(city);
              setOriginSelected(city);
              setShowOriginDropdown(false); // 🔥 cerrar
            }}
            className="p-2 hover:bg-yellow-400 hover:text-black cursor-pointer transition"
          >
            {city}
          </div>
        ))
      ) : (
        <div className="p-2 text-gray-400">
          No hay resultados
        </div>
      )}

    </div>
  )}
</div>

          {/* 🔥 DESTINO */}
          <div className="relative">
  <input
    type="text"
    placeholder="Ciudad destino"
    value={destinationQuery}
    onFocus={() => setShowDestinationDropdown(true)}
    onChange={(e) => {
      setDestinationQuery(e.target.value);
      setDestinationSelected("");
      setShowDestinationDropdown(true);
    }}
    className="p-3 rounded-lg bg-white/10 border border-white/20 w-full"
  />

  {showDestinationDropdown && (
    <div className="absolute bg-[#1e293b] w-full rounded-lg mt-1 max-h-40 overflow-y-auto z-50 border border-white/10">

      {filterCities(destinationQuery).length > 0 ? (
        filterCities(destinationQuery).map((city) => (
          <div
            key={city}
            onClick={() => {
              setDestinationQuery(city);
              setDestinationSelected(city);
              setShowDestinationDropdown(false);
            }}
            className="p-2 hover:bg-blue-500 cursor-pointer transition"
          >
            {city}
          </div>
        ))
      ) : (
        <div className="p-2 text-gray-400">
          No hay resultados
        </div>
      )}

    </div>
  )}
</div>

          {/* BOTÓN */}
          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 text-black font-bold rounded-lg hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Creando..." : "Crear envío 🚀"}
          </button>

        </form>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-6 rounded-xl shadow-xl">
          <h2>📦 Envíos</h2>
          <p className="text-3xl font-bold">{total}</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-xl shadow-xl">
          <h2>🚚 En tránsito</h2>
          <p className="text-3xl font-bold">{inTransit}</p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-xl shadow-xl">
          <h2>✅ Entregados</h2>
          <p className="text-3xl font-bold">{delivered}</p>
        </div>
      </div>

      {/* LISTA */}
      <div className="mt-10 bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl">
        <h2 className="mb-4 text-xl">📋 Tus envíos</h2>

        {shipments.length === 0 ? (
          <p className="text-gray-400">No hay envíos aún...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">

            {shipments.map((s) => (
              <div
                key={s.code}
                className="bg-white/5 p-4 rounded-xl border border-white/10 hover:scale-[1.02] transition"
              >
                <h3 className="text-lg font-bold">{s.code}</h3>

                <p className="text-gray-300">
                  {s.origin} → {s.destination}
                </p>

                <p
                  className={`mt-2 font-semibold ${
                    s.status === "En camino"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {s.status}
                </p>

                <div className="flex gap-2 mt-3">

                  <button
                    onClick={() => navigate(`/map/${s.code}`)}
                    className="bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
                  >
                    Ver mapa 🗺️
                  </button>

                  <button
                    onClick={() => deleteShipment(s.code)}
                    className="bg-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition"
                  >
                    Cancelar Envío📦🚫
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;