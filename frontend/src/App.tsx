// src/App.tsx
import Footer from './components/Footer';
import AppRouter from './AppRouter';
import { CartProvider } from './context/CartContext';
import { FilterProvider } from './context/FilterContext'; // <-- adicione isto

function App() {
  return (
    <CartProvider>
      <FilterProvider>
        <div className="flex flex-col min-h-screen bg-fundo text-complementar">
          <main className="flex-grow">
            <AppRouter /> {/* 👈 Só as rotas, sem Router */}
          </main>
          <Footer />
        </div>
      </FilterProvider>
    </CartProvider>
  );
}

export default App;