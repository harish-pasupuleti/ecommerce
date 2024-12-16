import { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import Title from '../Components/Title';
import ProductItem from '../Components/ProductItem';
import axios from 'axios';  // For making API requests

const Collection = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [search, setSearch] = useState(''); // Managing search term locally
  const [showSearch, setShowSearch] = useState(false); // Managing search visibility

  // Fetch products from the backend on component mount
  useEffect(() => {
    axios.get('https://ecommerce-i5zq.onrender.com/get-product') // Endpoint for fetching products
      .then((response) => {
        if (response.data.success) {
          setFilterProducts(response.data.products); // Set products data
        } else {
          console.error('Error fetching products');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const toggleCategory = (e) => {
    const value = e.target.value;
    category.includes(value)
      ? setCategory((prev) => prev.filter((item) => item !== value))
      : setCategory((prev) => [...prev, value]);
  };

  const toggleSubCategory = (e) => {
    const value = e.target.value;
    subCategory.includes(value)
      ? setSubCategory((prev) => prev.filter((item) => item !== value))
      : setSubCategory((prev) => [...prev, value]);
  };

  const applyFilter = () => {
    if (!filterProducts || filterProducts.length === 0) return;

    let productsCopy = [...filterProducts];

    // Filter by search term
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase().trim())
      );
    }

    // Filter by category
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    // Filter by subcategory
    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProducts = () => {
    if (filterProducts.length === 0) return;

    let filteredProdCopy = [...filterProducts];

    switch (sortType) {
      case 'low-high':
        setFilterProducts(filteredProdCopy.sort((a, b) => a.price - b.price));
        break;
      case 'high-low':
        setFilterProducts(filteredProdCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        setFilterProducts(filteredProdCopy);
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => {
    sortProducts();
  }, [sortType]);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      <div className="min-w-52">
        <p
          onClick={() => {
            setShowFilter(!showFilter);
          }}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          {' '}
          Filters
          <img
            src={assets.dropdown_icon}
            alt=""
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
          />
        </p>

        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">CATEGORIES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Women'}
                onChange={toggleCategory}
              />
              WOMEN
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Girls'}
                onChange={toggleCategory}
              />
              GIRLS
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Boys'}
                onChange={toggleCategory}
              />
              BOYS
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Unisex'}
                onChange={toggleCategory}
              />
              UNISEX
            </p>
          </div>
        </div>

        {/* Subcategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}
        >
          <p className="mb-3 text-sm font-medium">TYPES</p>

          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Sarees'}
                onChange={toggleSubCategory}
              />
              Sarees
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Girls\' Wear'}
                onChange={toggleSubCategory}
              />
              Girls' Wear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Boys\' Wear'}
                onChange={toggleSubCategory}
              />
              Boys' Wear
            </p>
            <p className="flex gap-2">
              <input
                type="checkbox"
                className="w-3"
                value={'Ganzy Clothes'}
                onChange={toggleSubCategory}
              />
              Ganzy Clothes
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1">
        

        {/* Product Items */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {filterProducts.length > 0 ? (
            filterProducts.map((product) => (
              <ProductItem
                key={product.productId}
                {...product}
              />
            ))
          ) : (
            <p>No products found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
