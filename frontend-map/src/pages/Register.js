import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">

      {/* FONDO */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#001f54] to-[#0f172a]" />

      {/* LUCES */}
      <div className="absolute w-[500px] h-[500px] bg-yellow-400 opacity-20 blur-[120px] top-0 left-0" />
      <div className="absolute w-[400px] h-[400px] bg-red-500 opacity-20 blur-[120px] bottom-0 right-0" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 p-10 rounded-3xl shadow-2xl w-[380px]"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Crear cuenta 🇨🇴
        </h2>

        <input
          placeholder="Nombre"
          className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white"
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          placeholder="Correo"
          className="w-full p-3 mb-4 rounded-xl bg-white/20 text-white"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-3 mb-6 rounded-xl bg-white/20 text-white"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-gradient-to-r from-yellow-400 via-blue-500 to-red-500 p-3 rounded-xl font-bold text-black hover:scale-105 transition">
          Registrarse 🚀
        </button>
      </form>
    </div>
  );
}

export default Register;