"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import BusinessNav from "@/components/BusinessNav";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Link from "next/link";
import { Promotion } from "@prisma/client";
import { useRouter } from "next/navigation";

const PromotionsPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>([]);

  useEffect(() => {
    if (session?.user?.email) {
      const fetchPromotions = async () => {
        const response = await fetch(`/api/users/${session.user.email}/promotions`);
        if (response.ok) {
          const data = await response.json();
          setPromotions(data);
        }
      };
      fetchPromotions();
    }
  }, [session]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      const response = await fetch(`/api/promotions/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPromotions(promotions.filter((promo) => promo.id !== id));
      } else {
        // Handle error
      }
    }
  };

  return (
    <>
      <BusinessNav />
      <div className="container mt-10">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-semibold">Your Promotions</h2>
          <Link href="/business/promotions/add">
            <ButtonPrimary>Add Promotion</ButtonPrimary>
          </Link>
        </div>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
        <div>
          {promotions.length === 0 ? (
            <p>You have no promotions yet.</p>
          ) : (
            <div className="space-y-4">
              {promotions.map((promo) => (
                <div key={promo.id} className="p-4 border rounded-lg flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-semibold">{promo.title}</h3>
                    <p className="text-neutral-500">{promo.description}</p>
                    <p className="text-sm text-neutral-500">Discount: {promo.discount}%</p>
                    <p className="text-sm text-neutral-500">Expires on: {new Date(promo.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link href={`/business/promotions/edit/${promo.id}`}>
                      <ButtonPrimary className="bg-green-500 hover:bg-green-600">Edit</ButtonPrimary>
                    </Link>
                    <ButtonPrimary onClick={() => handleDelete(promo.id)} className="bg-red-500 hover:bg-red-600">Delete</ButtonPrimary>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PromotionsPage;
