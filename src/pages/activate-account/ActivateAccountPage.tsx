import { SubmitEvent, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { activateAccount } from '../../actions/auth/activate-account';

export default function ActivateAccountPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error('Token de activación inválido');
      navigate('/login');
    }
  }, [token, navigate]);

  async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.warning('Completa todos los campos');
      return;
    }

    if (password.length < 6) {
      toast.warning('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (password !== confirmPassword) {
      toast.warning('Las contraseñas no coinciden');
      return;
    }

    if (!token) return;

    try {
      setIsLoading(true);

      const response = await activateAccount({
        accountActivationToken: token,
        newPassword: password,
      });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      setIsActivated(true);
      setIsLoading(false);

      toast.success('Cuenta activada correctamente');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-chifa-black flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-chifa-gold/20 bg-[#1a1a1a] p-8 shadow-2xl">
        {!isActivated ? (
          <>
            <div className="mb-8 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-chifa-gold/10">
                <ShieldCheck className="h-8 w-8 text-chifa-gold" />
              </div>

              <h1 className="text-3xl font-bold text-white">Activar Cuenta</h1>

              <p className="mt-2 text-sm text-gray-400">
                Crea tu nueva contraseña para ingresar al sistema Dragon Dorado.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Nueva contraseña
                </label>

                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                  <input
                    type="password"
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-[#121212] py-3 pl-10 pr-4 text-white outline-none transition focus:border-chifa-gold"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-300">
                  Confirmar contraseña
                </label>

                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                  <input
                    type="password"
                    placeholder="********"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-700 bg-[#121212] py-3 pl-10 pr-4 text-white outline-none transition focus:border-chifa-gold"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-chifa-gold px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Activando...
                  </>
                ) : (
                  'Activar cuenta'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-10 w-10 text-green-500" />
            </div>

            <h2 className="text-2xl font-bold text-white">Cuenta activada</h2>

            <p className="mt-3 text-gray-400">
              Tu cuenta fue activada correctamente. Redirigiendo...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
