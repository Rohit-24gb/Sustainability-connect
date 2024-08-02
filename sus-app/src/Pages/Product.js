
import React from "react";
import { Routes, Route} from "react-router-dom";
import ProductNav from "../components/ProductNav/ProductNav";
import ShopCategory from "./ShopCategory";
import Newsletter from "../components/Newsletter/Newsletter";
import Footer from "../components/Footer/Footer";
import personal_care_banner from "../assets/personal-care-banner.jpg";
import stationery_banner from "../assets/stationery_banner.png";
import electronic_banner from "../assets/electronic_banner.jpg";
import clothing_banner from "../assets/clothing_banner.png";
import kitchen_banner from "../assets/kitchen_banner.png";
import accessories_banner from "../assets/accessories.png";
import beauty_banner from "../assets/beauty_banner.png";
import fitness_banner from "../assets/fitness_banner.png";
import household_banner from "../assets/household_banner.png";
import cleaning_banner from "../assets/cleaning_banner.png";
import technology_banner from "../assets/technology_banner.png";
import RecycleableItems from '../components/RecycleableItems/RecycleableItems'

const ProductPage = () => {

  return (
    <div>
      <ProductNav />

      <Routes>
        {/* <Route path="/shop" /> */}

        <Route
          path="/personal-care"
          element={
            <ShopCategory banner={personal_care_banner} categoryID={1} />
          }
        />

        <Route
          path="/stationery"
          element={<ShopCategory banner={stationery_banner} categoryID={2} />}
        />

        <Route
          path="/electronics"
          element={<ShopCategory banner={electronic_banner} categoryID={3} />}
        />

        <Route
          path="/clothing"
          element={<ShopCategory banner={clothing_banner} categoryID={4} />}
        />

        <Route
          path="/kitchen"
          element={<ShopCategory banner={kitchen_banner} categoryID={5} />}
        />

        <Route
          path="/accessories"
          element={<ShopCategory banner={accessories_banner} categoryID={6} />}
        />

        <Route
          path="/household"
          element={<ShopCategory banner={household_banner} categoryID={7} />}
        />

        <Route
          path="/cleaning"
          element={<ShopCategory banner={cleaning_banner} categoryID={8} />}
        />

        <Route
          path="/beauty"
          element={<ShopCategory banner={beauty_banner} categoryID={9} />}
        />

        <Route
          path="/fitness"
          element={<ShopCategory banner={fitness_banner} categoryID={10} />}
        />

        <Route
          path="/technology"
          element={<ShopCategory banner={technology_banner} categoryID={11} />}
        />

      </Routes>

      <RecycleableItems/>
      <Newsletter />
      <Footer />
    </div>
  );
};

export default ProductPage;

