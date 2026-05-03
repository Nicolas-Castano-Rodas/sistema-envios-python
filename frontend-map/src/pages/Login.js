import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔥 Simulación login
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* 🌆 FONDO LATAM */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f172a] via-[#001f54] to-black" />

      {/* 🌈 GLOW COLOMBIA */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-400 opacity-20 blur-[120px] top-[-100px] left-[-100px]" />
      <div className="absolute w-[400px] h-[400px] bg-blue-600 opacity-20 blur-[120px] bottom-[-100px] right-[-100px]" />
      <div className="absolute w-[300px] h-[300px] bg-red-600 opacity-20 blur-[120px] bottom-[100px] left-[200px]" />

      {/* 🧊 CARD */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-[380px]"
      >
        {/* 🔥 LOGO */}
        <h1 className="text-3xl font-extrabold text-center mb-2">
          <span className="text-yellow-400">Envíos</span>{" "}
          <span className="text-blue-400">CO</span>
        </h1>

        <p className="text-center text-gray-300 mb-6">
          Conectando Colombia 🚚
        </p>

        <input
          type="email"
          placeholder="Correo"
          className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-yellow-400"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 mb-6 rounded-xl bg-white/20 text-white placeholder-gray-300 outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 p-3 rounded-xl font-bold text-black hover:scale-105 transition">
          Entrar 🚀
        </button>
      </form>
    </div>
  );
}

export default Login;