import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      {/* Newsletter */}
      <div className="bg-primary-500 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-bold text-white text-xl">Offres exclusives dans votre boîte mail</h3>
            <p className="text-primary-100 text-sm mt-1">Abonnez-vous et recevez -10% sur votre première commande</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="Votre adresse email"
              aria-label="Email pour la newsletter"
              className="flex-1 md:w-72 px-4 py-2.5 rounded-full text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-gray-800 transition-colors whitespace-nowrap">
              S&apos;abonner
            </button>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary-500 text-white font-display font-black text-lg px-2.5 py-0.5 rounded-lg">J</div>
            <span className="font-display font-bold text-white text-lg">umia Clone</span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            La première plateforme e-commerce d&apos;Afrique. Achetez et vendez en toute confiance.
          </p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" aria-label="Réseau social" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Acheter</h4>
          <ul className="space-y-2.5 text-sm">
            {["Toutes les catégories", "Flash Sales", "Nouveautés", "Meilleures ventes", "Promotions"].map((link) => (
              <li key={link}>
                <Link href="/products" className="hover:text-primary-400 transition-colors">{link}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Assistance</h4>
          <ul className="space-y-2.5 text-sm">
            {["Centre d'aide", "Comment passer une commande", "Suivi de commande", "Retours & remboursements", "Contact"].map((link) => (
              <li key={link}>
                <a href="#" className="hover:text-primary-400 transition-colors">{link}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={14} className="shrink-0 text-primary-400 mt-0.5" />
              <span>Dakar, Sénégal<br />Plateau, Rue Carnot</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-primary-400" />
              <span>+221 33 800 00 00</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-primary-400" />
              <span>support@jumia-clone.sn</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800 py-5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Jumia Clone. Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-300 transition-colors">Conditions</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Cookies</a>
          </div>
          <div className="flex items-center gap-2">
            <span>Paiements sécurisés:</span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">Visa</span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">PayPal</span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">Wave</span>
            <span className="px-2 py-0.5 bg-gray-700 rounded text-xs">OM</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
