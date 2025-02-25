import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        const { data, error } = await supabase
            .from('restaurants')
            .select('*');

        if (error) console.error('Error fetching restaurants:', error);
        else setRestaurants(data);
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
            <Link to="/add-restaurant">
                <button>Add Restaurant</button>
            </Link>
        </div>
    );
};

export default RestaurantList;
