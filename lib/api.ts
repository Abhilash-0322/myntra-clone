export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

export interface CartItem extends Product {
  quantity: number;
  size?: string;
}

const API_BASE_URL = 'https://fakestoreapi.com';

// Add retry logic for better reliability
async function fetchWithRetry(url: string, retries = 3): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 }, // Cache for 1 hour
      });
      if (response.ok) {
        return response;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries exceeded');
}

export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/products`);
    const products = await response.json();
    
    // Validate the response structure
    if (!Array.isArray(products)) {
      throw new Error('Invalid response format');
    }
    
    return products.filter(product => 
      product && 
      typeof product.id === 'number' && 
      typeof product.title === 'string' &&
      typeof product.price === 'number' &&
      typeof product.image === 'string'
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function fetchProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/products/${id}`);
    const product = await response.json();
    
    // Validate product structure
    if (!product || typeof product.id !== 'number') {
      return null;
    }
    
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function fetchCategories(): Promise<string[]> {
  try {
    const response = await fetchWithRetry(`${API_BASE_URL}/products/categories`);
    const categories = await response.json();
    
    if (!Array.isArray(categories)) {
      throw new Error('Invalid categories response');
    }
    
    return categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}

export async function fetchProductsByCategory(category: string): Promise<Product[]> {
  try {
    // Encode the category to handle special characters and spaces
    const encodedCategory = encodeURIComponent(category);
    const response = await fetchWithRetry(`${API_BASE_URL}/products/category/${encodedCategory}`);
    const products = await response.json();
    
    // Validate the response structure
    if (!Array.isArray(products)) {
      throw new Error('Invalid response format');
    }
    
    return products.filter(product => 
      product && 
      typeof product.id === 'number' && 
      typeof product.title === 'string' &&
      typeof product.price === 'number' &&
      typeof product.image === 'string'
    );
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}