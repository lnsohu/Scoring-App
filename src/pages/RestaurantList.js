import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        const { data, error } = await supabase
            .from('hk_restaurant')
            .select('*');

        if (error) console.error('Error fetching restaurants:', error);
        else setRestaurants(data);
    };

    const handleAdd = () => {
        navigate('/restaurants/add'); // 跳转到添加餐厅页面
    };

    return (
        <div>
            <h1>Restaurant List</h1>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>
                        <strong>{restaurant.name}</strong> - {restaurant.feature} ({restaurant.status})
                    </li>
                ))}
            </ul>
            <button onClick={handleAdd}>Add Restaurant</button>
        </div>
    );
};

export default RestaurantList;
