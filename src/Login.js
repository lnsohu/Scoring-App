// src/Login.js

import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // 这里可以添加硬编码的登录逻辑
    if (username === 'admin' && password === 'password') {
      alert('登录成功');
    } else {
      alert('登录失败');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          用户名：
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </label>
      </div>
      <div>
        <label>
          密码：
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
        </label>
      </div>
      <button type="submit">登录</button>
    </form>
  );
};

export default Login;
