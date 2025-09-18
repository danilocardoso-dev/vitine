import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Props = {
  switchTab: (tab: "login" | "register" | "lojista") => void;
};

export default function RegisterForm({ switchTab }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("Erro ao registrar usuário");

      // login automático
      const loginRes = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await loginRes.json();
      login(data.token, data.user);

      // redireciona para lojista
      switchTab("lojista");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4">
      <h2 className="text-2xl font-bold text-destaque text-center">Criar Conta</h2>
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        placeholder="Nome"
        className="input"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
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
      <button className="btn w-full">Registrar</button>
      <p className="text-sm text-center text-gray-400">
        Já tem conta?{" "}
        <span
          onClick={() => switchTab("login")}
          className="text-destaque cursor-pointer"
        >
          Login
        </span>
      </p>
    </form>
  );
}