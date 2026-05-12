import { SubmitEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../actions/auth/login';

export default function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRealLogin = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request = {
        username,
        password,
      };

      const response = await login(request);

      localStorage.setItem('accessToken', response.accessToken);

      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1a1a1a] font-sans">
      {/* Panel Izquierdo */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/3 bg-[#8b0000] border-r-4 border-[#660000] shadow-2xl z-10">
        <h1 className="text-4xl font-black text-[#d4af37] mb-6 tracking-wider shadow-sm">
          DRAGON DORADO
        </h1>
        <p className="text-white/90 text-sm mb-8 tracking-wide">
          Sistema de Gestión de Pedidos
        </p>
        <p className="text-white/60 text-xs">v1.0 - 2026</p>
      </div>

      {/* Panel Derecho - Formulario de Login */}
      <div className="flex flex-col justify-center items-center w-full md:w-2/3 p-4">
        {/* Tarjeta de Autenticación */}
        <div className="bg-[#2a2a2a] w-full max-w-md p-10 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.5)] border-t-2 border-[#d4af37]">
          <h2 className="text-2xl font-bold text-[#d4af37] text-center mb-8">
            Iniciar Sesión
          </h2>

          <form className="space-y-6" onSubmit={handleRealLogin}>
            {/* Input Usuario */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Usuario / Correo</label>
              <input
                type="text"
                placeholder="Ej: admin_chifa"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-[#1e1e1e] border border-gray-600 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-colors placeholder-gray-500"
              />
            </div>

            {/* Input Contraseña */}
            <div className="space-y-2">
              <label className="text-sm text-gray-300">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[#1e1e1e] border border-gray-600 text-white rounded-md px-4 py-3 focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-colors placeholder-gray-500"
              />
            </div>

            {/* Botón Ingresar */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full font-bold py-3 px-4 rounded-md transition-all duration-200 mt-4 shadow-lg ${
                isLoading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-[#d4af37] hover:bg-[#f1c40f] text-[#1a1a1a] hover:shadow-xl hover:-translate-y-0.5'
              }`}
            >
              {isLoading ? 'CONECTANDO...' : 'INGRESAR AL SISTEMA'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
