
import './App.css';
import Navbar from './Component/Assets/Navbar/Navbar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Shop from './Pages/Shop';
import Login from './Pages/Login';
import Footer from './Component/Footer/Footer';
import men_banner from './Component/Assets/Assets/banner_mens.png'
import women_banner from './Component/Assets/Assets/banner_women.png'
import kids_banner from './Component/Assets/Assets/banner_kids.png'







function App() {
  return (
    <div>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/shop' element={<Shop />} />
          <Route path='/mens' element={<ShopCategory banner={men_banner} category="men" />} />
          <Route path='/womens' element={<ShopCategory banner={women_banner} category="women" />} />
          <Route path='/kids' element={<ShopCategory banner={kids_banner} category="kid" />} />
          <Route path='/product' element={<Product />}>
            <Route path=':productid' element={<Product />} />
          </Route>
          <Route path='/Cart' element={<Cart />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Footer />
      </BrowserRouter>


    </div>
  );
}

export default App;
