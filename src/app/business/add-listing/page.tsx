"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import BusinessNav from "@/components/BusinessNav";
import Input from "@/shared/Input";
import Textarea from "@/shared/Textarea";
import ButtonPrimary from "@/shared/ButtonPrimary";
import Label from "@/components/Label";

const AddListingPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.email) {
      // Handle case where user is not logged in
      return;
    }

    const response = await fetch("/api/listings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        description,
        userEmail: session.user.email,
      }),
    });

    if (response.ok) {
      const newListing = await response.json();
      router.push(`/listings/${newListing.id}`);
    } else {
      // Handle error
    }
  };

  return (
    <>
      <BusinessNav />
      <div className="container mt-10">
        <h2 className="text-3xl font-semibold">Add New Listing</h2>
        <div className="w-14 border-b border-neutral-200 dark:border-neutral-700 my-5"></div>
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div>
            <Label>Title</Label>
            <Input
              className="mt-1.5"
              placeholder="Enter listing title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              className="mt-1.5"
              placeholder="Enter listing description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <ButtonPrimary type="submit">Add Listing</ButtonPrimary>
        </form>
      </div>
    </>
  );
};

export default AddListingPage;
