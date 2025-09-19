// src/pages/CheckoutPage.tsx
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import CheckoutForm from "../components/checkout/checkoutForm";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = async (form: any) => {
    const pedido = {
      clienteNome: form.nome,
      clienteEmail: form.email,
      clienteTelefone: form.telefone,
      clienteEndereco: `${form.endereco}, ${form.cidade} - ${form.estado}, CEP: ${form.cep}`,
      observacoes: form.observacoes,
      lojistaId: cart[0]?.lojistaId || 1,
      itens: cart.map(item => ({
        produtoId: item.id,
        quantidade: item.quantidade,
        precoUnit: item.preco,
        tamanho: item.tamanho,
        cor: item.cor,
      })),
    };

    const res = await fetch("https://vitine-production.up.railway.app/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(pedido),
    });

    if (!res.ok) {
      const msg = await res.text();
      alert("Erro ao enviar pedido: " + msg);
      return;
    }

    const data = await res.json();
    clearCart();
    // Navega para a página de agradecimento, passando o id do pedido
    navigate("/obrigado", { state: { pedidoId: data.id } });
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-destaque mb-4">Finalizar Pedido</h1>
      <CheckoutForm onSubmit={handleCheckout} />
    </div>
  );
}