// src/components/CategoryGrid.tsx
import { useNavigate } from "react-router-dom";
type Cat = { id: string; slug: string; name: string; image: string };

export default function CategoryGrid({ categories }: { categories: Cat[] }) {
  const navigate = useNavigate();
  return (
    <section className="py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map(c => (
        <button key={c.id} onClick={() => navigate(`/category/${c.slug}`)} className="block text-left focus:outline-none focus:ring-2 focus:ring-destaque rounded overflow-hidden">
          <div className="relative">
            <img src={c.image} alt={c.name} loading="lazy" className="w-full h-36 object-cover transition-transform duration-300 hover:scale-105" />
            <div className="absolute inset-0 bg-black/30 flex items-end p-3">
              <span className="text-white font-semibold">{c.name}</span>
            </div>
          </div>
        </button>
      ))}
    </section>
  );
}