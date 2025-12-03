import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../services/OrderService.jsx";
import Swal from "sweetalert2";

const AddOrder = () => {
  const [formData, setFormData] = useState({
    productId: "",
    qty: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: ""
  });
  
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.qty) newErrors.qty = "Quantity is required";
    if (formData.qty && (isNaN(formData.qty) || formData.qty <= 0)) newErrors.qty = "Quantity must be a positive number";
    if (!formData.customerName) newErrors.customerName = "Customer name is required";
    if (!formData.customerEmail) newErrors.customerEmail = "Customer email is required";
    if (formData.customerEmail && !/\S+@\S+\.\S+/.test(formData.customerEmail)) newErrors.customerEmail = "Email is invalid";
    if (!formData.shippingAddress) newErrors.shippingAddress = "Shipping address is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const orderData = {
        ...formData,
        productId: parseInt(formData.productId),
        qty: parseInt(formData.qty)
      };
      
      await createOrder(orderData);
      
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Order created successfully!",
        timer: 2000,
        showConfirmButton: false
      });
      
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Failed to create order"
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-5">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Order</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="productId">
                Product *
              </label>
              <select
                name="productId"
                id="productId"
                value={formData.productId}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.productId ? "border-red-500" : ""
                }`}
              >
                <option value="">Select a product</option>
                <option value="1">Product 1</option>
                <option value="2">Product 2</option>
                <option value="3">Product 3</option>
              </select>
              {errors.productId && <p className="text-red-500 text-xs italic mt-1">{errors.productId}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="qty">
                Quantity *
              </label>
              <input
                type="number"
                name="qty"
                id="qty"
                value={formData.qty}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.qty ? "border-red-500" : ""
                }`}
                min="1"
              />
              {errors.qty && <p className="text-red-500 text-xs italic mt-1">{errors.qty}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerName">
                Customer Name *
              </label>
              <input
                type="text"
                name="customerName"
                id="customerName"
                value={formData.customerName}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.customerName ? "border-red-500" : ""
                }`}
                placeholder="John Doe"
              />
              {errors.customerName && <p className="text-red-500 text-xs italic mt-1">{errors.customerName}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerEmail">
                Customer Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                id="customerEmail"
                value={formData.customerEmail}
                onChange={handleChange}
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.customerEmail ? "border-red-500" : ""
                }`}
                placeholder="john@example.com"
              />
              {errors.customerEmail && <p className="text-red-500 text-xs italic mt-1">{errors.customerEmail}</p>}
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="customerPhone">
                Customer Phone
              </label>
              <input
                type="text"
                name="customerPhone"
                id="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="+1234567890"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shippingAddress">
                Shipping Address *
              </label>
              <textarea
                name="shippingAddress"
                id="shippingAddress"
                value={formData.shippingAddress}
                onChange={handleChange}
                rows="3"
                className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  errors.shippingAddress ? "border-red-500" : ""
                }`}
                placeholder="123 Main St, City, Country"
              ></textarea>
              {errors.shippingAddress && <p className="text-red-500 text-xs italic mt-1">{errors.shippingAddress}</p>}
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrder;