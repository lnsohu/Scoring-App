import React, { useState } from 'react';
import './styles.css';

const App = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // Hardcoded username and password
        if (username === 'admin' && password === 'password') {
            setIsLoggedIn(true);
        } else {
            alert('Invalid username or password');
        }
    };

    return (
        <div className="app">
            {!isLoggedIn ? (
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
            ) : (
                <div className="welcome-message">
                    <h1>Welcome, Admin!</h1>
                    <p>You are now logged in.</p>
                </div>
            )}
        </div>
    );
};

export default App;
