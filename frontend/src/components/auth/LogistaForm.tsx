import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LojistaForm() {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    plano: "basico",
  });
  const [error, setError] = useState("");
  const { token, setLojistaId } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("https://vitine-production.up.railway.app/lojistas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Erro ao cadastrar lojista");

      const data = await res.json();
      setLojistaId(data.id);
      alert("Loja cadastrada com sucesso!");
      navigate("/admin");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <h2 className="md:col-span-2 text-2xl font-bold text-destaque text-center">Cadastro da Loja</h2>
      {error && <p className="text-red-500 md:col-span-2">{error}</p>}

      <input id="nome" placeholder="Nome da Loja" className="input md:col-span-2" value={form.nome} onChange={handleChange} required />
      <input id="email" placeholder="Email da Loja" className="input" value={form.email} onChange={handleChange} required />
      <input id="telefone" placeholder="Telefone" className="input" value={form.telefone} onChange={handleChange} />
      <input id="endereco" placeholder="Endereço" className="input md:col-span-2" value={form.endereco} onChange={handleChange} />
      <input id="cidade" placeholder="Cidade" className="input" value={form.cidade} onChange={handleChange} />
      <input id="estado" placeholder="Estado" className="input" value={form.estado} onChange={handleChange} />
      <input id="cep" placeholder="CEP" className="input md:col-span-2" value={form.cep} onChange={handleChange} />
      <select id="plano" className="input md:col-span-2" value={form.plano} onChange={handleChange}>
        <option value="basico">Básico</option>
        <option value="premium">Premium</option>
      </select>

      <button className="btn md:col-span-2">Cadastrar Loja</button>
    </form>
  );
}