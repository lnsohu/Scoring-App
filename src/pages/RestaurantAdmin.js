import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AddRestaurant = () => {
    const [name, setName] = useState('');
    const [feature, setFeature] = useState('');
    const [height, setHeight] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('restaurants')
            .insert([{ name, feature, height, status }]);

        if (error) {
            console.error('Error adding restaurant:', error);
        } else {
            navigate('/');
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

export default AddRestaurant;
