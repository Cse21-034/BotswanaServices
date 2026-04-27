"use client";

import React, { FC, useState } from "react";
import Badge from "@/shared/Badge";
import Input from "@/shared/Input";

export interface SectionContactProps {
  className?: string;
}

const SectionContact: FC<SectionContactProps> = ({ className = "" }) => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send message");
      } else {
        setSubmitted(true);
        setForm({ firstName: "", lastName: "", email: "", businessName: "", message: "" });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`nc-SectionContact relative ${className}`}
      data-nc-id="SectionContact"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Side - Contact Info */}
          <div className="flex-1">
            <div className="max-w-2xl">
              <h2 className="font-semibold text-4xl mb-6">Get In Touch 📞</h2>
              <span className="block text-neutral-500 dark:text-neutral-400 text-lg mb-8">
                Have questions about listing your business or need support?
                We're here to help you grow in South Africa's business community.
              </span>

              <ul className="space-y-4 mb-8">
                <li className="flex items-center space-x-4">
                  <Badge name="💼" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Business listing support
                  </span>
                </li>
                <li className="flex items-center space-x-4">
                  <Badge color="green" name="📈" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Advertising opportunities
                  </span>
                </li>
                <li className="flex items-center space-x-4">
                  <Badge color="red" name="🤝" />
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">
                    Partnership inquiries
                  </span>
                </li>
              </ul>

              {/* Contact Info */}
              <div className="mb-8 p-6 bg-neutral-50 dark:bg-neutral-800 rounded-2xl">
                <h4 className="font-semibold text-lg mb-4">Contact Information</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                    <i className="las la-phone text-lg text-burgundy-600"></i>
                    <span>+267 78 275 372</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                    <i className="las la-envelope text-lg text-burgundy-600"></i>
                    <span>marketing@mzansiservices.co.za</span>
                  </div>
                  <div className="flex items-center space-x-3 text-neutral-600 dark:text-neutral-400">
                    <i className="las la-map-marker text-lg text-burgundy-600"></i>
                    <span>Johannesburg, South Africa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="flex-1 w-full">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>

              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">Message Sent!</h4>
                  <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                    Thank you for reaching out. We'll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        First Name *
                      </label>
                      <Input
                        name="firstName"
                        required
                        type="text"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="Your first name"
                        rounded="rounded-lg"
                        sizeClass="h-12 px-4"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Last Name *
                      </label>
                      <Input
                        name="lastName"
                        required
                        type="text"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Your last name"
                        rounded="rounded-lg"
                        sizeClass="h-12 px-4"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      required
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your.email@example.com"
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Business Name
                    </label>
                    <Input
                      name="businessName"
                      type="text"
                      value={form.businessName}
                      onChange={handleChange}
                      placeholder="Your business name (optional)"
                      rounded="rounded-lg"
                      sizeClass="h-12 px-4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      required
                      value={form.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white resize-none"
                      placeholder="How can we help you today?"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-burgundy-600 hover:bg-burgundy-800 disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    {submitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionContact;
