import PropTypes from 'prop-types';
import { useContext } from 'react';
import { Link } from 'react-router-dom';

const ProductItem = ({ _id, img, name, price, category, subCategory, rating }) => {

  return (
    <Link to={`/product/${_id}`} className="text-gray-700 cursor-pointer">
      <div className="overflow-hidden border rounded-lg p-4 shadow-sm h-[350px]">
        <img
          src={img}
          alt={name}
          className="w-full h-48 object-cover mb-2 rounded hover:scale-110 transition ease-in-out duration-500"
        />
        <p className="pt-3 pb-1 text-sm">{name}</p>
        <p className="text-xs text-gray-500">{category} / {subCategory}</p>
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">
            $
            {price}
          </p>
          <div className="text-xs text-yellow-500 flex items-center">
            <span className="mr-1">{rating}</span>
            <i className="fa fa-star"></i>
          </div>
        </div>
      </div>
    </Link>
  );
};

// Add prop validation
ProductItem.propTypes = {
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  img: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  subCategory: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
};

export default ProductItem;
