// src/components/admin/PedidoModal.tsx
type PedidoItem = {
  id: number;
  quantidade: number;
  precoUnit: number;
  tamanho?: string;
  cor?: string;
  produto?: {
    id: number;
    nome: string;
    categoria?: string;
    imagens?: string[];
    tamanhos?: string[];
    cores?: string[];
    preco?: number | string;
  };
};

type Pedido = {
  id: number;
  numeroVenda: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone?: string;
  clienteEndereco?: string;
  observacoes?: string;
  total: number;
  status: string;
  itens: PedidoItem[];
  createdAt?: string;
};

type Props = {
  pedido: Pedido | null;
  onClose: () => void;
  onStatusChange: (id: number, novoStatus: string) => void;
};

// Helper para cor do status
const getStatusColor = (status: string): string => {
  switch (status?.toLowerCase()) {
    case "pendente": return "bg-yellow-600 text-white";
    case "pago": return "bg-green-600 text-white";
    case "enviado": return "bg-blue-600 text-white";
    case "cancelado": return "bg-red-600 text-white";
    default: return "bg-gray-600 text-white";
  }
};

export default function PedidoModal({ pedido, onClose, onStatusChange }: Props) {
  if (!pedido) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Data não disponível";
    try {
      return new Date(dateString).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit", 
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return "Data inválida";
    }
  };

  const formatPrice = (valor: number | string | null | undefined): string => {
    const numeric = Number(valor);
    if (isNaN(numeric)) return "0,00";
    return numeric.toFixed(2).replace(".", ",");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative shadow-xl">
        {/* Header com botão fechar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-destaque">
            Pedido #{pedido.numeroVenda || pedido.id}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            ✖
          </button>
        </div>

        {/* Status e Data */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span>Status:</span>
            <span className={`px-3 py-1 rounded text-sm font-semibold ${getStatusColor(pedido.status)}`}>
              {pedido.status || "pendente"}
            </span>
          </div>
          <p className="text-sm text-gray-400">
            Pedido feito em: {formatDate(pedido.createdAt)}
          </p>
        </div>

        {/* Informações do cliente */}
        <div className="mb-6 bg-gray-800 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-destaque">Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <p><strong>Nome:</strong> {pedido.clienteNome || "Não informado"}</p>
            <p><strong>Email:</strong> {pedido.clienteEmail || "Não informado"}</p>
            {pedido.clienteTelefone && (
              <p><strong>Telefone:</strong> {pedido.clienteTelefone}</p>
            )}
            {pedido.clienteEndereco && (
              <p className="md:col-span-2"><strong>Endereço:</strong> {pedido.clienteEndereco}</p>
            )}
            {pedido.observacoes && (
              <p className="md:col-span-2"><strong>Observações:</strong> {pedido.observacoes}</p>
            )}
          </div>
        </div>

        {/* Lista de itens */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-destaque">Itens do Pedido</h3>
          
          {!pedido.itens || pedido.itens.length === 0 ? (
            <p className="text-gray-400">Nenhum item encontrado neste pedido.</p>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {pedido.itens.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center justify-between bg-gray-800 p-4 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    {/* Imagem do produto */}
                    {item.produto?.imagens && item.produto.imagens.length > 0 ? (
                      <img
                        src={item.produto.imagens[0]}
                        alt={item.produto?.nome || "Produto"}
                        className="w-16 h-16 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiM0NzQ3NDciLz48dGV4dCB4PSIzMiIgeT0iMzIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNGRkYiIGZvbnQtc2l6ZT0iMjQiPjwvdGV4dD48L3N2Zz4=";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center bg-gray-700 rounded text-gray-500 text-2xl">
                        📦
                      </div>
                    )}

                    {/* Detalhes do produto */}
                    <div>
                      <p className="font-semibold text-white">
                        {item.produto?.nome || "Produto removido"}
                      </p>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Categoria: {item.produto?.categoria || "N/A"}</p>
                        <p>Quantidade: {item.quantidade || 0}</p>
                        {item.tamanho && <p>Tamanho: {item.tamanho}</p>}
                        {item.cor && <p>Cor: {item.cor}</p>}
                        <p>Preço unitário: R$ {formatPrice(item.precoUnit)}</p>
                        <p>Cor: {item.cor || "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal do item */}
                  <div className="text-right">
                    <p className="font-bold text-destaque text-lg">
                      R$ {formatPrice((item.quantidade || 0) * (item.precoUnit || 0))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rodapé com total e ações */}
        <div className="border-t border-gray-700 pt-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Total */}
            <div className="text-right">
              <p className="text-2xl font-bold text-destaque">
                Total: R$ {formatPrice(pedido.total)}
              </p>
            </div>

            {/* Botões de ação */}
            <div className="flex gap-3">
              {pedido.status === "pendente" && (
                <>
                  <button
                    onClick={() => onStatusChange(pedido.id, "pago")}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                  >
                    ✅ Confirmar Pagamento
                  </button>
                  <button
                    onClick={() => onStatusChange(pedido.id, "cancelado")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    ❌ Cancelar Pedido
                  </button>
                </>
              )}

              {pedido.status === "pago" && (
                <>
                  <button
                    onClick={() => onStatusChange(pedido.id, "enviado")}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    🚚 Marcar como Enviado
                  </button>
                  <button
                    onClick={() => onStatusChange(pedido.id, "cancelado")}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    ❌ Cancelar Pedido
                  </button>
                </>
              )}

              {pedido.status === "enviado" && (
                <div className="text-green-400 font-semibold">
                  ✅ Pedido enviado com sucesso!
                </div>
              )}

              {pedido.status === "cancelado" && (
                <button
                  onClick={() => onStatusChange(pedido.id, "pendente")}
                  className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition-colors"
                >
                  🔄 Reativar Pedido
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}