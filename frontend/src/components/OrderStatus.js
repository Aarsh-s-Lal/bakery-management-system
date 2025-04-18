import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getOrderStatus } from '../services/api';
import { toast } from 'react-toastify';

function OrderStatus() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialOrderId = queryParams.get('orderId') || '';
  
  const [orderId, setOrderId] = useState(initialOrderId);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialOrderId) {
      fetchOrderStatus(initialOrderId);
    }
  }, [initialOrderId]);

  const fetchOrderStatus = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderStatus(id);
      setOrderData(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch order status');
      toast.error('Failed to fetch order status');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setOrderId(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!orderId) {
      toast.error('Please enter an order ID');
      return;
    }
    fetchOrderStatus(orderId);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'bg-warning';
      case 'processing': return 'bg-info';
      case 'completed': return 'bg-success';
      case 'cancelled': return 'bg-danger';
      default: return 'bg-secondary';
    }
  };

  return (
    <div>
      <h2 className="mb-4">Order Status</h2>
      
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="input-group">
          <input
            type="number"
            className="form-control"
            placeholder="Enter Order ID"
            value={orderId}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn btn-primary">Check Status</button>
        </div>
      </form>

      {loading && <div className="text-center py-3"><div className="spinner-border"></div></div>}
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      {orderData && !loading && !error && (
        <div className="card">
          <div className="card-header">
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Order #{orderData.order_id}</h5>
              <span className={`badge ${getStatusBadgeClass(orderData.status)}`}>
                {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
              </span>
            </div>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <strong>Customer:</strong> {orderData.customer_name}<br />
              <strong>Date:</strong> {new Date(orderData.created_at).toLocaleString()}
            </div>
            
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.product_name}</td>
                    <td>${item.unit_price.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${item.total_price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Grand Total:</td>
                  <td className="fw-bold">${orderData.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderStatus;