// src/components/Footer.tsx
import { FaInstagram, FaWhatsapp, FaGlobe, FaEnvelope } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 text-complementar pt-8 pb-4">
      <div className="container mx-auto px-4">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          
          {/* Logo + Descrição */}
          <div>
            <h2 className="text-destaque text-2xl font-bold mb-2">
              Sistema Vitrine Moda
            </h2>
            <p className="text-sm text-gray-400">
              Conectando lojistas e clientes em um só lugar.
              Moda, estilo e praticidade — tudo ao seu alcance.
            </p>
          </div>

          {/* Links Úteis */}
          <div>
            <h3 className="text-white font-semibold mb-3">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-destaque transition-colors">
                  🏠 Vitrine
                </a>
              </li>
              <li>
                <a href="/carrinho" className="hover:text-destaque transition-colors">
                  🛒 Carrinho
                </a>
              </li>
              <li>
                <a href="/auth" className="hover:text-destaque transition-colors">
                  🔑 Login
                </a>
              </li>
            </ul>
          </div>

          {/* Contato + Redes */}
          <div>
            <h3 className="text-white font-semibold mb-3">Entre em Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaWhatsapp className="text-destaque" />
                <a
                  href="https://wa.me/5562992117409"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-destaque transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaInstagram className="text-destaque" />
                <a
                  href="https://www.instagram.com/l1nk_start/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-destaque transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaGlobe className="text-destaque" />
                <a
                  href="https://linkstart-go.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-destaque transition-colors"
                >
                  nosso site
                </a>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-2">
                <FaEnvelope className="text-destaque" />
                <a
                  href="danilocardosodemelo@gmail.com"
                  className="hover:text-destaque transition-colors"
                >
                  contato@linkstart.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Sistema Vitrine Moda. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}