// src/pages/admin/AdminProdutos.tsx
import { useEffect, useState } from "react";
import ProductTable from "../../components/admin/ProductTable";
import ProductForm from "../../components/admin/ProductForm";

// Tipagem direto aqui
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
  lojistaId: number;
  lojista?: {
    id: number;
    nome: string;
    cidade?: string;
    estado?: string;
  };
};

export default function AdminProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Carregar produtos
  useEffect(() => {
    fetch("http://localhost:3001/produtos")
      .then(res => res.json())
      .then((data: Produto[]) => setProdutos(data))
      .catch(err => console.error("Erro ao carregar produtos:", err));
  }, []);

  // Salvar produto (criar ou editar)
  const handleSave = async (produto: any) => {
    try {
      if (produtoSelecionado) {
        // Editar existente
        const res = await fetch(`http://localhost:3001/produtos/${produtoSelecionado.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produto),
        });
        const updated = await res.json();
        setProdutos(prev =>
          prev.map(p => (p.id === produtoSelecionado.id ? updated : p))
        );
      } else {
        // Criar novo
        const res = await fetch("http://localhost:3001/produtos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(produto),
        });
        const created = await res.json();
        setProdutos(prev => [...prev, created]);
      }

      setProdutoSelecionado(null);
      setShowForm(false);
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
      alert("Erro ao salvar produto");
    }
  };

  // Deletar produto
  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      await fetch(`http://localhost:3001/produtos/${id}`, { method: "DELETE" });
      setProdutos(prev => prev.filter(p => p.id !== id));
      alert("Produto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
      alert("Erro ao excluir produto");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-destaque">Gerenciar Produtos</h1>
        <button
          onClick={() => {
            setProdutoSelecionado(null);
            setShowForm(true);
          }}
          className="bg-destaque text-black px-4 py-2 rounded hover:opacity-80 font-semibold"
        >
          + Novo Produto
        </button>
      </div>

      {showForm ? (
        <ProductForm
          initialData={produtoSelecionado || undefined}
          onSave={handleSave}
          onCancel={() => {
            setProdutoSelecionado(null);
            setShowForm(false);
          }}
        />
      ) : (
        <ProductTable
          produtos={produtos}
          onEdit={(produto) => {
            setProdutoSelecionado(produto);
            setShowForm(true);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}