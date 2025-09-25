// src/components/ProductModal.tsx
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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

  // Toggles para reduzir informações por padrão
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showSeller, setShowSeller] = useState(false);

  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "ArrowRight") setSelectedImage(i => Math.min(produto.imagens.length - 1, i + 1));
      if (e.key === "ArrowLeft") setSelectedImage(i => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, produto.imagens.length]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

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
      lojistaId: produto.lojista ? produto.lojista.id : 1,
    });

    alert("Produto adicionado ao carrinho!");
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label={`Detalhes do produto ${produto.nome}`}
      style={{ background: "rgba(0,0,0,0.7)" }}
    >
      {/* REMOVIDO overflow-y-auto do container principal para evitar scroll nativo */}
      <div
        className="bg-gray-900 rounded-lg w-full max-w-3xl max-h-[85vh] relative"
        role="document"
      >
        <button
          ref={closeBtnRef}
          onClick={onClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-gray-300 hover:text-white z-10 bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-destaque"
        >
          ✖
        </button>

        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Coluna esquerda: imagem reduzida */}
          <div className="flex flex-col">
            {produto.imagens && produto.imagens.length > 0 ? (
              <>
                <img
                  src={produto.imagens[selectedImage]}
                  alt={produto.nome}
                  className="w-full h-56 md:h-64 object-cover rounded-lg mb-3"
                  draggable={false}
                />

                {/* Thumbnails — overflow escondido via classe scrollbar-hidden */}
                {produto.imagens.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto scrollbar-hidden">
                    {produto.imagens.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-none w-16 h-16 overflow-hidden rounded ${selectedImage === index ? "ring-2 ring-destaque" : ""}`}
                        aria-label={`Ver imagem ${index + 1}`}
                      >
                        <img src={img} alt={`${produto.nome} ${index + 1}`} className="w-full h-full object-cover" draggable={false} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-56 flex items-center justify-center bg-gray-800 text-gray-500 rounded-lg">
                📦 Sem imagem
              </div>
            )}
          </div>

          {/* Coluna direita: conteúdo condensado */}
          <div className="flex flex-col justify-start gap-3">
            <div>
              <h1 className="text-lg md:text-2xl font-bold text-white leading-tight">{produto.nome}</h1>
              <p className="text-sm text-gray-400 mt-1">{produto.categoria}</p>
            </div>

            <div className="bg-gray-800 p-3 rounded">
              <p className="text-xl md:text-2xl font-bold text-destaque">R$ {formatPrice(produto.preco)}</p>
              <p className="text-sm text-gray-400">Estoque: {produto.estoque}</p>
            </div>

            {/* Descrição truncada com botão ver mais */}
            {produto.descricao && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Descrição</h3>
                <p className="text-gray-300 text-sm">
                  {showFullDescription ? produto.descricao : `${produto.descricao.slice(0, 180)}${produto.descricao.length > 180 ? "..." : ""}`}
                </p>
                {produto.descricao.length > 180 && (
                  <button
                    onClick={() => setShowFullDescription(s => !s)}
                    className="text-sm text-destaque mt-1"
                  >
                    {showFullDescription ? "Ver menos" : "Ver mais"}
                  </button>
                )}
              </div>
            )}

            {/* Lojista escondido por padrão */}
            {produto.lojista && (
              <div>
                <button onClick={() => setShowSeller(s => !s)} className="text-sm text-gray-400">
                  {showSeller ? "Ocultar vendedor" : "Ver vendedor"}
                </button>
                {showSeller && (
                  <div className="mt-2 bg-gray-800 p-2 rounded text-sm">
                    <p className="text-destaque font-medium">{produto.lojista.nome}</p>
                    {produto.lojista.cidade && <p className="text-gray-400 text-xs">{produto.lojista.cidade}{produto.lojista.estado ? `, ${produto.lojista.estado}` : ""}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Tamanhos / cores / quantidade com layout compacto */}
            <div className="flex flex-col gap-2">
              {produto.tamanhos && produto.tamanhos.length > 0 && (
                <div>
                  <h4 className="text-sm text-white mb-1">Tamanho</h4>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {produto.tamanhos.map(t => (
                      <button key={t} onClick={() => setSelectedSize(t)} className={`px-2 py-1 rounded border ${selectedSize === t ? "border-destaque bg-destaque text-black" : "border-gray-600"}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {produto.cores && produto.cores.length > 0 && (
                <div>
                  <h4 className="text-sm text-white mb-1">Cor</h4>
                  <div className="flex gap-2 text-sm">
                    {produto.cores.map(c => (
                      <button key={c} onClick={() => setSelectedColor(c)} className={`px-2 py-1 rounded border ${selectedColor === c ? "border-destaque bg-destaque text-black" : "border-gray-600"}`}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm text-white mb-1">Quantidade</h4>
                <div className="flex items-center gap-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="bg-gray-700 px-2 py-1 rounded">-</button>
                  <span className="w-10 text-center font-bold">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(produto.estoque, quantity + 1))} className="bg-gray-700 px-2 py-1 rounded">+</button>
                </div>
              </div>
            </div>

            <div className="mt-2">
              <button
                onClick={handleAddToCart}
                disabled={produto.estoque === 0}
                className={`w-full py-2 rounded font-bold text-sm transition ${produto.estoque === 0 ? "bg-gray-600 text-gray-400 cursor-not-allowed" : "bg-destaque text-black"}`}
              >
                {produto.estoque === 0 ? "Produto Esgotado" : "Adicionar ao Carrinho"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}