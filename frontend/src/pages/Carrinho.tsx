import { useCart } from "../context/CartContext";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";

export default function CarrinhoPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Header />
      <h1 className="text-2xl font-bold mb-6">Meu Carrinho</h1>
      
      {cart.length === 0 ? (
        <p className="text-gray-400">Seu carrinho está vazio.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div key={`${item.id}-${item.tamanho}-${item.cor}`} className="flex justify-between items-center border-b border-gray-700 py-4">
              <div className="flex items-center gap-4">
                {item.imagem && (
                  <img src={item.imagem} alt={item.nome} className="w-16 h-16 object-cover rounded" />
                )}
                <div>
                  <p className="font-semibold">{item.nome}</p>
                  {item.tamanho && <p className="text-sm text-gray-400">Tamanho: {item.tamanho}</p>}
                  {item.cor && <p className="text-sm text-gray-400">Cor: {item.cor}</p>}
                  <p className="text-sm">Qtd: {item.quantidade}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:underline text-sm"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold">Total: R$ {total.toFixed(2)}</p>
            <div className="flex gap-3">
              <button 
                onClick={clearCart} 
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-500"
              >
                Limpar Carrinho
              </button>
              <button
                onClick={() => navigate("/checkout")} // 👈 leva para página de checkout
                className="px-6 py-2 bg-destaque text-black font-bold rounded hover:opacity-80"
              >
                Finalizar Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}