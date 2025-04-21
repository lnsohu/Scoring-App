import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import RestaurantList from './pages/RestaurantList';
import RestaurantAdmin from './pages/RestaurantAdmin';
import Menu from './pages/Menu';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* 默认路径 */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/restaurants" />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        
        {/* 餐厅列表页面 */}
        <Route
          path="/restaurants"
          element={
            isLoggedIn ? (
              <RestaurantList />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
        {/* 添加餐厅页面 */}
        <Route
          path="/restaurants/add"
          element={
            isLoggedIn ? (
              <RestaurantAdmin />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        
        {/* 修改后的菜单页面路由 - 与RestaurantList.js跳转路径保持一致 */}
        <Route
          path="/menu/:restaurantId"
          element={
            isLoggedIn ? (
              <Menu />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
