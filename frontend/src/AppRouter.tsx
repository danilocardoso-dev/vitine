import { Routes, Route } from "react-router-dom";
import VitrinePage from "./pages/Vitrine";
import ProdutoDetailPage from "./pages/ProdutoDetailPage";
import CarrinhoPage from "./pages/Carrinho";
import PedidoSucessoPage from "./pages/PedidoSucesso";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProdutos from "./components/admin/AdminProdutos";
import AdminPedidos from "./components/admin/AdminPedidos";
import AuthPage from "./pages/Auth"; // 🔑 agora centralizado
import PrivateRoute from "./components/auth/PrivateRoute";
import CheckoutPage from "./pages/CheckoutPage";
import PagamentoPage from "./pages/PagamentoPage";
import ObrigadoPage from "./pages/Obrigadopage";

export default function AppRouter() {
  return (
    <Routes>
      {/* Público */}
      <Route path="/" element={<VitrinePage />} />
      <Route path="/produto/:id" element={<ProdutoDetailPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
      <Route path="/pedido-sucesso" element={<PedidoSucessoPage />} />
      <Route path="/auth" element={<AuthPage />} /> {/* 🔑 Auth central */}
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/pagamento/:id" element={<PagamentoPage />} />
      <Route path="/obrigado" element={<ObrigadoPage />} />

      {/* Protegido */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/produtos"
        element={
          <PrivateRoute>
            <AdminProdutos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/pedidos"
        element={
          <PrivateRoute>
            <AdminPedidos />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}