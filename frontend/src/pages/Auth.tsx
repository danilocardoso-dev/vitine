import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import LojistaForm from "../components/auth/LogistaForm";

type TabType = "login" | "register" | "lojista";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<TabType>("login");
  const { token, user, lojistaId } = useAuth();
  const navigate = useNavigate();

  // Se já está logado e tem lojista, redireciona para admin
  useEffect(() => {
    if (token && user && lojistaId) {
      navigate("/admin");
    }
  }, [token, user, lojistaId, navigate]);

  // Se está logado mas não tem lojista, força tab lojista
  useEffect(() => {
    if (token && user && !lojistaId) {
      setActiveTab("lojista");
    }
  }, [token, user, lojistaId]);

  const switchTab = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-fundo text-white p-4">
      <div className="bg-black p-8 rounded-lg shadow-lg w-full max-w-2xl border border-destaque">
        
        {/* Header com tabs (só mostra se não estiver na tab lojista obrigatória) */}
        {!(token && user && !lojistaId) && (
          <div className="flex justify-center mb-8 border-b border-gray-700">
            <button
              onClick={() => switchTab("login")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "login"
                  ? "text-destaque border-b-2 border-destaque"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab("register")}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === "register"
                  ? "text-destaque border-b-2 border-destaque"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Cadastrar
            </button>
            {token && user && (
              <button
                onClick={() => switchTab("lojista")}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === "lojista"
                    ? "text-destaque border-b-2 border-destaque"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Minha Loja
              </button>
            )}
          </div>
        )}

        {/* Mensagem especial quando precisa cadastrar lojista */}
        {token && user && !lojistaId && activeTab === "lojista" && (
          <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-destaque">
            <h3 className="text-destaque font-bold mb-2">🎉 Bem-vindo, {user.name}!</h3>
            <p className="text-gray-300 text-sm">
              Para começar a vender, precisamos que você complete o cadastro da sua loja.
            </p>
          </div>
        )}

        {/* Renderização condicional dos formulários */}
        <div className="transition-all duration-300">
          {activeTab === "login" && <LoginForm switchTab={switchTab} />}
          {activeTab === "register" && <RegisterForm switchTab={switchTab} />}
          {activeTab === "lojista" && <LojistaForm />}
        </div>

        {/* Footer com informações */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            Sistema Vitrine Moda - Link Start
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Sua plataforma de vendas online
          </p>
        </div>
      </div>
    </div>
  );
}