// src/components/ProductModal.tsx
import { useState } from "react";
import { useCart } from "../context/CartContext";

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
  onClose: () => void;
};

export default function ProductModal({ produto, onClose }: Props) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const formatPrice = (preco: number | string): string => {
    const numeric = Number(preco);
    return !isNaN(numeric) ? numeric.toFixed(2) : "0.00";
  };

  const handleAddToCart = () => {
    if (produto.tamanhos.length > 0 && !selectedSize) {
      alert("Selecione um tamanho");
      return;
    }
    if (produto.cores.length > 0 && !selectedColor) {
      alert("Selecione uma cor");
      return;
    }
    if (quantity > produto.estoque) {
      alert("Quantidade indisponível em estoque");
      return;
    }

    addToCart({
      id: produto.id,
      nome: produto.nome,
      preco: Number(produto.preco),
      quantidade: quantity,
      imagem: produto.imagens[0] || "",
      tamanho: selectedSize,
      cor: selectedColor,
      lojistaId: produto.lojista ? produto.lojista.id : 1, // Adiciona lojistaId, padrão 1 se não houver lojista
    });

    alert("Produto adicionado ao carrinho!");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center"
        >
          ✖
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          {/* Galeria de imagens */}
          <div>
            {produto.imagens.length > 0 ? (
              <>
                <img
                  src={produto.imagens[selectedImage]}
                  alt={produto.nome}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiM0NzQ3NDciLz48dGV4dCB4PSI1MCIgeT0iNTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNGRkYiIGZvbnQtc2l6ZT0iMTQiPjwvdGV4dD48L3N2Zz4=";
                  }}
                />
                {produto.imagens.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto">
                    {produto.imagens.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${produto.nome} ${index + 1}`}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          selectedImage === index ? "border-destaque" : "border-gray-600"
                        }`}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-800 text-gray-500 rounded-lg">
                📦 Sem imagem
              </div>
            )}
          </div>

          {/* Informações do produto */}
          <div className="space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{produto.nome}</h1>
              <p className="text-lg text-gray-400">{produto.categoria}</p>
            </div>

            {produto.descricao && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Descrição</h3>
                <p className="text-gray-300">{produto.descricao}</p>
              </div>
            )}

            {/* Lojista */}
            {produto.lojista && (
              <div className="bg-gray-800 p-3 rounded">
                <h3 className="text-sm font-semibold mb-1">Vendido por:</h3>
                <p className="text-destaque font-medium">{produto.lojista.nome}</p>
                {produto.lojista.cidade && (
                  <p className="text-sm text-gray-400">
                    {produto.lojista.cidade}{produto.lojista.estado && `, ${produto.lojista.estado}`}
                  </p>
                )}
              </div>
            )}

            {/* Preço */}
            <div className="bg-gray-800 p-4 rounded">
              <p className="text-3xl font-bold text-destaque">
                R$ {formatPrice(produto.preco)}
              </p>
              <p className="text-sm text-gray-400">
                Estoque: {produto.estoque} unidade(s)
              </p>
            </div>

            {/* Tamanhos */}
            {produto.tamanhos.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {produto.tamanhos.map(tamanho => (
                    <button
                      key={tamanho}
                      onClick={() => setSelectedSize(tamanho)}
                      className={`px-3 py-2 rounded border ${
                        selectedSize === tamanho
                          ? "border-destaque bg-destaque text-black"
                          : "border-gray-600 hover:border-destaque"
                      }`}
                    >
                      {tamanho}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Cores */}
            {produto.cores.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Cor</h3>
                <div className="flex flex-wrap gap-2">
                  {produto.cores.map(cor => (
                    <button
                      key={cor}
                      onClick={() => setSelectedColor(cor)}
                      className={`px-3 py-2 rounded border ${
                        selectedColor === cor
                          ? "border-destaque bg-destaque text-black"
                          : "border-gray-600 hover:border-destaque"
                      }`}
                    >
                      {cor}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantidade */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Quantidade</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(produto.estoque, quantity + 1))}
                  className="bg-gray-700 px-3 py-2 rounded hover:bg-gray-600"
                >
                  +
                </button>
              </div>
            </div>

            {/* Botão adicionar ao carrinho */}
            <button
              onClick={handleAddToCart}
              disabled={produto.estoque === 0}
              className={`w-full py-3 rounded font-bold text-lg transition ${
                produto.estoque === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-destaque text-black hover:opacity-80"
              }`}
            >
              {produto.estoque === 0 ? "Produto Esgotado" : "Adicionar ao Carrinho"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}