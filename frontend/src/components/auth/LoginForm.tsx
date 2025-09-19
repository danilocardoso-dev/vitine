import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type Props = {
  switchTab: (tab: "login" | "register" | "lojista") => void;
};

export default function LoginForm({ switchTab }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://vitine-production.up.railway.app/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Credenciais inválidas");

      const data = await res.json();

      // Verifica lojistas
      const lojistaRes = await fetch("https://vitine-production.up.railway.app/lojistas/my", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (lojistaRes.ok) {
        const lojistas = await lojistaRes.json();
        if (lojistas.length > 0) {
          login(data.token, data.user, lojistas[0].id);
          navigate("/admin");
        } else {
          login(data.token, data.user);
          switchTab("lojista");
        }
      } else {
        login(data.token, data.user);
        switchTab("lojista");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <h2 className="text-2xl font-bold text-destaque text-center">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        className="input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        className="input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button className="btn w-full">Entrar</button>
      <p className="text-sm text-center text-gray-400">
        Não tem conta?{" "}
        <span
          onClick={() => switchTab("register")}
          className="text-destaque cursor-pointer"
        >
          Registre-se
        </span>
      </p>
    </form>
  );
}