import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProducts, placeOrder } from '../services/api';
import { toast } from 'react-toastify';

function OrderForm() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    items: []
  });
  
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
        setLoading(false);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleProductSelect = (e) => {
    const productId = parseInt(e.target.value);
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedItems([...selectedItems, { 
          product_id: product.id, 
          name: product.name,
          price: product.price,
          quantity: 1 
        }]);
      }
    }
  };

  const handleQuantityChange = (index, value) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = parseInt(value);
    setSelectedItems(newItems);
  };

  const handleRemoveItem = (index) => {
    const newItems = [...selectedItems];
    newItems.splice(index, 1);
    setSelectedItems(newItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customer_name || !formData.customer_email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (selectedItems.length === 0) {
      toast.error('Please select at least one item');
      return;
    }
    
    try {
      const orderData = {
        ...formData,
        items: selectedItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };
      
      const response = await placeOrder(orderData);
      toast.success('Order placed successfully!');
      navigate(`/status?orderId=${response.order_id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to place order');
    }
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border"></div></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <div>
      <h2 className="mb-4">Place an Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="customer_name" className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="mb-3">
              <label htmlFor="customer_email" className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="customer_email"
                name="customer_email"
                value={formData.customer_email}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="form-label">Add Products</label>
          <div className="input-group">
            <select className="form-select" onChange={handleProductSelect} defaultValue="">
              <option value="" disabled>Select a product</option>
              {products.map(product => (
                <option key={product.id} value={product.id}>
                  {product.name} - ${product.price.toFixed(2)} ({product.stock} in stock)
                </option>
              ))}
            </select>
            <button 
              className="btn btn-outline-secondary" 
              type="button" 
              onClick={() => document.querySelector('select').value = ''}
            >
              Reset
            </button>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="mb-4">
            <h5>Order Items</h5>
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min="1"
                        max="100"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        style={{ width: '70px' }}
                      />
                    </td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                    <td>
                      <button 
                        type="button" 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total:</td>
                  <td className="fw-bold">${calculateTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        <div className="d-grid gap-2 d-md-flex justify-content-md-end">
          <button type="submit" className="btn btn-primary">Place Order</button>
        </div>
      </form>
    </div>
  );
}

export default OrderForm;