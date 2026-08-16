"use client";

import { useState } from "react";
import Link from "next/link";

interface Step {
  id: string;
  title: string;
  description?: string;
}

const steps: Step[] = [
  { id: "contact", title: "Contact information", description: "Email and phone number" },
  { id: "shipping", title: "Shipping address", description: "Where we'll send your order" },
  { id: "payment", title: "Payment", description: "Secure payment via PayFast" },
  { id: "review", title: "Review order", description: "Check your order details" },
];

export default function CheckoutStepper({ currentStep }: { currentStep: string }) {
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-display text-2xl font-bold text-ink">
          Checkout
        </h1>
        <div className="text-sm text-ink-soft">
          Step {currentStepIndex + 1} of {steps.length}
        </div>
      </div>

      <div className="flex w-full space-x-4">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex-1 flex flex-col items-center gap-2 px-4 py-3
              ${index < currentStepIndex
                ? "border-b-2 border-primary"
                : index === currentStepIndex
                ? "border-b-2 border-primary"
                : "border-b-2 border-border-soft"}
              `}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg">
              {index < currentStepIndex ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6 text-success"
                  aria-hidden
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
              ) : index === currentStepIndex ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-6 w-6 text-primary"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  className="h-6 w-6 text-ink-soft/60"
                  aria-hidden
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </div>
            <p className="text-sm font-medium text-center text-ink">
              {step.title}
            </p>
            {step.description && (
              <p className="xs text-center text-ink-soft">{step.description}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex h-0.5 w-full mt-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`
              flex-1 h-0.5
              ${index < currentStepIndex
                ? "bg-primary"
                : index === currentStepIndex
                ? "bg-primary"
                : "bg-border-soft"}
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}