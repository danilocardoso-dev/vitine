import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { FaTrash, FaShoppingCart } from "react-icons/fa";

export default function CarrinhoPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <FaShoppingCart className="text-destaque" /> Meu Carrinho
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-16 bg-gray-800 rounded-lg shadow-lg">
            <FaShoppingCart className="mx-auto text-destaque text-6xl mb-4" />
            <p className="text-gray-400 text-lg mb-4">Seu carrinho está vazio.</p>
            <button
              onClick={() => navigate("/")}
              className="bg-destaque text-black font-semibold px-6 py-3 rounded hover:bg-cyan-400 transition"
            >
              Voltar à Vitrine
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div
                key={`${item.id}-${item.tamanho}-${item.cor}`}
                className="flex justify-between items-center bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition"
              >
                <div className="flex items-center gap-4">
                  {item.imagem && (
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-20 h-20 object-cover rounded-lg border border-gray-700"
                    />
                  )}
                  <div>
                    <p className="font-bold text-lg">{item.nome}</p>
                    {item.tamanho && (
                      <p className="text-sm text-gray-400">Tamanho: {item.tamanho}</p>
                    )}
                    {item.cor && (
                      <p className="text-sm text-gray-400">Cor: {item.cor}</p>
                    )}
                    <p className="text-sm text-gray-400">Qtd: {item.quantidade}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-destaque">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="flex items-center gap-2 text-red-500 hover:text-red-400 mt-2 text-sm"
                  >
                    <FaTrash /> Remover
                  </button>
                </div>
              </div>
            ))}

            {/* Resumo do Carrinho */}
            <div className="bg-gray-800 rounded-lg p-6 flex flex-col md:flex-row justify-between items-center shadow-lg">
              <p className="text-2xl font-bold">
                Total: <span className="text-destaque">R$ {total.toFixed(2)}</span>
              </p>
              <div className="flex gap-4 mt-4 md:mt-0">
                <button
                  onClick={clearCart}
                  className="px-5 py-2 bg-gray-700 rounded font-semibold hover:bg-gray-600 transition"
                >
                  Limpar Carrinho
                </button>
                <button
                  onClick={() => navigate("/checkout")}
                  className="px-6 py-3 bg-destaque text-black font-bold rounded hover:bg-cyan-400 transition"
                >
                  Finalizar Pedido
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}