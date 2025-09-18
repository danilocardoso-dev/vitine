// src/components/admin/AdminHeader.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminHeader() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // 🔑 limpa token, user, lojistaId
    navigate("/auth"); // 🔑 redireciona para página de auth
  };

  return (
    <header className="bg-gray-900 p-4 flex justify-between items-center shadow-md">
      {/* Logo + Título */}
      <div className="flex items-center space-x-3">
        <img
          src="/logo_semfundo.png" // Coloque sua logo em public/logo.png
          alt="Logo"
          className="h-10 w-auto"
        />
        <h1 className="text-destaque text-xl font-bold">Painel do Administrador</h1>
      </div>

      {/* Botão sair */}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-semibold transition-colors"
      >
        Sair
      </button>
    </header>
  );
}