import { QRCodeSVG } from "qrcode.react";

type Props = {
  valor: number | string;
  pedidoId: number;
};

export default function PaymentQRCode({ valor, pedidoId }: Props) {
  const numericValor = Number(valor) || 0; // 👈 garante número

  const chavePix = `00020126580014BR.GOV.BCB.PIX0136pix@lojista.com5204000053039865405${numericValor.toFixed(2)}5802BR5920Loja Exemplo Ltda6009SaoPaulo62070503***6304`;

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold text-destaque mb-4">Pagamento do Pedido #{pedidoId}</h1>
      <p className="text-gray-300 mb-4">Escaneie o QR Code abaixo para pagar R$ {numericValor.toFixed(2)}</p>

      <QRCodeSVG value={chavePix} size={256} />

      <p className="mt-4 text-sm text-gray-400 break-all max-w-md text-center">
        {chavePix}
      </p>
    </div>
  );
}