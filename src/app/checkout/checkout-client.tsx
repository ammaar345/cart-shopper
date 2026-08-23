"use client";

import { formatZar } from "@/lib/format";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import CheckoutStepper from "@/components/CheckoutStepper";
import { orderStorage } from "@/lib/orderStorage";
import { toast } from "sonner";
import type { CartItem } from "@/types";
import { PRODUCTS_BY_ID } from "@/lib/catalog";

function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <p className="mt-1 text-sm text-error" role="alert">
      {msg}
    </p>
  );
}

export default function CheckoutClient() {
  const { items } = useCartStore();
  const [step, setStep] = useState<"contact" | "shipping" | "payment" | "review">("contact");
  const [isPlacing, setIsPlacing] = useState(false);
  const [formData, setFormData] = useState({
    contact: {
      email: "",
      phone: "",
    },
    shipping: {
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      province: "",
      postalCode: "",
    },
    payment: {
      method: "card",
    },
  });
  const router = useRouter();

  // Validation becomes visible for a section only after an attempted continue
  const [attempted, setAttempted] = useState<{ contact?: boolean; shipping?: boolean }>({});

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const PHONE_RE = /^\+?[\d\s\-]{10,}$/;
  const POSTAL_RE = /^\d{4}$/;

  const contactErrors: { email: string | null; phone: string | null } = {
    email: !formData.contact.email.trim()
      ? "Email address is required"
      : !EMAIL_RE.test(formData.contact.email)
        ? "Please enter a valid email address"
        : null,
    phone: !formData.contact.phone.trim()
      ? "Phone number is required"
      : !PHONE_RE.test(formData.contact.phone)
        ? "Please enter a valid phone number"
        : null,
  };

  const SHIPPING_FIELDS: { key: keyof typeof formData.shipping; label: string }[] = [
    { key: "firstName", label: "First name" },
    { key: "lastName", label: "Last name" },
    { key: "address", label: "Street address" },
    { key: "city", label: "City" },
    { key: "province", label: "Province" },
    { key: "postalCode", label: "Postal code" },
  ];

  const shippingErrors = Object.fromEntries(
    SHIPPING_FIELDS.map(({ key, label }) => [
      key,
      !formData.shipping[key].trim() ? `${label} is required` : null,
    ]),
  ) as Record<keyof typeof formData.shipping, string | null>;
  if (formData.shipping.postalCode.trim() && !POSTAL_RE.test(formData.shipping.postalCode)) {
    shippingErrors.postalCode = "Postal code must be 4 digits";
  }

  const showError =
    (step: "contact" | "shipping", err: string | null, value: string): boolean =>
    Boolean(err) && (attempted[step] === true || value.trim() !== "");

  // Restore partial checkout state from sessionStorage so users can navigate away
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("cart-shopper-checkout-draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.step) setStep(parsed.step);
      }
    } catch {
      // ignore — corrupt or unavailable storage
    }
  }, []);

  // Persist on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(
        "cart-shopper-checkout-draft",
        JSON.stringify({ formData, step }),
      );
    } catch {
      // ignore
    }
  }, [formData, step]);

  // Calculate totals using actual product prices from catalog
  const subtotal = items.reduce((sum, item) => {
    const product = PRODUCTS_BY_ID[item.productId];
    // If product not found, use a safe fallback (shouldn't happen in normal flow)
    const price = product ? product.priceCents : 0;
    return sum + (item.qty * price);
  }, 0);

  const FREE_SHIPPING_THRESHOLD_CENTS = 75000;
  const shippingCost = subtotal >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : 5000; // R50 shipping if under free threshold
  const total = subtotal + shippingCost;

  const handleNext = () => {
    switch (step) {
      case "contact": {
        if (!contactErrors.email && !contactErrors.phone) {
          setAttempted((a) => ({ ...a, contact: false }));
          setStep("shipping");
        } else {
          setAttempted((a) => ({ ...a, contact: true }));
          toast.error("Fix the highlighted fields to continue");
        }
        break;
      }
      case "shipping": {
        const hasErrors = Object.values(shippingErrors).some(Boolean);
        if (!hasErrors) {
          setAttempted((a) => ({ ...a, shipping: false }));
          setStep("payment");
        } else {
          setAttempted((a) => ({ ...a, shipping: true }));
          toast.error("Fix the highlighted fields to continue");
        }
        break;
      }
      case "payment":
        setStep("review");
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    switch (step) {
      case "shipping":
        setStep("contact");
        break;
      case "payment":
        setStep("shipping");
        break;
      case "review":
        setStep("payment");
        break;
      default:
        break;
    }
  };

  const handlePlaceOrder = async () => {
    if (isPlacing) return; // prevent double-submit
    setIsPlacing(true);
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Create order object
      const orderId = "CS-" + Math.floor(Math.random() * 90000 + 10000).toString();

      // Convert cart items to order items with real product data
      const orderItems = items.map(item => {
        const product = PRODUCTS_BY_ID[item.productId];
        if (!product) {
          return {
            productId: item.productId,
            name: "Unknown Product",
            quantity: item.qty,
            priceCents: 1500, // fallback
          };
        }

        return {
          productId: item.productId,
          name: product.name,
          quantity: item.qty,
          priceCents: product.priceCents,
        };
      });

      const order: any = {
        id: orderId,
        items: orderItems,
        subtotalCents: subtotal,
        shippingCents: shippingCost,
        totalCents: total,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        customerInfo: {
          email: formData.contact.email,
          phone: formData.contact.phone,
          firstName: formData.shipping.firstName,
          lastName: formData.shipping.lastName,
          address: formData.shipping.address,
          city: formData.shipping.city,
          province: formData.shipping.province,
          postalCode: formData.shipping.postalCode,
        },
      };

      // Save order to localStorage
      orderStorage.saveOrder(order);

      // Clear cart after order
      useCartStore.getState().clear();

      // Clear checkout draft so the next visit starts fresh
      try {
        sessionStorage.removeItem("cart-shopper-checkout-draft");
      } catch {
        // ignore
      }

      // Show success message using toast
      toast.success("Payment successful! Your order has been placed.", {
        description: "You'll be redirected to your order confirmation page.",
      });

      // Navigate to order confirmation with order ID
      router.push(`/order-confirmation?id=${orderId}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
      console.error("Order placement error:", error);
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-3xl font-bold text-ink">Your cart is empty</h1>
        <p className="max-w-sm text-ink-soft">
          Looks like you haven't added anything yet. Let's fix that.
        </p>
        <Link href="/shop" className="btn btn-primary mt-2">
          Browse the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0">
                <Link href="/" className="text-xl font-display font-bold text-ink">
                  Cart Shopper
                </Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    href="/"
                    className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft/70 hover:text-ink-soft hover:border-b-2 hover:border-primary"
                  >
                    Home
                  </Link>
                  <Link
                    href="/shop"
                    className="rounded-md px-3 py-2 text-sm font-medium text-ink-soft/70 hover:text-ink-soft hover:border-b-2 hover:border-primary"
                  >
                    Shop
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              {/* Cart badge would go here in full implementation */}
            </div>
          </div>
        </div>
      </nav>

      <main className="py-12">
        <div className="max-w-4xl mx-auto">
          <CheckoutStepper currentStep={step} />

          <div className="space-y-8">
            {/* Order Summary (right sidebar on lg+) */}
            <div className="lg:hidden">
              <div className="card p-6 mb-6">
                <h2 className="font-display text-xl font-bold text-ink mb-4">
                  Order summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Subtotal</span>
                    <span className="font-semibold text-ink">{formatZar(subtotal)}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">Shipping</span>
                    <span className="font-semibold text-ink">
                      {shippingCost === 0 ? "Free" : formatZar(shippingCost)}
                    </span>
                  </div>

                  <div className="justify-between border-t border-border-soft pt-4">
                    <span className="font-semibold text-ink">Total</span>
                    <span className="font-display text-2xl font-bold text-ink">
                      {formatZar(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Step Content */}
              <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
                {/* Order Summary (lg+) */}
                <div className="hidden lg:block lg:sticky lg:top-20">
                  <div className="card p-6">
                    <h2 className="font-display text-xl font-bold text-ink mb-4">
                      Order summary
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-ink-soft">Subtotal</span>
                        <span className="font-semibold text-ink">{formatZar(subtotal)}</span>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span className="text-ink-soft">Shipping</span>
                        <span className="font-semibold text-ink">
                          {shippingCost === 0 ? "Free" : formatZar(shippingCost)}
                        </span>
                      </div>

                      <div className="flex justify-between border-t border-border-soft pt-4">
                        <span className="font-semibold text-ink">Total</span>
                        <span className="font-display text-2xl font-bold text-ink">
                          {formatZar(total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="space-y-6">
                  {step === "contact" && (
                    <div className="card p-6">
                      <h2 className="font-display text-lg font-bold text-ink mb-4">
                        Contact information
                      </h2>

                      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                        <div>
                          <label htmlFor="email" className="block mb-2 text-sm font-medium text-ink">
                            Email address
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={formData.contact.email}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contact: { ...formData.contact, email: e.target.value },
                              })
                            }
                            aria-invalid={showError("contact", contactErrors.email, formData.contact.email)}
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            placeholder="you@example.com"
                            autoComplete="email"
                          />
                          {showError("contact", contactErrors.email, formData.contact.email) && (
                            <p className="mt-1 text-sm text-error" role="alert">{contactErrors.email}</p>
                          )}
                        </div>

                        <div>
                          <label htmlFor="phone" className="block mb-2 text-sm font-medium text-ink">
                            Phone number
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            required
                            value={formData.contact.phone}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                contact: { ...formData.contact, phone: e.target.value },
                              })
                            }
                            aria-invalid={showError("contact", contactErrors.phone, formData.contact.phone)}
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            placeholder="+27 12 345 6789"
                            autoComplete="tel"
                          />
                          {showError("contact", contactErrors.phone, formData.contact.phone) && (
                            <p className="mt-1 text-sm text-error" role="alert">{contactErrors.phone}</p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={handleNext}
                          className="w-full btn btn-primary btn-lg"
                        >
                          Continue to shipping
                        </button>
                      </form>
                    </div>
                  )}

                  {step === "shipping" && (
                    <div className="card p-6">
                      <h2 className="font-display text-lg font-bold text-ink mb-4">
                        Shipping address
                      </h2>

                      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-ink">
                              First name
                            </label>
                            <input
                              id="firstName"
                              type="text"
                              required
                              value={formData.shipping.firstName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shipping: { ...formData.shipping, firstName: e.target.value },
                                })
                              }
                              aria-invalid={Boolean(attempted.shipping && shippingErrors.firstName)}
                              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            />
                            {attempted.shipping && (
                              <FieldError msg={shippingErrors.firstName} />
                            )}
                          </div>

                          <div>
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-ink">
                              Last name
                            </label>
                            <input
                              id="lastName"
                              type="text"
                              required
                              value={formData.shipping.lastName}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shipping: { ...formData.shipping, lastName: e.target.value },
                                })
                              }
                              aria-invalid={Boolean(attempted.shipping && shippingErrors.lastName)}
                              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            />
                            {attempted.shipping && (
                              <FieldError msg={shippingErrors.lastName} />
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="address" className="block mb-2 text-sm font-medium text-ink">
                            Street address
                          </label>
                          <input
                            id="address"
                            type="text"
                            required
                            value={formData.shipping.address}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shipping: { ...formData.shipping, address: e.target.value },
                              })
                            }
                            aria-invalid={Boolean(attempted.shipping && shippingErrors.address)}
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                          />
                          {attempted.shipping && (
                            <FieldError msg={shippingErrors.address} />
                          )}
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div>
                            <label htmlFor="city" className="block mb-2 text-sm font-medium text-ink">
                              City
                            </label>
                            <input
                              id="city"
                              type="text"
                              required
                              value={formData.shipping.city}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shipping: { ...formData.shipping, city: e.target.value },
                                })
                              }
                              aria-invalid={Boolean(attempted.shipping && shippingErrors.city)}
                              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            />
                            {attempted.shipping && (
                              <FieldError msg={shippingErrors.city} />
                            )}
                          </div>

                          <div>
                            <label htmlFor="province" className="block mb-2 text-sm font-medium text-ink">
                              Province
                            </label>
                            <select
                              id="province"
                              required
                              value={formData.shipping.province}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  shipping: { ...formData.shipping, province: e.target.value },
                                })
                              }
                              aria-invalid={Boolean(attempted.shipping && shippingErrors.province)}
                              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            >
                              <option value="">Select province</option>
                              <option value="Western Cape">Western Cape</option>
                              <option value="Eastern Cape">Eastern Cape</option>
                              <option value="Northern Cape">Northern Cape</option>
                              <option value="Free State">Free State</option>
                              <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                              <option value="North West">North West</option>
                              <option value="Gauteng">Gauteng</option>
                              <option value="Mpumalanga">Mpumalanga</option>
                              <option value="Limpopo">Limpopo</option>
                            </select>
                            {attempted.shipping && (
                              <FieldError msg={shippingErrors.province} />
                            )}
                          </div>
                        </div>

                        <div>
                          <label htmlFor="postalCode" className="block mb-2 text-sm font-medium text-ink">
                            Postal code
                          </label>
                          <input
                            id="postalCode"
                            type="text"
                            required
                            inputMode="numeric"
                            value={formData.shipping.postalCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                shipping: { ...formData.shipping, postalCode: e.target.value },
                              })
                            }
                            aria-invalid={
                              formData.shipping.postalCode.trim() !== "" &&
                              !POSTAL_RE.test(formData.shipping.postalCode)
                            }
                            className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50 aria-[invalid=true]:border-error"
                            placeholder="0000"
                            autoComplete="postal-code"
                          />
                          <FieldError
                            msg={
                              formData.shipping.postalCode.trim() === ""
                                ? attempted.shipping
                                  ? shippingErrors.postalCode
                                  : null
                                : !POSTAL_RE.test(formData.shipping.postalCode)
                                  ? "Please enter a valid 4-digit postal code"
                                  : null
                            }
                          />
                        </div>

                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="btn btn-outline"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handleNext}
                            className="w-full btn btn-primary btn-lg"
                          >
                            Continue to payment
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {step === "payment" && (
                    <div className="card p-6">
                      <h2 className="font-display text-lg font-bold text-ink mb-4">
                        Payment
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-ink-soft mb-4">
                            Secure payment via PayFast. You'll be redirected to PayFast's
                            hosted payment page to complete your transaction.
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label htmlFor="payment-method" className="block mb-2 text-sm font-medium text-ink">
                              Payment method
                            </label>
                            <select
                              id="payment-method"
                              value={formData.payment.method}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  payment: { ...formData.payment, method: e.target.value },
                                })
                              }
                              className="w-full px-4 py-3 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:ring-opacity-50"
                            >
                              <option value="card">Credit/Debit Card</option>
                              <option value="eft">Instant EFT</option>
                              <option value="cashdeposit">Cash Deposit</option>
                            </select>
                          </div>
                        </div>

                        <div className="space-y-6">
                          <div className="text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-primary mx-auto mb-4">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-primary" aria-hidden>
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.54 5.82 22z" />
                              </svg>
                            </div>
                            <p className="text-sm text-ink-soft">
                              Your payment is 100% secure and encrypted
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="btn btn-outline"
                          >
                            Back
                          </button>
                          <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={isPlacing}
                            className="w-full btn btn-primary btn-lg disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isPlacing ? (
                              <>
                                <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                               </svg>
                                Processing…
                              </>
                            ) : (
                              "Place order"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {step === "review" && (
                    <div className="card p-6">
                      <h2 className="font-display text-lg font-bold text-ink mb-4">
                        Review order
                      </h2>

                      <div className="space-y-6">
                        <div>
                          <h3 className="font-display text-md font-semibold text-ink mb-2">
                            Contact information
                          </h3>
                          <p className="text-sm text-ink-soft">
                            <strong>Email:</strong> {formData.contact.email}
                          </p>
                          <p className="text-sm text-ink-soft">
                            <strong>Phone:</strong> {formData.contact.phone}
                          </p>
                        </div>

                        <div className="mt-6">
                          <h3 className="font-display text-md font-semibold text-ink mb-2">
                            Shipping address
                          </h3>
                          <p className="text-sm text-ink-soft">
                            <strong>{formData.shipping.firstName} {formData.shipping.lastName}</strong>
                          </p>
                          <p className="text-sm text-ink-soft">
                            {formData.shipping.address}
                          </p>
                          <p className="text-sm text-ink-soft">
                            {formData.shipping.city}, {formData.shipping.province} {formData.shipping.postalCode}
                          </p>
                          <p className="text-sm text-ink-soft">
                            South Africa
                          </p>
                        </div>

                        <div className="mt-6">
                          <h3 className="font-display text-md font-semibold text-ink mb-2">
                            Order items
                          </h3>
                          <div className="space-y-3">
                              {items.map((item, index) => {
                                const product = PRODUCTS_BY_ID[item.productId];
                                return (
                                  <div key={index} className="flex justify-between text-sm text-ink-soft">
                                    <span>
                                      {item.qty}× {product?.name || "Unknown"}
                                    </span>
                                    <span>
                                      {formatZar(item.qty * (product?.priceCents || 0))}
                                    </span>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border-soft">
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                              <span className="text-ink-soft">Subtotal</span>
                              <span className="font-semibold text-ink">{formatZar(subtotal)}</span>
                            </div>

                            <div className="flex justify-between text-sm">
                              <span className="text-ink-soft">Shipping</span>
                              <span className="font-semibold text-ink">
                                {shippingCost === 0 ? "Free" : formatZar(shippingCost)}
                              </span>
                            </div>

                            <div className="flex justify-between border-t border-border-soft pt-4">
                              <span className="font-semibold text-ink">Total</span>
                              <span className="font-display text-2xl font-bold text-ink">
                                {formatZar(total)}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8">
                          <button
                            type="button"
                            onClick={handlePrevious}
                            className="btn btn-outline"
                          >
                            Back to payment
                          </button>
                          <button
                            type="button"
                            onClick={handlePlaceOrder}
                            disabled={isPlacing}
                            className="ml-4 w-full btn btn-primary btn-lg disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {isPlacing ? (
                              <>
                                <svg className="mr-2 h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden>
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
                                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                               </svg>
                                Processing…
                              </>
                            ) : (
                              "Place order securely"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}