// src/components/admin/AdminPedidos.tsx
import { useEffect, useState } from "react";
import PedidoModal from "./AdminModal";

type Pedido = {
  id: number;
  numeroVenda: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  clienteEndereco?: string;
  total: number;
  status: string;
  itens: any[];
  createdAt?: string;
};

const formatPrice = (valor: number): string => {
  return valor.toFixed(2).replace(".", ",");
};

const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "pendente": return "bg-yellow-600 text-white";
    case "pago": return "bg-green-600 text-white";
    case "enviado": return "bg-blue-600 text-white";
    case "cancelado": return "bg-red-600 text-white";
    default: return "bg-gray-600 text-white";
  }
};

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://vitine-production.up.railway.app/pedidos")
      .then(res => res.json())
      .then((data) => {
        const pedidosFormatados: Pedido[] = data.map((p: any) => ({
          ...p,
          total: Number(p.valorTotal) || 0,
        }));
        setPedidos(pedidosFormatados);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erro ao carregar pedidos:", err);
        setLoading(false);
      });
  }, []);

  // 👈 Função para atualizar status
  const atualizarStatus = async (id: number, novoStatus: string) => {
    try {
      const res = await fetch(`https://vitine-production.up.railway.app/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });

      if (res.ok) {
        setPedidos(prev => 
          prev.map(p => p.id === id ? { ...p, status: novoStatus } : p)
        );
        alert(`Pedido marcado como: ${novoStatus}`);
        setPedidoSelecionado(null); // fecha o modal
      }
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      alert("Erro ao atualizar status do pedido");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Carregando pedidos...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-destaque">Pedidos Recebidos</h2>

      {pedidos.length === 0 ? (
        <p className="text-gray-400">Nenhum pedido encontrado.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-gray-900 text-white rounded shadow">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left"># Venda</th>
                <th className="p-3 text-left">Cliente</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map(pedido => (
                <tr
                  key={pedido.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => setPedidoSelecionado(pedido)}
                >
                  <td className="p-3 font-mono text-sm">{pedido.numeroVenda}</td>
                  <td className="p-3">{pedido.clienteNome}</td>
                  <td className="p-3 text-sm text-gray-300">{pedido.clienteEmail}</td>
                  <td className="p-3 text-center font-semibold text-destaque">
                    R$ {formatPrice(pedido.total)}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(pedido.status)}`}
                    >
                      {pedido.status || "pendente"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal com função de atualizar status */}
      {pedidoSelecionado && (
        <PedidoModal
          pedido={pedidoSelecionado}
          onClose={() => setPedidoSelecionado(null)}
          onStatusChange={atualizarStatus} // 👈 agora passa a função
        />
      )}
    </div>
  );
}