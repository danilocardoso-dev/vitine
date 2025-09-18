// src/pages/AdminDashboard.tsx
import { useState } from "react";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminProdutos from "../components/admin/AdminProdutos";
import AdminPedidos from "../components/admin/AdminPedidos";

export default function AdminDashboard() {
  const [section, setSection] = useState("produtos");

  return (
    <div className="flex min-h-screen bg-fundo text-complementar">
      <AdminSidebar active={section} onChange={setSection} />
      <div className="flex-grow flex flex-col">
        <AdminHeader />
        <div className="p-6">
          {section === "produtos" && <AdminProdutos />}
          {section === "pedidos" && <AdminPedidos />}
        </div>
      </div>
    </div>
  );
}