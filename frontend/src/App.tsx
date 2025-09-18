
import Footer from './components/Footer';
import AppRouter from './AppRouter';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-fundo text-complementar">

        <main className="flex-grow">
          <AppRouter /> {/* 👈 Só as rotas, sem Router */}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
}

export default App;