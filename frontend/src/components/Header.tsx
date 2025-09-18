// src/components/Header.tsx
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Header() {
  const { cart } = useCart();
  const totalItens = cart.reduce((acc, item) => acc + item.quantidade, 0);

  return (
    <header className="bg-gray-900 shadow-lg border-b border-gray-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className="text-destaque text-2xl md:text-3xl font-bold hover:text-cyan-400 transition-colors"
          >
            <span className="text-white">Sistema</span> Vitrine <span className="text-white">Moda</span>
          </Link>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-complementar hover:text-destaque transition-colors font-medium"
            >
              🏠 Vitrine
            </Link>
            <Link 
              to="/carrinho" 
              className="text-complementar hover:text-destaque transition-colors font-medium relative"
            >
              🛒 Carrinho
              {totalItens > 0 && (
                <span className="absolute -top-2 -right-2 bg-destaque text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </Link>
            <Link 
              to="/auth" 
            >
              
            </Link>
          </nav>

          {/* Menu Mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <Link 
              to="/carrinho" 
              className="text-complementar hover:text-destaque transition-colors relative"
            >
              🛒
              {totalItens > 0 && (
                <span className="absolute -top-2 -right-2 bg-destaque text-black text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </Link>
            <Link 
              to="/auth" 
            >
      
            </Link>
          </div>
        </div>

        {/* Navegação Mobile (expandida) */}
        <nav className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-center space-x-6">
            <Link 
              to="/" 
              className="text-complementar hover:text-destaque transition-colors font-medium"
            >
              🏠 Vitrine
            </Link>
            <Link 
              to="/carrinho" 
              className="text-complementar hover:text-destaque transition-colors font-medium"
            >
              🛒 Carrinho ({totalItens})
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}