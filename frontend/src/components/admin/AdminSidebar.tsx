// src/components/admin/AdminSidebar.tsx
type Props = {
  active: string;
  onChange: (section: string) => void;
};

export default function AdminSidebar({ active, onChange }: Props) {
  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        <button
          onClick={() => onChange("produtos")}
          className={`block w-full text-left p-2 rounded ${
            active === "produtos" ? "bg-destaque text-black" : "hover:bg-gray-700"
          }`}
        >
          Produtos
        </button>
        <button
          onClick={() => onChange("pedidos")}
          className={`block w-full text-left p-2 rounded ${
            active === "pedidos" ? "bg-destaque text-black" : "hover:bg-gray-700"
          }`}
        >
          Pedidos
        </button>
      </nav>
    </aside>
  );
}