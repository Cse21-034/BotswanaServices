"use client";

import React, { useState } from "react";
import Input from "@/shared/Input";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AddAdminPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !password || !name) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create admin account.");
        setLoading(false);
        return;
      }
      // Success: redirect to login
      router.push("/login");
    } catch (err) {
      setError("Unable to create admin. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-md mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Create Admin Account</h2>
      <form onSubmit={onSubmit} className="space-y-6">
        <label className="block">
          <span className="text-neutral-800 dark:text-neutral-200">Full Name</span>
          <Input value={name} onChange={e => setName(e.target.value)} className="mt-1" required />
        </label>
        <label className="block">
          <span className="text-neutral-800 dark:text-neutral-200">Email address</span>
          <Input value={email} onChange={e => setEmail(e.target.value)} type="email" className="mt-1" required />
        </label>
        <label className="block">
          <span className="text-neutral-800 dark:text-neutral-200">Password</span>
          <Input value={password} onChange={e => setPassword(e.target.value)} type="password" className="mt-1" required />
        </label>
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
        <ButtonPrimary type="submit" className="w-full justify-center" disabled={loading}>
          {loading ? "Creating..." : "Create Admin"}
        </ButtonPrimary>
      </form>
      <div className="mt-6 text-center">
        <Link href="/login" className="text-primary-600 dark:text-primary-400 underline font-medium">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default AddAdminPage;
