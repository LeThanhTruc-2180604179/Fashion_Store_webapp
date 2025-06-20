import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProducts, getProductById as fetchProductById, addProduct, updateProduct, deleteProduct } from '../services/api';

const ProductContext = createContext();

const sampleProducts = [
  {
    id: '1',
    name: 'Áo Thun Nam',
    brand: 'Nike',
    price: 300000,
    originalPrice: 350000,
    colors: ['Black', 'White'],
    sizes: ['M', 'L'],
    images: [
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
      'https://via.placeholder.com/300',
    ],
    category: 'T-Shirts',
    gender: 'Male',
    description: 'Áo thun chất lượng cao từ Nike.',
    inStock: true,
    rating: 4.5,
    reviews: 20,
    createdAt: new Date().toISOString(),
  },
  // Add more sample products if needed
];

const normalizeProduct = (product) => ({
  ...product,
  colors: Array.isArray(product.colors) ? product.colors : (typeof product.colors === 'string' ? product.colors.split(',').map(c => c.trim()) : []),
  sizes: Array.isArray(product.sizes) ? product.sizes : (typeof product.sizes === 'string' ? product.sizes.split(',').map(s => s.trim()) : []),
  images: Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? product.images.split(',').map(i => i.trim()) : []),
});

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    gender: '',
    brand: '',
    priceRange: [0, Infinity],
    colors: [],
    sizes: [],
  });

  // Danh mục chính và subcategories
  const mainCategories = [
    {
      id: 'ALL',
      name: 'All',
      subcategories: [
        { id: 'T-Shirts', name: 'T-Shirts' },
        { id: 'Jeans', name: 'Jeans' },
        { id: 'Jackets', name: 'Jackets' },
        { id: 'Shorts', name: 'Shorts' },
        { id: 'Hoodies', name: 'Hoodies' },
        { id: 'Sweatshirts', name: 'Sweatshirts' },
        { id: 'Pants', name: 'Pants' },
        { id: 'Dresses', name: 'Dresses' },
        { id: 'Skirts', name: 'Skirts' },
        { id: 'Accessories', name: 'Accessories' },
      ],
    },
    {
      id: 'MEN',
      name: 'Men',
      subcategories: [
        { id: 'T-Shirts', name: 'T-Shirts' },
        { id: 'Jeans', name: 'Jeans' },
        { id: 'Jackets', name: 'Jackets' },
        { id: 'Shorts', name: 'Shorts' },
        { id: 'Hoodies', name: 'Hoodies' },
        { id: 'Sweatshirts', name: 'Sweatshirts' },
        { id: 'Pants', name: 'Pants' },
        { id: 'Accessories', name: 'Accessories' },
      ],
    },
    {
      id: 'WOMEN',
      name: 'Women',
      subcategories: [
        { id: 'T-Shirts', name: 'T-Shirts' },
        { id: 'Jeans', name: 'Jeans' },
        { id: 'Jackets', name: 'Jackets' },
        { id: 'Shorts', name: 'Shorts' },
        { id: 'Hoodies', name: 'Hoodies' },
        { id: 'Sweatshirts', name: 'Sweatshirts' },
        { id: 'Pants', name: 'Pants' },
        { id: 'Dresses', name: 'Dresses' },
        { id: 'Skirts', name: 'Skirts' },
        { id: 'Accessories', name: 'Accessories' },
      ],
    },
    {
      id: 'KIDS',
      name: 'Kids',
      subcategories: [
        { id: 'T-Shirts', name: 'T-Shirts' },
        { id: 'Jeans', name: 'Jeans' },
        { id: 'Jackets', name: 'Jackets' },
        { id: 'Shorts', name: 'Shorts' },
        { id: 'Hoodies', name: 'Hoodies' },
        { id: 'Sweatshirts', name: 'Sweatshirts' },
        { id: 'Pants', name: 'Pants' },
        { id: 'Accessories', name: 'Accessories' },
      ],
    },
    {
      id: 'SALE',
      name: 'Sale',
      subcategories: [
        { id: 'T-Shirts', name: 'T-Shirts' },
        { id: 'Jeans', name: 'Jeans' },
        { id: 'Jackets', name: 'Jackets' },
        { id: 'Shorts', name: 'Shorts' },
        { id: 'Hoodies', name: 'Hoodies' },
        { id: 'Sweatshirts', name: 'Sweatshirts' },
        { id: 'Pants', name: 'Pants' },
        { id: 'Dresses', name: 'Dresses' },
        { id: 'Skirts', name: 'Skirts' },
        { id: 'Accessories', name: 'Accessories' },
      ],
    },
  ];

  const genders = [
    { id: 'Male', name: 'Nam' },
    { id: 'Female', name: 'Nữ' },
    { id: 'Unisex', name: 'Unisex' },
  ];

  const brands = ['Nike', 'Adidas', 'OFF-WHITE', 'Bape'];
  const colors = ['Black', 'White', 'Red', 'Blue', 'Green'];
  const sizes = {
    clothing: ['S', 'M', 'L', 'XL'],
    shoes: ['38', '39', '40', '41', '42'],
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const normalized = data.length > 0 ? data.map(normalizeProduct) : sampleProducts;
      setProducts(normalized);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(sampleProducts);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredProducts = () => {
    return products.filter((product) => {
      // Lọc theo mainCategory
      let matchesMain = true;
      if (filters.mainCategory && filters.mainCategory !== 'ALL') {
        if (filters.mainCategory === 'SALE') {
          matchesMain = product.originalPrice > product.price;
        } else {
          matchesMain = product.mainCategory === filters.mainCategory;
        }
      }
      // Lọc theo category con
      const matchesCategory = filters.category ? product.category === filters.category : true;
      // Lọc theo gender nếu có chọn
      const matchesGender = filters.gender ? product.gender === filters.gender : true;
      // Lọc theo brand
      const matchesBrand = filters.brand ? product.brand === filters.brand : true;
      // Lọc theo giá
      const price = product.price;
      const maxPrice = typeof filters.price === 'number' ? filters.price : 100000000;
      const matchesPrice = price <= maxPrice;
      // Lọc theo màu
      const matchesColors = filters.colors && filters.colors.length > 0 ? filters.colors.some((color) => product.colors.includes(color)) : true;
      // Lọc theo size
      const matchesSizes = filters.sizes && filters.sizes.length > 0 ? filters.sizes.some((size) => product.sizes.includes(size)) : true;
      return (
        matchesMain &&
        matchesCategory &&
        matchesGender &&
        matchesBrand &&
        matchesPrice &&
        matchesColors &&
        matchesSizes
      );
    });
  };

  const getProductById = async (id) => {
    // Ưu tiên tìm trong products đã có
    let product = products.find((p) => p.id === id);
    if (product) return product;

    setLoading(true);
    try {
      product = await fetchProductById(id);
      return normalizeProduct(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      const localProduct = sampleProducts.find((p) => p.id === id);
      if (!localProduct) {
        throw new Error('Product not found');
      }
      return normalizeProduct(localProduct);
    } finally {
      setLoading(false);
    }
  };

  const addNewProduct = async (product) => {
    setLoading(true);
    try {
      const newProduct = await addProduct(product);
      setProducts([...products, newProduct]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateExistingProduct = async (id, updatedProduct) => {
    setLoading(true);
    try {
      const product = await updateProduct(id, updatedProduct);
      setProducts(products.map((p) => (p.id === id ? product : p)));
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteExistingProduct = async (id) => {
    setLoading(true);
    try {
      await deleteProduct(id);
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      gender: '',
      brand: '',
      priceRange: [0, Infinity],
      colors: [],
      sizes: [],
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        filters,
        categories: mainCategories,
        genders,
        brands,
        colors,
        sizes,
        getFilteredProducts,
        getProductById,
        addProduct: addNewProduct,
        updateProduct: updateExistingProduct,
        deleteProduct: deleteExistingProduct,
        updateFilters,
        clearFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export default ProductContext;