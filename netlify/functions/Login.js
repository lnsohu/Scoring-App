exports.handler = async (event, context) => {
    const { username, password } = JSON.parse(event.body);

    // 硬编码的用户名和密码（仅示例，实际应用中应使用数据库验证）
    if (username === 'admin' && password === 'password') {
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Login successful' }),
        };
    } else {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Invalid username or password' }),
        };
    }
};
