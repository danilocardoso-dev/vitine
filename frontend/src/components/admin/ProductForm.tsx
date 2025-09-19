// src/components/admin/ProductForm.tsx
import { useState, useEffect } from "react";

type Lojista = {
  id: number;
  nome: string;
};

type ProductFormData = {
  nome: string;
  descricao: string;
  preco: number;
  categoria: string;
  tamanhos: string[];
  cores: string[];
  imagens: string[];
  estoque: number;
  isActive: boolean;
  lojistaId: number;
};

type Props = {
  onSave: (produto: ProductFormData) => void;
  initialData?: any;
  onCancel?: () => void;
};

export default function ProductForm({ onSave, initialData, onCancel }: Props) {
  const [lojistas, setLojistas] = useState<Lojista[]>([]);
  const [form, setForm] = useState<ProductFormData>({
    nome: "",
    descricao: "",
    preco: 0,
    categoria: "",
    tamanhos: [],
    cores: [],
    imagens: [],
    estoque: 0,
    isActive: true,
    lojistaId: 0,
  });

  // Estados auxiliares para inputs dinâmicos
  const [novoTamanho, setNovoTamanho] = useState("");
  const [novaCor, setNovaCor] = useState("");
  const [novaImagem, setNovaImagem] = useState("");

  useEffect(() => {
    // Carregar lojistas para o select
    fetch("https://vitine-production.up.railway.app/lojistas")
      .then(res => {
        if (!res.ok) throw new Error('Erro ao carregar lojistas');
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLojistas(data);
        } else {
          console.error('Resposta não é um array:', data);
          setLojistas([]);
        }
      })
      .catch(error => {
        console.error('Erro ao carregar lojistas:', error);
        setLojistas([]);
      });

    // Se tem dados iniciais (edição), preenche o form
    if (initialData) {
      setForm({
        nome: initialData.nome || "",
        descricao: initialData.descricao || "",
        preco: parseFloat(initialData.preco) || 0,
        categoria: initialData.categoria || "",
        tamanhos: Array.isArray(initialData.tamanhos) ? initialData.tamanhos : [],
        cores: Array.isArray(initialData.cores) ? initialData.cores : [],
        imagens: Array.isArray(initialData.imagens) ? initialData.imagens : [],
        estoque: initialData.estoque || 0,
        isActive: initialData.isActive ?? true,
        lojistaId: initialData.lojistaId || 0,
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!form.nome.trim()) {
      alert('Nome do produto é obrigatório');
      return;
    }
    if (!form.categoria.trim()) {
      alert('Categoria é obrigatória');
      return;
    }
    if (form.preco <= 0) {
      alert('Preço deve ser maior que zero');
      return;
    }
    if (form.lojistaId === 0) {
      alert('Selecione um lojista');
      return;
    }

    onSave(form);
  };

  const adicionarTamanho = () => {
    if (novoTamanho.trim() && !form.tamanhos.includes(novoTamanho.trim())) {
      setForm({ ...form, tamanhos: [...form.tamanhos, novoTamanho.trim()] });
      setNovoTamanho("");
    }
  };

  const removerTamanho = (tamanho: string) => {
    setForm({ ...form, tamanhos: form.tamanhos.filter(t => t !== tamanho) });
  };

  const adicionarCor = () => {
    if (novaCor.trim() && !form.cores.includes(novaCor.trim())) {
      setForm({ ...form, cores: [...form.cores, novaCor.trim()] });
      setNovaCor("");
    }
  };

  const removerCor = (cor: string) => {
    setForm({ ...form, cores: form.cores.filter(c => c !== cor) });
  };

  const adicionarImagem = () => {
    if (novaImagem.trim() && !form.imagens.includes(novaImagem.trim())) {
      setForm({ ...form, imagens: [...form.imagens, novaImagem.trim()] });
      setNovaImagem("");
    }
  };

  const removerImagem = (imagem: string) => {
    setForm({ ...form, imagens: form.imagens.filter(i => i !== imagem) });
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-md max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-destaque">
          {initialData ? "Editar Produto" : "Novo Produto"}
        </h3>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            ✖
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <div className="border-b border-gray-700 pb-4">
          <h4 className="text-lg font-semibold mb-3 text-destaque">Informações Básicas</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Produto *</label>
              <input
                type="text"
                required
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-destaque"
                placeholder="Ex: Camisa Polo Masculina"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Categoria *</label>
              <select
                required
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-destaque"
              >
                <option value="">Selecione uma categoria</option>
                <option value="Camisas">Camisas</option>
                <option value="Calças">Calças</option>
                <option value="Vestidos">Vestidos</option>
                <option value="Sapatos">Sapatos</option>
                <option value="Acessórios">Acessórios</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-destaque"
              rows={3}
              placeholder="Descreva o produto..."
            />
          </div>
        </div>

        {/* Preço e Estoque */}
        <div className="border-b border-gray-700 pb-4">
          <h4 className="text-lg font-semibold mb-3 text-destaque">Preço e Estoque</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Preço (R$) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={form.preco}
                onChange={(e) => setForm({ ...form, preco: parseFloat(e.target.value) || 0 })}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-destaque"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Estoque *</label>
              <input
                type="number"
                min="0"
                required
                value={form.estoque}
                onChange={(e) => setForm({ ...form, estoque: parseInt(e.target.value) || 0 })}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-destaque"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Lojista *</label>
              <select
                required
                value={form.lojistaId}
                onChange={(e) => setForm({ ...form, lojistaId: parseInt(e.target.value) })}
                className="w-full p-3 rounded bg-gray-800 text-white border border-gray-600 focus:border-destaque"
              >
                <option value={0}>Selecione um lojista</option>
                {lojistas.map((lojista) => (
                  <option key={lojista.id} value={lojista.id}>
                    {lojista.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tamanhos */}
        <div className="border-b border-gray-700 pb-4">
          <h4 className="text-lg font-semibold mb-3 text-destaque">Tamanhos Disponíveis</h4>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={novoTamanho}
              onChange={(e) => setNovoTamanho(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Ex: P, M, G, GG, 38, 40..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarTamanho())}
            />
            <button
              type="button"
              onClick={adicionarTamanho}
              className="bg-destaque text-black px-4 py-2 rounded hover:opacity-80"
            >
              Adicionar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {form.tamanhos.map(tamanho => (
              <span
                key={tamanho}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {tamanho}
                <button
                  type="button"
                  onClick={() => removerTamanho(tamanho)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Cores */}
        <div className="border-b border-gray-700 pb-4">
          <h4 className="text-lg font-semibold mb-3 text-destaque">Cores Disponíveis</h4>
          
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={novaCor}
              onChange={(e) => setNovaCor(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="Ex: Azul, Vermelho, Preto..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarCor())}
            />
            <button
              type="button"
              onClick={adicionarCor}
              className="bg-destaque text-black px-4 py-2 rounded hover:opacity-80"
            >
              Adicionar
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {form.cores.map(cor => (
              <span
                key={cor}
                className="bg-gray-700 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {cor}
                <button
                  type="button"
                  onClick={() => removerCor(cor)}
                  className="text-red-400 hover:text-red-600"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Imagens */}
        <div className="border-b border-gray-700 pb-4">
          <h4 className="text-lg font-semibold mb-3 text-destaque">Imagens do Produto</h4>
          
          <div className="flex gap-2 mb-3">
            <input
              type="url"
              value={novaImagem}
              onChange={(e) => setNovaImagem(e.target.value)}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
              placeholder="URL da imagem (https://...)"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), adicionarImagem())}
            />
            <button
              type="button"
              onClick={adicionarImagem}
              className="bg-destaque text-black px-4 py-2 rounded hover:opacity-80"
            >
              Adicionar
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {form.imagens.map((imagem, index) => (
              <div key={index} className="relative">
                <img
                  src={imagem}
                  alt={`Produto ${index + 1}`}
                  className="w-full h-24 object-cover rounded border border-gray-600"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0IiBmaWxsPSIjNDc0NzQ3Ii8+Cjx0ZXh0IHg9IjEyIiB5PSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iI0ZGRiIgZm9udC1zaXplPSIxMCI+Pz88L3RleHQ+Cjwvc3ZnPgo=';
                  }}
                />
                <button
                  type="button"
                  onClick={() => removerImagem(imagem)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="pb-4">
          <h4 className="text-lg font-semibold mb-3 text-destaque">Status</h4>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4"
            />
            <span>Produto Ativo (visível na vitrine)</span>
          </label>
        </div>

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 bg-destaque text-black font-bold py-3 rounded hover:opacity-80 transition"
          >
            {initialData ? "Atualizar Produto" : "Criar Produto"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 bg-gray-700 text-white py-3 rounded hover:bg-gray-600 transition"
            >
              Cancelar
            </button>
            )}
        </div>
      </form>
    </div>
  );
}