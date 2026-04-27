"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { categories } from '@/data/categories';
import Link from 'next/link';
import { MagnifyingGlassIcon, ChevronDownIcon, ChevronUpIcon, Squares2X2Icon, ListBulletIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

const CategoriesPage = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<{name: string; subcategories: string[]} | null>(null);
  const [modalSearchTerm, setModalSearchTerm] = useState('');

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const filteredCategories = useMemo(() => {
    return categories.map((category) => ({
      ...category,
      thumbnail: category.image, // Use the image from categories.ts
      subcategories: category.subcategories.filter(subcategory =>
        subcategory.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    })).filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      category.subcategories.length > 0
    );
  }, [searchTerm]);

  const filteredModalSubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return selectedCategory.subcategories.filter(subcategory =>
      subcategory.toLowerCase().includes(modalSearchTerm.toLowerCase())
    );
  }, [selectedCategory, modalSearchTerm]);

  const openModal = (category: any) => {
    setSelectedCategory(category);
    setModalSearchTerm('');
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setModalSearchTerm('');
  };

  if (!hasMounted) {
    return null; // or a loading spinner
  }

  const CategoryCard = ({ category, index }: { category: any; index: number }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800">
      <div className="relative h-40 w-full group">
        <Image
          src={category.thumbnail}
          alt={category.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={index < 6}
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
        <div className="absolute bottom-4 left-4">
          <span className="bg-primary-600 text-white px-2 py-1 rounded-md text-sm font-medium">
            {category.subcategories.length} services
          </span>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            {category.name}
          </h3>
          <button 
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
            onClick={() => openModal(category)}
          >
            <ChevronDownIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Preview of subcategories */}
        <div className="mt-3 flex flex-wrap gap-1">
          {category.subcategories.slice(0, 4).map((subcategory: string) => (
            <Link
              key={subcategory}
              href={`/listing-stay-map?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
              className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors truncate max-w-[120px]"
              title={subcategory}
            >
              {subcategory}
            </Link>
          ))}
          {category.subcategories.length > 4 && (
            <button
              onClick={() => openModal(category)}
              className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-500 text-xs rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              +{category.subcategories.length - 4} more
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const CategoryListItem = ({ category, index }: { category: any; index: number }) => (
    <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 hover:border-primary-200 dark:hover:border-primary-800 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={category.thumbnail}
                alt={category.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                {category.name}
              </h3>
              <div className="flex flex-wrap gap-1 mt-2">
                {category.subcategories.slice(0, 5).map((subcategory: string) => (
                  <Link
                    key={subcategory}
                    href={`/listing-stay-map?category=${encodeURIComponent(category.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                    className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 text-xs rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
                  >
                    {subcategory}
                  </Link>
                ))}
                {category.subcategories.length > 5 && (
                  <button
                    onClick={() => openModal(category)}
                    className="inline-block px-2 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-500 text-xs rounded-md hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  >
                    +{category.subcategories.length - 5} more
                  </button>
                )}
              </div>
            </div>
          </div>
          <button 
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors flex-shrink-0"
            onClick={() => openModal(category)}
          >
            <ChevronDownIcon className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-neutral-100 bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
            Explore Services
          </h1>
          <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Discover comprehensive business services across {categories.length} categories and hundreds of specialized subcategories
          </p>
        </div>

        {/* Search and Controls */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full sm:max-w-2xl">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search categories or services..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition shadow-sm text-neutral-900 dark:text-neutral-100"
              />
            </div>
            
            <div className="flex items-center space-x-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <Squares2X2Icon className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' 
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <ListBulletIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 text-center">
          <p className="text-neutral-600 dark:text-neutral-400">
            Showing <span className="font-semibold text-primary-600 dark:text-primary-400">{filteredCategories.length}</span> categories
            {searchTerm && (
              <span> for "<span className="font-semibold text-neutral-900 dark:text-neutral-100">{searchTerm}</span>"</span>
            )}
          </p>
        </div>

        {/* Categories Grid/List */}
        {filteredCategories.length > 0 ? (
          <div className={
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }>
            {filteredCategories.map((category, index) =>
              viewMode === 'grid' ? (
                <CategoryCard key={category.name} category={category} index={index} />
              ) : (
                <CategoryListItem key={category.name} category={category} index={index} />
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <MagnifyingGlassIcon className="w-10 h-10 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                No results found
              </h3>
              <p className="text-neutral-600 dark:text-neutral-400">
                No categories or services found for "{searchTerm}". Try different keywords or browse all categories.
              </p>
            </div>
          </div>
        )}

        {/* Subcategories Modal */}
        {selectedCategory && (
          <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1">
                    {selectedCategory.subcategories.length} services available
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="w-6 h-6 text-neutral-500" />
                </button>
              </div>

              {/* Search in Modal */}
              <div className="p-6 border-b border-neutral-200 dark:border-neutral-700">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder={`Search in ${selectedCategory.name}...`}
                    value={modalSearchTerm}
                    onChange={(e) => setModalSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition text-neutral-900 dark:text-neutral-100"
                  />
                </div>
              </div>

              {/* Subcategories List */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {filteredModalSubcategories.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {filteredModalSubcategories.map((subcategory) => (
                      <Link
                        key={subcategory}
                        href={`/listing-stay-map?category=${encodeURIComponent(selectedCategory.name)}&subcategory=${encodeURIComponent(subcategory)}`}
                        className="flex items-center p-4 rounded-xl hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-600 group transition-all duration-200"
                        onClick={closeModal}
                      >
                        <div className="w-3 h-3 bg-primary-500 rounded-full mr-4 group-hover:scale-125 transition-transform"></div>
                        <span className="text-neutral-700 dark:text-neutral-300 group-hover:text-primary-700 dark:group-hover:text-primary-300 font-medium">
                          {subcategory}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MagnifyingGlassIcon className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
                    <p className="text-neutral-600 dark:text-neutral-400">
                      No subcategories found for "{modalSearchTerm}"
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    {filteredModalSubcategories.length} of {selectedCategory.subcategories.length} services shown
                  </span>
                  <button
                    onClick={closeModal}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors font-medium"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoriesPage;
