import { Link } from "react-router-dom";

export default function PedidoSucessoPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-fundo text-complementar px-4">
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg max-w-lg text-center">
        <h1 className="text-destaque text-4xl font-bold mb-4">
          🎉 Pedido realizado com sucesso!
        </h1>
        <p className="text-gray-300 mb-6">
          Recebemos sua solicitação e em breve o lojista entrará em contato.
          Obrigado por comprar com a{" "}
          <span className="text-destaque font-semibold">Link Start</span> 💙
        </p>

        <div className="space-y-3">
          <Link
            to="/vitrine"
            className="block bg-destaque text-fundo font-bold py-3 px-6 rounded-lg hover:bg-opacity-80 transition-colors"
          >
            Voltar à Vitrine
          </Link>

          <Link
            to="/carrinho"
            className="block bg-gray-700 text-complementar font-medium py-2 px-6 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Ver Carrinho
          </Link>
        </div>
      </div>
    </div>
  );
}