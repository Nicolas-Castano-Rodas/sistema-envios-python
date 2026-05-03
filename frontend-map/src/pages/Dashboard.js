import { useNavigate, Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  // 🔐 Logout real
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // 🔥 Simulación de datos (luego lo conectas a MongoDB)
  const shipments = [
    {
      code: "ENV-001",
      origin: "Medellín",
      destination: "Bogotá",
      status: "En camino",
    },
    {
      code: "ENV-002",
      origin: "Cali",
      destination: "Barranquilla",
      status: "Entregado",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          🚚 Dashboard Colombia
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      {/* CARDS */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black p-6 rounded-xl shadow-xl">
          <h2>📦 Envíos</h2>
          <p className="text-3xl font-bold">{shipments.length}</p>
        </div>

        <div className="bg-gradient-to-r from-blue-500 to-blue-700 p-6 rounded-xl shadow-xl">
          <h2>🚚 En tránsito</h2>
          <p className="text-3xl font-bold">
            {shipments.filter(s => s.status === "En camino").length}
          </p>
        </div>

        <div className="bg-gradient-to-r from-red-500 to-red-700 p-6 rounded-xl shadow-xl">
          <h2>✅ Entregados</h2>
          <p className="text-3xl font-bold">
            {shipments.filter(s => s.status === "Entregado").length}
          </p>
        </div>

      </div>

      {/* LISTA DE ENVÍOS */}
      <div className="mt-10 bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl">
        <h2 className="mb-4 text-xl">📋 Tus envíos</h2>

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

              {/* 🔥 BOTÓN MAPA (LO QUE TE FALTABA) */}
              <Link
                to={`/map/${s.code}`}
                className="inline-block mt-3 bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 text-black px-4 py-2 rounded-lg font-bold hover:scale-105 transition"
              >
                Ver mapa 🗺️
              </Link>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;