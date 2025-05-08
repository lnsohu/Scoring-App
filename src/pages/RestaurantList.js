import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './RestaurantList.css'; // 引入样式文件

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('restaurants')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;
            setRestaurants(data || []);
        } catch (err) {
            console.error('获取餐厅列表失败:', err);
            setError('获取餐厅列表失败，请刷新重试');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        navigate('/restaurants/add');
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/menu/${restaurantId}`);
    };

    return (
        <div className="restaurant-list-container">
            <div className="restaurant-list-header">
                <h1>餐厅列表</h1>
                <button 
                    className="add-restaurant-btn"
                    onClick={handleAdd}
                >
                    ＋ 添加餐厅
                </button>
            </div>

            {loading ? (
                <div className="loading-indicator">
                    <p>加载中...</p>
                </div>
            ) : error ? (
                <div className="error-message">
                    <p>{error}</p>
                    <button onClick={fetchRestaurants}>重试</button>
                </div>
            ) : (
                <div className="restaurant-grid">
                    {restaurants.map((restaurant) => (
                        <div 
                            key={restaurant.id} 
                            className="restaurant-card"
                            onClick={() => handleRestaurantClick(restaurant.id)}
                        >
                            <div className="restaurant-info">
                                <h2>{restaurant.name}</h2>
                                <p className="restaurant-feature">
                                    <span className="info-label">特色:</span> {restaurant.feature || '暂无'}
                                </p>
                                <p className="restaurant-status">
                                    <span className="info-label">状态:</span> 
                                    <span className={`status-badge ${restaurant.status === '营业中' ? 'open' : 'closed'}`}>
                                        {restaurant.status}
                                    </span>
                                </p>
                                <p className="restaurant-height">
                                    <span className="info-label">楼层:</span> {restaurant.height || '未评级'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RestaurantList;
