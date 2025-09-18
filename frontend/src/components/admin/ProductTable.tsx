// src/components/admin/ProductTable.tsx
type Produto = {
  id: number;
  nome: string;
  descricao?: string;
  preco: number | string; // pode vir como string do Prisma
  categoria: string;
  tamanhos: string[];
  cores: string[];
  imagens: string[];
  estoque: number;
  isActive: boolean;
  lojistaId: number;
  lojista?: {
    id: number;
    nome: string;
  };
};

type Props = {
  produtos: Produto[];
  onEdit: (produto: Produto) => void;
  onDelete: (id: number) => void;
};

export default function ProductTable({ produtos, onEdit, onDelete }: Props) {
  const formatPrice = (preco: number | string): string => {
    const numericPrice = Number(preco);
    return !isNaN(numericPrice) ? numericPrice.toFixed(2) : "0.00";
  };

  const truncateText = (text: string, maxLength: number = 30): string => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full bg-gray-900 text-white rounded shadow">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 text-left">Imagem</th>
            <th className="p-3 text-left">Nome</th>
            <th className="p-3 text-left">Categoria</th>
            <th className="p-3 text-center">Preço</th>
            <th className="p-3 text-center">Estoque</th>
            <th className="p-3 text-center">Status</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          {produtos.length === 0 ? (
            <tr>
              <td colSpan={7} className="p-8 text-center text-gray-400">
                Nenhum produto cadastrado
              </td>
            </tr>
          ) : (
            produtos.map((produto) => (
              <tr key={produto.id} className="border-b border-gray-700 hover:bg-gray-800">
                {/* Imagem */}
                <td className="p-3">
                  {produto.imagens && produto.imagens.length > 0 ? (
                    <img
                      src={produto.imagens[0]}
                      alt={produto.nome}
                      className="w-12 h-12 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjNDc0NzQ3Ii8+Cjx0ZXh0IHg9IjI0IiB5PSIyNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI0ZGRiIgZm9udC1zaXplPSIxNiI+📦</dGV4dD4KPC9zdmc+Cg==';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center text-gray-500">
                      📦
                    </div>
                  )}
                </td>

                {/* Nome */}
                <td className="p-3">
                  <div>
                    <p className="font-semibold">{truncateText(produto.nome)}</p>
                    {produto.descricao && (
                      <p className="text-sm text-gray-400">
                        {truncateText(produto.descricao, 40)}
                      </p>
                    )}
                  </div>
                </td>

                {/* Categoria */}
                <td className="p-3">
                  <span className="bg-gray-700 px-2 py-1 rounded text-sm">
                    {produto.categoria}
                  </span>
                </td>

                {/* Preço */}
                <td className="p-3 text-center font-bold text-destaque">
                  R$ {formatPrice(produto.preco)}
                </td>

                {/* Estoque */}
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${
                    produto.estoque > 10 
                      ? 'bg-green-600 text-white' 
                      : produto.estoque > 0 
                        ? 'bg-yellow-600 text-white' 
                        : 'bg-red-600 text-white'
                  }`}>
                    {produto.estoque}
                  </span>
                </td>

                {/* Status */}
                <td className="p-3 text-center">
                  <span className={`px-2 py-1 rounded text-sm ${
                    produto.isActive 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-600 text-white'
                  }`}>
                    {produto.isActive ? "Ativo" : "Inativo"}
                  </span>
                </td>

                {/* Ações */}
                <td className="p-3">
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={() => onEdit(produto)}
                      className="bg-destaque text-black px-3 py-1 rounded text-sm hover:opacity-80 transition"
                      title="Editar produto"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Tem certeza que deseja excluir "${produto.nome}"?`)) {
                          onDelete(produto.id);
                        }
                      }}
                      className="bg-red-500 px-3 py-1 rounded text-sm text-white hover:bg-red-600 transition"
                      title="Excluir produto"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Informações adicionais */}
      {produtos.length > 0 && (
        <div className="mt-4 text-sm text-gray-400 flex justify-between">
          <span>Total: {produtos.length} produto(s)</span>
          <span>
            Ativos: {produtos.filter(p => p.isActive).length} | 
            Inativos: {produtos.filter(p => !p.isActive).length}
          </span>
        </div>
      )}
    </div>
  );
}