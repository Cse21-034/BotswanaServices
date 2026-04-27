"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import BusinessNav from "@/components/BusinessNav";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Label from "@/components/Label";
import { Promotion } from "@prisma/client";

const EditPromotionPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  useEffect(() => {
    if (id) {
      const fetchPromotion = async () => {
        const response = await fetch(`/api/promotions/${id}`);
        if (response.ok) {
          const promotion: Promotion = await response.json();
          setTitle(promotion.title);
          setDescription(promotion.description);
          setDiscount(promotion.discount.toString());
          setExpiryDate(new Date(promotion.expiryDate).toISOString().split("T")[0]);
        }
      };
      fetchPromotion();
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch(`/api/promotions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        discount: parseInt(discount),
        expiryDate,
      }),
    });

    if (response.ok) {
      router.push("/business/promotions");
    } else {
      // Handle error
    }
  };

  return (
    <>
      <BusinessNav />
      <div className="container mt-10">
        <h2 className="text-3xl font-semibold">Edit Promotion</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              className="mt-1.5"
              placeholder="Enter promotion title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-1.5"
              placeholder="Enter promotion description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <Label>Discount (%)</Label>
            <Input
              type="number"
              className="mt-1.5"
              placeholder="Enter discount percentage"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>
          <div>
            <Label>Expiry Date</Label>
            <Input
              type="date"
              className="mt-1.5"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
            />
          </div>
          <ButtonPrimary type="submit">Update Promotion</ButtonPrimary>
        </form>
      </div>
    </>
  );
};

export default EditPromotionPage;
