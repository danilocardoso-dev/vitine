// src/pages/VitrinePage.tsx
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Header from "../components/Header";

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

export default function VitrinePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [categoria, setCategoria] = useState("todos");

  useEffect(() => {
    fetch("http://localhost:3001/produtos?include=lojista")
      .then(res => res.json())
      .then((data: Produto[]) => setProdutos(data))
      .catch(err => console.error("Erro ao carregar produtos:", err));
  }, []);

  const categorias = ["todos", ...new Set(produtos.map(p => p.categoria))];

  const produtosFiltrados = produtos.filter(p => {
    const matchBusca = p.nome.toLowerCase().includes(busca.toLowerCase());
    const matchCategoria = categoria === "todos" || p.categoria === categoria;
    return matchBusca && matchCategoria;
  });

  return (
    <div className="min-h-screen bg-fundo text-complementar">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <input
            type="text"
            placeholder="Buscar produto..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 w-full md:w-1/3"
          />

          <select
            value={categoria}
            onChange={e => setCategoria(e.target.value)}
            className="px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 w-full md:w-1/4"
          >
            {categorias.map((c, idx) => (
              <option key={idx} value={c}>
                {c[0].toUpperCase() + c.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Produtos */}
        {produtosFiltrados.length === 0 ? (
          <p className="text-center text-gray-400">Nenhum produto encontrado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {produtosFiltrados.map(produto => (
              <ProductCard key={produto.id} produto={produto} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}