import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  // Initial state for product data
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    img: "",
    category: "Boys' Wear", // Default category
    rating: 5,
    inStockValue: 0,
    soldStockValue: 0,
    visibility: "on",
  });

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setProductData((prevState) => ({
      ...prevState,
      [name]: files[0],
    }));
  };

  // Handle form submission to add new product
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", productData.name);
      formData.append("price", productData.price);
      formData.append("category", productData.category);
      formData.append("rating", productData.rating);
      formData.append("inStockValue", productData.inStockValue);
      formData.append("soldStockValue", productData.soldStockValue);
      formData.append("visibility", productData.visibility);
      if (productData.img) {
        formData.append("img", productData.img);
      }

      const response = await axios.post(
        `http://localhost:3001/create-product`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full gap-3">
      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          type="text"
          name="name"
          value={productData.name}
          onChange={handleChange}
          className="w-full px-3 py-2"
          placeholder="Enter Product Name"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Price</p>
        <input
          type="number"
          name="price"
          value={productData.price}
          onChange={handleChange}
          className="w-full px-3 py-2"
          placeholder="Enter Price"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Image</p>
        <input
          type="file"
          name="img"
          onChange={handleFileChange}
          className="w-full px-3 py-2"
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Category</p>
        <select
          name="category"
          value={productData.category}
          onChange={handleChange}
          className="w-full px-3 py-2"
        >
          <option value="Boys' Wear">Boys' Wear</option>
          <option value="Girls' Wear">Girls' Wear</option>
          <option value="Sarees">Sarees</option>
          <option value="Ganzy Clothes">Ganzy Clothes</option>
          <option value="Men's Wear">Men's Wear</option>
          <option value="Women's Wear">Women's Wear</option>
        </select>
      </div>

      <div className="w-full">
        <p className="mb-2">Stock Availability</p>
        <input
          type="number"
          name="inStockValue"
          value={productData.inStockValue}
          onChange={handleChange}
          className="w-full px-3 py-2"
          placeholder="In Stock"
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Sold Stock</p>
        <input
          type="number"
          name="soldStockValue"
          value={productData.soldStockValue}
          onChange={handleChange}
          className="w-full px-3 py-2"
          placeholder="Sold Stock"
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Visibility</p>
        <select
          name="visibility"
          value={productData.visibility}
          onChange={handleChange}
          className="w-full px-3 py-2"
        >
          <option value="on">On</option>
          <option value="off">Off</option>
        </select>
      </div>

      <div className="w-full">
        <button type="submit" className="btn-primary">
          Add Product
        </button>
      </div>
    </form>
  );
};

export default Add;
