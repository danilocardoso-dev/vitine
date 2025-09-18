// src/pages/PagamentoPage.tsx
import { useLocation, useParams } from "react-router-dom";
import PaymentQRCode from "../components/checkout/PaymentQRcode";

export default function PagamentoPage() {
  const { id } = useParams();
  const location = useLocation();
  const valor = (location.state as any)?.valor || 0;

  return (
    <div className="p-6 flex justify-center">
      <PaymentQRCode valor={valor} pedidoId={Number(id)} />
    </div>
  );
}