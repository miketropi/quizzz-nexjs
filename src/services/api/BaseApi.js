/**
 * BaseApi - A foundation class for making API requests
 * 
 * This class provides common functionality for API requests including:
 * - Configurable base URL
 * - Default headers
 * - Authentication token management
 * - Request/response interceptors
 * - Error handling
 */
export default class BaseApi {
  constructor(baseURL = '', options = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    this.authToken = null;
    this.onUnauthorized = options.onUnauthorized || (() => {});
  }

  /**
   * Set the authentication token for API requests
   * @param {string} token - The authentication token
   */
  setAuthToken(token) {
    this.authToken = token;
  }

  /**
   * Get the current headers including auth token if present
   * @returns {Object} - Headers object
   */
  getHeaders() {
    const headers = { ...this.defaultHeaders };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }

  /**
   * Build the full URL for a request
   * @param {string} endpoint - The API endpoint
   * @returns {string} - The complete URL
   */
  buildUrl(endpoint) {
    return `${this.baseURL}${endpoint}`;
  }

  /**
   * Process the API response
   * @param {Response} response - The fetch Response object
   * @returns {Promise<any>} - The parsed response data
   * @throws {Error} - For non-2xx responses
   */
  async handleResponse(response) {
    const data = response.headers.get('Content-Type')?.includes('application/json')
      ? await response.json()
      : await response.text();
    
    if (!response.ok) {
      // Handle 401 Unauthorized specifically
      if (response.status === 401) {
        this.onUnauthorized();
      }
      
      const error = new Error(
        data?.message || 
        data?.error || 
        `Request failed with status ${response.status}`
      );
      
      error.status = response.status;
      error.data = data;
      throw error;
    }
    
    return data;
  }

  /**
   * Make a GET request
   * @param {string} endpoint - The API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async get(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      ...options,
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a POST request
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async post(endpoint, data = {}, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a PUT request
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async put(endpoint, data = {}, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a PATCH request
   * @param {string} endpoint - The API endpoint
   * @param {Object} data - The request body
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async patch(endpoint, data = {}, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
      ...options,
    });
    
    return this.handleResponse(response);
  }

  /**
   * Make a DELETE request
   * @param {string} endpoint - The API endpoint
   * @param {Object} options - Additional fetch options
   * @returns {Promise<any>} - The response data
   */
  async delete(endpoint, options = {}) {
    const url = this.buildUrl(endpoint);
    const response = await fetch(url, {
      method: 'DELETE',
      headers: this.getHeaders(),
      ...options,
    });
    
    return this.handleResponse(response);
  }
} 