import { useEffect, useState } from 'react';
import Title from '../Components/Title';
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartData, setCartData] = useState([]);
  const [products, setProducts] = useState([]);
  const [currency, setCurrency] = useState('$');  // Set your desired currency or fetch it dynamically if needed
  const [subtotal, setSubtotal] = useState(0); // Track subtotal
  const [total, setTotal] = useState(0); // Track total
  const user = JSON.parse(sessionStorage.getItem('user'));
  const navigate = useNavigate();

  // Function to calculate the subtotal and total
  const calculateTotal = () => {
    let newSubtotal = 0;
    let newTotal = 0;

    cartData.forEach((item) => {
      const product = products.find((product) => product._id === item._id);
      if (product) {
        const price = parseFloat(product.price.replace(/[^\d.-]/g, '')); // Clean up price string
        newSubtotal += price * item.quantity;
      }
    });

    // Here you can apply tax, shipping, or other charges to the total
    // For simplicity, we're assuming the total is just the subtotal in this example
    newTotal = newSubtotal;

    setSubtotal(newSubtotal);
    setTotal(newTotal);
  };

  // Fetch cart data and products
  useEffect(() => {
    if (user) {
      // Fetch cart data
      fetch(`http://localhost:3001/cart/${user.userId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            const tempData = data.cart.map((item) => ({
              _id: item.productId,
              size: item.size,
              quantity: item.quantity,
            }));
            setCartData(tempData);
          } else {
            console.log('Error fetching cart:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });

      // Fetch products data
      fetch('http://localhost:3001/get-product')
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          if (data.success) {
            setProducts(data.products);
          } else {
            console.log('Error fetching products:', data.message);
          }
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [user]);

  // Update quantity of product in cart
  const handleUpdateQuantity = (productId, size, newQty) => {
    if (newQty < 1) return;

    fetch('http://localhost:3001/update-quantity', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.userId,
        productId,
        size,
        quantity: newQty,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedCartData = cartData.map((item) =>
            item._id === productId && item.size === size
              ? { ...item, quantity: newQty }
              : item
          );
          setCartData(updatedCartData);
          calculateTotal(); // Recalculate totals after quantity update
        } else {
          console.log('Error updating quantity:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Delete product from cart
  const handleDeleteProduct = (productId, size) => {
    fetch('http://localhost:3001/delete-items', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.userId,
        productId,
        size,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedCartData = cartData.filter(
            (item) => item._id !== productId || item.size !== size
          );
          setCartData(updatedCartData);
          calculateTotal(); // Recalculate totals after deletion
        } else {
          console.log('Error deleting product:', data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // Recalculate totals when cartData or products change
  useEffect(() => {
    if (cartData.length > 0 && products.length > 0) {
      calculateTotal();
    }
  }, [cartData, products]);

  return (
    <div className="pt-14 border-t">
      <div className="mb-3 text-2xl">
        <Title text1={'YOUR'} text2={'CART'} />
      </div>

      {/* Cart Items */}
      <div>
        {cartData.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cartData.map((item, index) => {
            const productsData = products.find(
              (product) => product._id === item._id
            );

            if (!productsData) {
              return (
                <div key={index} className="py-3 border-b border-t text-gray-700">
                  <p>Product not found</p>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="py-3 border-b border-t text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    src={productsData.img}
                    alt=""
                    className="w-16 sm:w-20"
                  />
                  <div>
                    <p className="text-sm sm:text-lg font-medium">
                      {productsData.name}
                    </p>

                    <div className="flex items-center gap-5 mt-2">
                      <p className=" ">
                        {currency}
                        {productsData.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 ">
                        {item.size}
                      </p>
                    </div>
                  </div>
                </div>

                <input
                  onChange={(e) => {
                    const newQty =
                      e.target.value === '' || e.target.value < 0
                        ? 1
                        : Number(e.target.value);
                    handleUpdateQuantity(item._id, item.size, newQty);
                  }}
                  className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
                  type="number"
                  min={1}
                  value={item.quantity}
                />
                <img
                  onClick={() => handleDeleteProduct(item._id, item.size)}
                  src={assets.bin_icon}
                  alt=""
                  className="w-4 mr-4 sm:w-5 cursor-pointer"
                />
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-end my-20">
        <div className="w-full sm:w-[450px]">
          {/* Cart Total */}
          <div className="border-b py-3 flex justify-between">
            <p className="text-lg">Subtotal:</p>
            <p className="text-lg">{currency}{subtotal.toFixed(2)}</p>
          </div>
          <div className="border-b py-3 flex justify-between">
            <p className="text-lg">Total:</p>
            <p className="text-lg">{currency}{total.toFixed(2)}</p>
          </div>

          <div className="w-full text-end">
            <button
              onClick={() => {
                navigate('/place-order');
              }}
              className="my-8 px-8 py-3 bg-black text-white text-sm"
            >
              PROCEED TO CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
