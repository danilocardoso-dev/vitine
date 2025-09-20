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

  // Estados auxiliares
  const [novoTamanho, setNovoTamanho] = useState("");
  const [novaCor, setNovaCor] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("https://vitine-production.up.railway.app/lojistas")
      .then(res => {
        if (!res.ok) throw new Error("Erro ao carregar lojistas");
        return res.json();
      })
      .then(data => Array.isArray(data) ? setLojistas(data) : setLojistas([]))
      .catch(() => setLojistas([]));

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
    if (!form.nome.trim()) return alert("Nome do produto é obrigatório");
    if (!form.categoria.trim()) return alert("Categoria é obrigatória");
    if (form.preco <= 0) return alert("Preço deve ser maior que zero");
    if (form.lojistaId === 0) return alert("Selecione um lojista");
    onSave(form);
  };

  // Tamanhos
  const adicionarTamanho = () => {
    if (novoTamanho.trim() && !form.tamanhos.includes(novoTamanho.trim())) {
      setForm({ ...form, tamanhos: [...form.tamanhos, novoTamanho.trim()] });
      setNovoTamanho("");
    }
  };
  const removerTamanho = (t: string) =>
    setForm({ ...form, tamanhos: form.tamanhos.filter(x => x !== t) });

  // Cores
  const adicionarCor = () => {
    if (novaCor.trim() && !form.cores.includes(novaCor.trim())) {
      setForm({ ...form, cores: [...form.cores, novaCor.trim()] });
      setNovaCor("");
    }
  };
  const removerCor = (c: string) =>
    setForm({ ...form, cores: form.cores.filter(x => x !== c) });

  const removerImagem = (url: string) =>
    setForm({ ...form, imagens: form.imagens.filter(i => i !== url) });

  // Upload Cloudinary (hardcoded — modo teste)
  async function uploadToCloudinary(file: File) {
    const CLOUD_NAME = "de9sttddj"; // seu cloud name
    const UPLOAD_PRESET = "vitrine"; // nome do preset unsigned

    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    setUploading(true);
    try {
      const res = await fetch(url, { method: "POST", body: formData });
      const data = await res.json();
      if (data.secure_url) {
        setForm(prev => ({ ...prev, imagens: [...prev.imagens, data.secure_url] }));
      } else {
        alert("Erro ao enviar imagem: resposta inválida");
        console.error("Cloudinary error:", data);
      }
    } catch (err) {
      console.error("Erro no upload:", err);
      alert("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      uploadToCloudinary(e.target.files[0]);
    }
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

          {/* Upload via Cloudinary */}
          <div className="flex gap-2 mb-3 items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
            />
            {uploading && <span className="text-sm text-gray-400">Enviando...</span>}
          </div>

          {/* Preview das imagens */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {form.imagens.map((imagem, index) => (
              <div key={index} className="relative">
                <img
                  src={imagem}
                  alt={`Produto ${index + 1}`}
                  className="w-full h-24 object-cover rounded border border-gray-600"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiM0NzQ3NDciLz48dGV4dCB4PSIxMiIgeT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNGRkYiIGZvbnQtc2l6ZT0iMTAiPz88L3RleHQ+PC9zdmc+";
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