"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Business } from "@/data/types"; // Assuming Business type is defined here
import SectionGridFeaturePlaces from "@/components/SectionGridFeaturePlaces";

const CategoryPage = () => {
  const pathname = usePathname();
  const [category, setCategory] = useState<string | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (pathname) {
      const pathParts = pathname.split("/");
      const categorySlug = pathParts[pathParts.length - 1];
      setCategory(categorySlug);

      const fetchBusinesses = async () => {
        setLoading(true);
        setError(null);
        try {
          // Replace with your actual API endpoint for fetching businesses by category
          const response = await fetch(`/api/businesses?category=${categorySlug}`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setBusinesses(data.businesses);
        } catch (e: any) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      };

      fetchBusinesses();
    }
  }, [pathname]);

  if (loading) {
    return <div className="container py-16">Loading businesses...</div>;
  }

  if (error) {
    return <div className="container py-16 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-semibold mb-8 capitalize">
        Businesses in {category?.replace(/-/g, " ")}
      </h1>
      {businesses.length > 0 ? (
        <SectionGridFeaturePlaces
          heading=""
          subHeading=""
          // @ts-ignore
          places={businesses}
          cardType="card2"
        />
      ) : (
        <p>No businesses found for this category.</p>
      )}
    </div>
  );
};

export default CategoryPage;