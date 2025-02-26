import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        // 硬编码的用户名和密码
        if (username === 'admin' && password === 'password') {
            onLogin(); // 调用父组件传递的回调函数
            navigate('/restaurants'); // 跳转到餐厅列表页面
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="app">
            <form onSubmit={handleLogin} className="login-form">
                <h1>Login</h1>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
