// src/components/ProductCard.tsx
import { useState } from "react";
import ProductModal from "./ProductModal";

type Produto = {
  id: number;
  nome: string;
  descricao?: string;
  preco: number | string;
  categoria: string;
  tamanhos: string[];
  cores: string[];
  imagens: string[];
  estoque: number;
  isActive: boolean;
  lojista?: {
    id: number;
    nome: string;
    cidade?: string;
    estado?: string;
  };
};

type Props = {
  produto: Produto;
};

export default function ProductCard({ produto }: Props) {
  const [showModal, setShowModal] = useState(false);

  const formatPrice = (preco: number | string): string => {
    const numeric = Number(preco);
    return !isNaN(numeric) ? numeric.toFixed(2) : "0.00";
  };

  const primaryImage = produto.imagens && produto.imagens.length > 0 
    ? produto.imagens[0] 
    : null;

  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="w-full text-left bg-gray-900 rounded-lg shadow hover:shadow-lg transition overflow-hidden transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-destaque"
          aria-label={`Ver detalhes de ${produto.nome}`}
        >
          {primaryImage ? (
            <img
              src={primaryImage}
              alt={produto.nome}
              // altura aumentada para h-72 (288px)
              className="w-full h-72 object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0NzQ3NDciLz48dGV4dCB4PSI1MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNGRkYiIGZvbnQtc2l6ZT0iMTQiPjwvdGV4dD48L3N2Zz4=";
              }}
            />
          ) : (
            <div className="w-full h-72 flex items-center justify-center bg-gray-800 text-gray-500">📦</div>
          )}

          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-lg flex-1 mr-2">{produto.nome}</h3>
              {produto.estoque <= 5 && produto.estoque > 0 && (
                <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">Últimas unidades</span>
              )}
              {produto.estoque === 0 && (
                <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">Esgotado</span>
              )}
            </div>

            <p className="text-sm text-gray-400 mb-2">{produto.categoria}</p>

            <div className="flex justify-between items-center">
              <p className="text-xl font-medium text-destaque">R$ {formatPrice(produto.preco)}</p>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setShowModal(true); }}
                className="bg-destaque text-black px-3 py-1 rounded text-sm hover:opacity-80 transition focus:outline-none focus:ring-2 focus:ring-destaque"
              >
                Ver detalhes
              </button>
            </div>
          </div>
        </button>
      </div>

      {showModal && <ProductModal produto={produto} onClose={() => setShowModal(false)} />}
    </>
  );
}