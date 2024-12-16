import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';

const Product = () => {
  const { productId } = useParams();
  const [productsData, setProductsData] = useState(null); // Changed to null to handle loading state
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const [error, setError] = useState(''); // For handling errors (optional)

  // Function to fetch product data from the backend
  const fetchProductsData = async () => {
    try {
      const response = await fetch(`https://ecommerce-i5zq.onrender.com/product/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        setProductsData(data.product); // Set the product data from the API
        setImage(data.product.img); // Set the default image (if any)
      }
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  };

  useEffect(() => {
    fetchProductsData(); // Fetch data on mount and when productId changes
  }, [productId]);

  const handleAddToCart = async () => {
    const user = sessionStorage.getItem('user'); // Retrieve userId from sessionStorage
    const parsedUser = JSON.parse(user);
    const userId=parsedUser.userId

    if (!userId) {
      setError('Please log in to add items to the cart.');
      return; // If no user is logged in, show an error
    }

    // if (!size) {
    //   setError('Please select a size.');
    //   return; // If no size is selected, show an error
    // }

    try {
      const response = await fetch('http://localhost:3001/add-to-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          productId,
          quantity: 1, // Set quantity to 1 (you can modify this as needed)
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert('Product added to cart successfully!');
      } else {
        setError(data.message || 'Error adding product to cart.');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      setError('An error occurred. Please try again.');
    }
  };

  if (!productsData) {
    return <div>Loading...</div>; // Show a loading message while fetching
  }

  return (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* ---------------------- Products Data ---------------------- */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/* ---------------------- Product Images ---------------------- */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          {/* ---------------------- List Images ---------------------- */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productsData.img && (
              <img
                key={0}
                src={productsData.img}
                alt="product"
                onClick={() => setImage(productsData.img)}
                className="cursor-pointer w-[24%] sm:w-full sm:mb-3 flex-shrink-0 object-cover"
              />
            )}
          </div>

          {/* ---------------------- Main Image ---------------------- */}
          <div className="w-full sm:w-[80%]">
            <img
              src={image || 'default-image.jpg'} // Use default if no image is set
              alt="product"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* ---------------------- Product Details ---------------------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productsData.name}</h1>

          <div className="flex items-center gap-1 mt-2">
            {[...Array(Math.floor(productsData.rating))].map((_, index) => (
              <img key={index} src={assets.star_icon} alt="star" className="w-3.5" />
            ))}
            <p className="pl-2">({productsData.soldStockValue})</p>
          </div>

          <p className="mt-5 text-3xl font-medium">
            {productsData.currency}
            {productsData.price}
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">{productsData.description || 'No description available'}</p>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {productsData.sizes?.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSize(item)}
                  className={`w-8 h-8 border bg-gray-100 flex items-center justify-center cursor-pointer
                    ${item === size ? 'border-orange-500' : ''}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-black text-white py-3 px-8 text-sm active:bg-gray-700"
          >
            ADD TO CART
          </button>

          {error && <p className="text-red-500 mt-3">{error}</p>}

          <hr className="mt-8 sm:w-4/5" />

          <div className="flex flex-col gap-1 mt-5 text-sm text-gray-500">
            <p>100% Original product </p>
            <p>Free delivery on order above $49</p>
            <p>Easy return and exchange policy within 7 days </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
