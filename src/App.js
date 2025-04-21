import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login'; // 登录页面组件
import RestaurantList from './pages/RestaurantList'; // 餐厅列表页面
import RestaurantAdmin from './pages/RestaurantAdmin'; // 添加餐厅页面
import Menu from './pages/Menu'; // 菜单页面组件
// 在 App.js 中添加路由配置
<Route path="/restaurant/:restaurantId/menu" element={<Menu />} />

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 登录成功后的回调函数
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        {/* 默认路径，显示登录页面 */}
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/restaurants" /> // 如果已登录，跳转到餐厅列表
            ) : (
              <Login onLogin={handleLogin} /> // 如果未登录，显示登录页面
            )
          }
        />
        {/* 餐厅列表页面 */}
        <Route
          path="/restaurants"
          element={
            isLoggedIn ? (
              <RestaurantList /> // 如果已登录，显示餐厅列表
            ) : (
              <Navigate to="/" /> // 如果未登录，跳转到登录页面
            )
          }
        />
        {/* 添加餐厅页面 */}
        <Route
          path="/restaurants/add"
          element={
            isLoggedIn ? (
              <RestaurantAdmin /> // 如果已登录，显示添加餐厅页面
            ) : (
              <Navigate to="/" /> // 如果未登录，跳转到登录页面
            )
          }
        />
        {/* 菜单页面 */}
        <Route
          path="/restaurants/:id/menu"
          element={
            isLoggedIn ? (
              <Menu /> // 如果已登录，显示菜单页面
            ) : (
              <Navigate to="/" /> // 如果未登录，跳转到登录页面
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
