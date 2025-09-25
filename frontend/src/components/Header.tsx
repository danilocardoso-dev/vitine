// src/components/Header.tsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useFilters } from '../context/FilterContext';

type IconProps = { className?: string; 'aria-hidden'?: boolean };

function HomeIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 11.5L12 4l9 7.5" />
      <path d="M5 21V10.5h14V21" />
    </svg>
  );
}

function CartIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 6h15l-1.5 9h-12z" />
      <circle cx="9" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
    </svg>
  );
}

function UserIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function MenuIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  );
}

function CloseIcon({ className = '' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

export default function Header() {
  const { cart } = useCart();
  const totalItens = cart.reduce((acc, item) => acc + item.quantidade, 0);

  const { filters, setQuery, setCategoria, clearFilters } = useFilters();

  const [open, setOpen] = useState(false); // mobile menu
  const [categories, setCategories] = useState<string[]>([]);

  const debounceRef = useRef<number | null>(null);
  const [localQuery, setLocalQuery] = useState(filters.q);
  const [localCategory, setLocalCategory] = useState(filters.categoria);

  useEffect(() => {
    setLocalQuery(filters.q);
    setLocalCategory(filters.categoria);
  }, [filters.q, filters.categoria]);

  // debounce -> atualiza contexto
  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setQuery(localQuery);
      setCategoria(localCategory);
    }, 300);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [localQuery, localCategory, setQuery, setCategoria]);

  // carregar categorias (únicas)
  useEffect(() => {
    let mounted = true;
    fetch('https://vitine-production.up.railway.app/produtos?include=lojista')
      .then((r) => r.json())
      .then((data: any[]) => {
        if (!mounted) return;
        const unique = Array.from(new Set((data || []).map((p) => (p?.categoria || 'Sem categoria'))));
        unique.sort((a: string, b: string) => a.localeCompare(b));
        setCategories(unique);
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  const cartBadge = useMemo(() => totalItens > 0 ? totalItens : null, [totalItens]);

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0b] border-b border-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-3">
        {/* Grid: logo | centro (search) | ações */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
          {/* left: logo */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-[#5CE1E6] rounded" aria-label="Ir para a página inicial">
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-[#081018] to-[#071214] flex items-center justify-center">
                <span className="text-[#5CE1E6] font-extrabold tracking-tight text-lg">LS</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-white text-lg md:text-2xl font-bold leading-none">
                  <span className="text-white">Sistema</span>
                  <span className="block md:inline text-[#5CE1E6] ml-1">Vitrine</span>
                  <span className="text-white md:ml-1 hidden md:inline">Moda</span>
                </div>
                <span className="text-gray-400 text-xs">Soluções em tecnologia</span>
              </div>
            </Link>
          </div>

          {/* center: busca + categoria (responsivo) */}
          <div className="flex w-full justify-center">
            <div className="w-full max-w-3xl">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  aria-label="Buscar produtos"
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  placeholder="Buscar produtos, ex: camisa, boné..."
                  className="w-full sm:flex-1 min-w-0 bg-gray-900 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                />

                <select
                  aria-label="Categoria"
                  value={localCategory}
                  onChange={(e) => setLocalCategory(e.target.value)}
                  className="w-full sm:w-44 bg-gray-900 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5CE1E6]"
                >
                  <option value="todos">Todas</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => { setLocalQuery(''); setLocalCategory('todos'); clearFilters(); }}
                  className="hidden sm:inline-block bg-gray-800 text-gray-200 px-3 py-2 rounded hover:bg-gray-700"
                  aria-label="Limpar filtros"
                >
                  Limpar
                </button>
              </div>
            </div>
          </div>

          {/* right: ações (desktop) / mobile menu */}
          <div className="flex items-center justify-end gap-3">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2 text-gray-200 hover:text-[#5CE1E6] transition-colors font-medium" aria-label="Vitrine">
                <HomeIcon className="w-5 h-5 text-gray-300" />
                <span className="hidden lg:inline">Vitrine</span>
              </Link>

              <Link to="/carrinho" className="relative flex items-center gap-2 text-gray-200 hover:text-[#5CE1E6] transition-colors font-medium" aria-label={`Carrinho, ${totalItens} itens`}>
                <CartIcon className="w-6 h-6 text-gray-300" />
                <span className="hidden lg:inline">Carrinho</span>
                {cartBadge && (
                  <span className="absolute -top-2 -right-3 bg-[#5CE1E6] text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center" aria-live="polite">
                    {cartBadge}
                  </span>
                )}
              </Link>

              <Link to="/auth" className="flex items-center gap-2 text-gray-200 hover:text-[#5CE1E6] transition">
                <UserIcon className="w-6 h-6" />
                <span className="hidden lg:inline text-sm">Entrar</span>
              </Link>
            </nav>

            {/* mobile: cart + menu toggle */}
            <div className="flex md:hidden items-center gap-2">
              <Link to="/carrinho" className="relative text-gray-200 hover:text-[#5CE1E6]" aria-label={`Carrinho, ${totalItens} itens`}>
                <CartIcon className="w-6 h-6" />
                {cartBadge && (
                  <span className="absolute -top-2 -right-2 bg-[#5CE1E6] text-black text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center" aria-live="polite">
                    {cartBadge}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setOpen(v => !v)}
                aria-expanded={open}
                aria-label={open ? 'Fechar menu' : 'Abrir menu'}
                className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#5CE1E6] text-gray-200 hover:text-[#5CE1E6] transition"
              >
                {open ? <CloseIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* mobile expanded area: empilha busca, select e links */}
        <nav className={`md:hidden mt-3 overflow-hidden transition-all duration-200 ${open ? 'max-h-[420px]' : 'max-h-0'}`} aria-hidden={!open}>
          <div className="flex flex-col gap-3 py-3 border-t border-gray-800">
            <div className="px-2 flex flex-col gap-2">
              <input
                aria-label="Buscar produtos"
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full bg-gray-900 text-white px-4 py-2 rounded focus:outline-none"
              />
              <select
                aria-label="Categoria"
                value={localCategory}
                onChange={(e) => setLocalCategory(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-2 rounded focus:outline-none"
              >
                <option value="todos">Todas</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              <div className="flex gap-2 mt-2">
                <Link to="/" onClick={() => setOpen(false)} className="flex-1 text-center bg-gray-800 text-white px-4 py-2 rounded">Vitrine</Link>
                <Link to="/carrinho" onClick={() => setOpen(false)} className="flex-1 text-center bg-gray-800 text-white px-4 py-2 rounded">Carrinho</Link>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}