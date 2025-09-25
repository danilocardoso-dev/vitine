// src/pages/VitrinePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PromotionCarousel from "../components/PromotionCarousel";
import ProductCarousel from "../components/ProductCarousel";
import { useFilters } from "../context/FilterContext";

type Produto = {
  id: number;
  nome: string;
  descricao?: string;
  preco: number | string;
  categoria: string;
  tamanhos?: string[];
  cores?: string[];
  imagens?: string[];
  estoque?: number;
  isActive?: boolean;
  lojista?: { id: number; nome: string; cidade?: string; estado?: string; };
};

const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

export default function VitrinePage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const { filters } = useFilters();
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://vitine-production.up.railway.app/produtos?include=lojista")
      .then((res) => res.json())
      .then((data: Produto[]) => setProdutos(data || []))
      .catch((err) => console.error("Erro ao carregar produtos:", err));
  }, []);

  const staticPromotions = useMemo(
    () => [
      { id: "promo-1", imageUrl: "https://via.placeholder.com/1200x400?text=Promocao+1", alt: "Promoção 1", link: "/promocoes/verao" },
      { id: "promo-2", imageUrl: "https://via.placeholder.com/1200x400?text=Promo+2", alt: "Promoção 2", link: "/novidades" },
      { id: "promo-3", imageUrl: "https://via.placeholder.com/1200x400?text=Promo+3", alt: "Promoção 3", link: "/descontos" },
    ],
    []
  );

  // Filtra produtos pela busca e pela categoria do contexto
  const produtosFiltrados = useMemo(() => {
    const q = (filters.q || "").toLowerCase().trim();
    return produtos.filter((p) => {
      const nome = (p.nome || "").toLowerCase();
      const desc = (p.descricao || "").toLowerCase();
      const matchBusca = !q || nome.includes(q) || desc.includes(q);
      const matchCategoria = !filters.categoria || filters.categoria === "todos" || (p.categoria ?? "Sem categoria") === filters.categoria;
      return matchBusca && matchCategoria;
    });
  }, [produtos, filters]);

  // Agrupa produtos por categoria (após filtros)
  const produtosPorCategoria = useMemo(() => {
    const map = new Map<string, Produto[]>();
    produtosFiltrados.forEach((p) => {
      const name = p.categoria || "Sem categoria";
      if (!map.has(name)) map.set(name, []);
      map.get(name)!.push(p);
    });
    return map;
  }, [produtosFiltrados]);

  const categoriasOrdenadas = useMemo(() => Array.from(produtosPorCategoria.keys()).sort((a, b) => a.localeCompare(b)), [produtosPorCategoria]);

  return (
    <div className="min-h-screen bg-[#000] text-white">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          <section>
            <PromotionCarousel slides={staticPromotions} autoplay interval={4500} />
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Novidades</h2>
            <div className="bg-[#0a0a0a] rounded-lg p-4">
              {/* ProductCarousel deve controlar responsividade interna; aqui garantimos container responsivo */}
              <ProductCarousel items={produtosFiltrados.slice(0, 12)} />
            </div>
          </section>

          <section className="space-y-6">
            {categoriasOrdenadas.map((cat) => {
              const items = produtosPorCategoria.get(cat) || [];
              if (!items.length) return null;
              const slug = toSlug(cat);
              return (
                <div key={slug} className="bg-[#0a0a0a] p-4 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-3">
                    <h3 className="text-xl font-semibold">{cat}</h3>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => navigate(`/category/${slug}`)}
                        className="text-sm text-[#5CE1E6] underline"
                        aria-label={`Ver todos ${cat}`}
                      >
                        Ver todos
                      </button>
                    </div>
                  </div>

                  <div>
                    <ProductCarousel items={items} />
                  </div>
                </div>
              );
            })}
          </section>

          {/* fallback: caso queira também uma grade responsiva de todos os produtos */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Todos os produtos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {produtosFiltrados.slice(0, 16).map((p) => (
                <div key={p.id} className="bg-[#0b0b0b] rounded-lg overflow-hidden">
                  <div className="w-full h-44 bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.imagens && p.imagens[0] ? p.imagens[0] : 'https://via.placeholder.com/400x400?text=Produto'}
                      alt={p.nome}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="text-sm font-medium line-clamp-2">{p.nome}</h4>
                    <div className="mt-2 text-sm font-semibold text-[#5CE1E6]">R$ {p.preco}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}