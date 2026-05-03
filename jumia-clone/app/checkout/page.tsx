"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Check, Smartphone, CreditCard, Truck, MapPin, User, Mail, Phone } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

type PaymentMethod = "mobile_money" | "card" | "delivery";
type DeliveryMethod = "standard" | "express" | "pickup";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart, promoDiscount } = useCartStore();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mobile_money");
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "Dakar", country: "Sénégal",
  });

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const discountAmount = (subtotal * promoDiscount) / 100;
  const deliveryCost = deliveryMethod === "express" ? 5000 : deliveryMethod === "standard" && subtotal < 50000 ? 2500 : 0;
  const total = subtotal - discountAmount + deliveryCost;

  const updateForm = (field: keyof FormData, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    await new Promise((r) => setTimeout(r, 2000));
    setIsProcessing(false);
    setOrderPlaced(true);
    clearCart();
  };

  const paymentMethods = [
    { id: "mobile_money" as const, icon: Smartphone, label: "Mobile Money", desc: "Orange Money, Wave, Free Money", color: "#F68B1E" },
    { id: "card" as const, icon: CreditCard, label: "Carte bancaire", desc: "Visa, Mastercard", color: "#3B82F6" },
    { id: "delivery" as const, icon: Truck, label: "Paiement à la livraison", desc: "Payez quand vous recevez", color: "#10B981" },
  ];

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <p className="text-6xl mb-4">🛒</p>
        <h1 className="font-display font-bold text-xl mb-3 text-gray-900 dark:text-white">Votre panier est vide</h1>
        <Link href="/products" className="inline-block bg-primary-500 text-white px-6 py-3 rounded-2xl font-medium mt-2 hover:bg-primary-600 transition-colors">
          Continuer mes achats
        </Link>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check size={40} className="text-green-600" />
        </div>
        <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white mb-3">
          Commande confirmée ! 🎉
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-2">
          Merci pour votre commande. Vous recevrez un email de confirmation.
        </p>
        <p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mb-8">
          Numéro de commande: #JUM{Math.floor(Math.random() * 900000 + 100000)}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold px-8 py-3.5 rounded-2xl transition-colors"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/cart" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors" aria-label="Retour au panier">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-display font-bold text-2xl md:text-3xl text-gray-900 dark:text-white">
          Finaliser la commande
        </h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[
          { n: 1, label: "Adresse" },
          { n: 2, label: "Livraison" },
          { n: 3, label: "Paiement" },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-center">
            <div className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                step >= n ? "bg-primary-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              )}>
                {step > n ? <Check size={16} /> : n}
              </div>
              <span className={cn("text-sm font-medium hidden sm:block", step >= n ? "text-gray-900 dark:text-white" : "text-gray-400")}>
                {label}
              </span>
            </div>
            {i < arr.length - 1 && (
              <div className={cn("w-8 sm:w-16 h-0.5 mx-2", step > n ? "bg-primary-500" : "bg-gray-200 dark:bg-gray-700")} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-4">

          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <MapPin size={20} className="text-primary-500" />
                Adresse de livraison
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { field: "firstName", label: "Prénom", icon: User, placeholder: "Moussa" },
                  { field: "lastName", label: "Nom", icon: User, placeholder: "Diallo" },
                  { field: "email", label: "Email", icon: Mail, placeholder: "moussa@email.com", type: "email" },
                  { field: "phone", label: "Téléphone", icon: Phone, placeholder: "+221 77 000 00 00", type: "tel" },
                ].map(({ field, label, icon: Icon, placeholder, type = "text" }) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                      {label} *
                    </label>
                    <div className="relative">
                      <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type={type}
                        value={form[field as keyof FormData]}
                        onChange={(e) => updateForm(field as keyof FormData, e.target.value)}
                        placeholder={placeholder}
                        aria-label={label}
                        className="w-full pl-9 pr-4 py-2.5 border dark:border-gray-600 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Adresse complète *
                  </label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                    placeholder="N° de rue, quartier..."
                    aria-label="Adresse"
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl text-sm bg-transparent focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ville</label>
                  <select
                    value={form.city}
                    onChange={(e) => updateForm("city", e.target.value)}
                    aria-label="Ville"
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {["Dakar", "Thiès", "Saint-Louis", "Ziguinchor", "Kaolack", "Mbour"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Pays</label>
                  <select
                    value={form.country}
                    onChange={(e) => updateForm("country", e.target.value)}
                    aria-label="Pays"
                    className="w-full px-4 py-2.5 border dark:border-gray-600 rounded-xl text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {["Sénégal", "Côte d'Ivoire", "Mali", "Guinée", "Cameroun"].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                onClick={() => setStep(2)}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-2xl transition-colors"
              >
                Continuer <ChevronRight size={18} />
              </button>
            </div>
          )}

          {/* Step 2: Delivery */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <Truck size={20} className="text-primary-500" />
                Mode de livraison
              </h2>
              <div className="space-y-3">
                {[
                  { id: "standard", label: "Livraison standard", desc: "3-5 jours ouvrés", price: subtotal >= 50000 ? "Gratuite" : formatPrice(2500), badge: subtotal >= 50000 ? "Gratuite" : null },
                  { id: "express", label: "Livraison express", desc: "24-48 heures", price: formatPrice(5000), badge: "Rapide" },
                  { id: "pickup", label: "Retrait en point relais", desc: "Disponible sous 3 jours", price: "Gratuit", badge: null },
                ].map(({ id, label, desc, price, badge }) => (
                  <label key={id} className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors",
                    deliveryMethod === id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  )}>
                    <input
                      type="radio"
                      name="delivery"
                      value={id}
                      checked={deliveryMethod === id as DeliveryMethod}
                      onChange={() => setDeliveryMethod(id as DeliveryMethod)}
                      className="accent-primary-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white text-sm">{label}</span>
                        {badge && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{badge}</span>}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                    <span className="font-bold text-primary-600 dark:text-primary-400 text-sm">{price}</span>
                  </label>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep(1)} className="flex-1 border dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Retour
                </button>
                <button onClick={() => setStep(3)} className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3.5 rounded-2xl transition-colors">
                  Continuer <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
              <h2 className="font-semibold text-lg text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-primary-500" />
                Mode de paiement
              </h2>
              <div className="space-y-3 mb-6">
                {paymentMethods.map(({ id, icon: Icon, label, desc, color }) => (
                  <label key={id} className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-colors",
                    paymentMethod === id
                      ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20"
                      : "border-gray-200 dark:border-gray-600 hover:border-gray-300"
                  )}>
                    <input
                      type="radio"
                      name="payment"
                      value={id}
                      checked={paymentMethod === id}
                      onChange={() => setPaymentMethod(id)}
                      className="accent-primary-500"
                    />
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + "20" }}>
                      <Icon size={20} style={{ color }} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white text-sm">{label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod === "mobile_money" && (
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-4 mb-5">
                  <p className="text-sm font-medium text-orange-800 dark:text-orange-300 mb-3">
                    Entrez votre numéro Mobile Money
                  </p>
                  <input
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    defaultValue={form.phone}
                    aria-label="Numéro Mobile Money"
                    className="w-full px-4 py-2.5 border border-orange-200 dark:border-orange-700 rounded-xl text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 dark:text-white"
                  />
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-4 mb-5 space-y-3">
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    aria-label="Numéro de carte"
                    className="w-full px-4 py-2.5 border border-blue-200 dark:border-blue-700 rounded-xl text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="MM/AA" aria-label="Date d'expiration" className="px-4 py-2.5 border border-blue-200 dark:border-blue-700 rounded-xl text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    <input type="text" placeholder="CVV" maxLength={3} aria-label="CVV" className="px-4 py-2.5 border border-blue-200 dark:border-blue-700 rounded-xl text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Retour
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                  className="flex-1 flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 text-white font-semibold py-3.5 rounded-2xl transition-colors"
                >
                  {isProcessing ? (
                    <><span className="animate-spin">⏳</span> Traitement...</>
                  ) : (
                    <><Check size={18} /> Confirmer ({formatPrice(total)})</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order recap */}
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm sticky top-24">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Récapitulatif ({items.length} article{items.length > 1 ? "s" : ""})
            </h2>

            {/* Items */}
            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center gap-3">
                  <div className="relative w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shrink-0">
                    <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" sizes="48px" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-1">{item.product.name}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white shrink-0">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t dark:border-gray-700 pt-4 space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Sous-total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Promo -{promoDiscount}%</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Livraison</span>
                <span>{deliveryCost === 0 ? "Gratuite" : formatPrice(deliveryCost)}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t dark:border-gray-700 pt-2.5">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
