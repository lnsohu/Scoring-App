import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const RestaurantAdmin = () => {
    const [name, setName] = useState('');
    const [feature, setFeature] = useState('');
    const [height, setHeight] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { data, error } = await supabase
            .from('hk_restaurant')
            .insert([{ name, feature, height, status }]);

        if (error) {
            console.error('Error adding restaurant:', error);
        } else {
            console.log(data); // 直接使用 data 变量
            navigate('/restaurants'); // 保存成功后跳转回餐厅列表
        }
    };

    return (
        <div>
            <h1>Add Restaurant</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Restaurant Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Restaurant Feature:</label>
                    <input
                        type="text"
                        value={feature}
                        onChange={(e) => setFeature(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Restaurant Height:</label>
                    <input
                        type="text"
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Restaurant Status:</label>
                    <input
                        type="text"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Save</button>
            </form>
        </div>
    );
};

export default RestaurantAdmin;
