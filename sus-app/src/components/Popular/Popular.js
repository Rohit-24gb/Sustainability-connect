import React, { useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import "./Popular.css";
import axios from 'axios'; // You can also use fetch if you prefer
import Item from "../Items/Item"; // Ensure this path is correct

const Popular = ({product}) => {
   const [products, setProducts] = useState([]);
   const navigate = useNavigate();

   useEffect(() => {
      // Fetch data from the API
      const fetchProducts = async () => {
         try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
            // Assuming the response data is an array of products
            setProducts(response.data.slice(0, 4)); // Display only the first 4 products
         } catch (error) {
            console.error('Error fetching products:', error);
         }
      };

      fetchProducts();
   }, []);

   const handleClick = () => {
      console.log('Product clicked:', product.productId);
      navigate(`/product/${product.productID}`);
    };

   return (
      <div className="Popular">
         <h1>Popular Products</h1>
         <hr />
         <div className="popular-item" onClick={handleClick}>
            {products.map((item, i) => (
               <Item
                  key={i}
                  id={item.id}
                  name={item.name}
                  image={item.image_url}
                  new_price={item.price}
                  // old_price={item.old_price}
               />
            ))}
         </div>
      </div>
   );
}

export default Popular;
