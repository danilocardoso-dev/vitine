// src/pages/ObrigadoPage.tsx
import { useLocation, useNavigate } from "react-router-dom";

export default function ObrigadoPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const pedidoId = location.state?.pedidoId;

  return (
    <div className="p-6 max-w-xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-destaque mb-4">Obrigado pelo seu pedido!</h1>
      <p className="mb-4">
        Seu pedido {pedidoId ? `#${pedidoId}` : ""} foi recebido com sucesso.
      </p>
      <p className="mb-6">
        Em breve, a loja entrará em contato para confirmar os detalhes e o pagamento.
      </p>
      <button
        onClick={() => navigate("/")}
        className="bg-destaque text-black px-6 py-3 rounded font-semibold hover:bg-blue-400 transition"
      >
        Voltar para a loja
      </button>
    </div>
  );
}