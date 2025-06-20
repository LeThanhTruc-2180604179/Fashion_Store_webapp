import axios from 'axios';

const API_BASE_URL = 'https://6850f5de8612b47a2c080c78.mockapi.io';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Get all products
export const getProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

// Get product by ID
export const getProductById = async (id) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch product');
  }
};

// Add a new product
export const addProduct = async (product) => {
  try {
    const response = await api.post('/products', product);
    return response.data;
  } catch (error) {
    throw new Error('Failed to add product');
  }
};

// Update a product
export const updateProduct = async (id, product) => {
  try {
    const response = await api.put(`/products/${id}`, product);
    return response.data;
  } catch (error) {
    throw new Error('Failed to update product');
  }
};

// Delete a product
export const deleteProduct = async (id) => {
  try {
    await api.delete(`/products/${id}`);
    return true;
  } catch (error) {
    throw new Error('Failed to delete product');
  }
};

export default api;