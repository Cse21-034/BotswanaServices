"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BusinessNav from "@/components/BusinessNav";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Label from "@/components/Label";

const AddPromotionPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!session?.user?.email) {
      // Handle case where user is not logged in
      setLoading(false);
      return;
    }

    const response = await fetch("/api/promotions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        discount: parseInt(discount),
        expiryDate,
        image: imagePreview || null, // Send base64 image or null
        userEmail: session.user.email,
      }),
    });

    setLoading(false);
    if (response.ok) {
      setSuccess(true);
      setTimeout(() => {
        router.push("/business/promotions");
        router.refresh();
      }, 2000);
    } else {
      // Handle error
    }
  };

  return (
    <>
      <BusinessNav />
      <div className="container mt-10">
        <h2 className="text-3xl font-semibold">Add New Promotion</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
        {success ? (
          <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg" role="alert">
            Promotion added successfully!
          </div>
        ) : (
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <Label>Promotion Image (Optional)</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                Upload a custom image for your promotion. If not provided, the business logo will be used.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-neutral-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100
                dark:file:bg-primary-900 dark:file:text-primary-200"
              />
              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Preview:</p>
                  <img
                    src={imagePreview}
                    alt="Promotion preview"
                    className="w-full max-w-xs h-48 object-cover rounded-lg border border-neutral-200 dark:border-neutral-700"
                  />
                </div>
              )}
            </div>
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
            <ButtonPrimary type="submit" loading={loading}>
              {loading ? "Adding..." : "Add Promotion"}
            </ButtonPrimary>
          </form>
        )}
      </div>
    </>
  );
};

export default AddPromotionPage;
