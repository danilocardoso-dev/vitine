// src/components/checkout/CheckoutForm.tsx
import { useState } from "react";

type Props = {
  onSubmit: (data: any) => void;
};

export default function CheckoutForm({ onSubmit }: Props) {
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    endereco: "",
    cidade: "",
    estado: "",
    cep: "",
    observacoes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="nome" placeholder="Nome" onChange={handleChange} className="input" required />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} className="input" required />
      <input name="telefone" placeholder="Telefone" onChange={handleChange} className="input" />
      <input name="endereco" placeholder="Endereço" onChange={handleChange} className="input" required />
      <input name="cidade" placeholder="Cidade" onChange={handleChange} className="input" required />
      <input name="estado" placeholder="Estado" onChange={handleChange} className="input" required />
      <input name="cep" placeholder="CEP" onChange={handleChange} className="input" required />
      <textarea name="observacoes" placeholder="Observações" onChange={handleChange} className="input" />
      <button type="submit" className="btn w-full">Finalizar Pedido</button>
    </form>
  );
}