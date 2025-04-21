import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Menu.css';

const Menu = () => {
    const { restaurantId } = useParams();
    const navigate = useNavigate();
    const [menuItems, setMenuItems] = useState([]);
    const [formData, setFormData] = useState({
        no: '',
        food: '',
        style: '',
        score: ''
    });

    useEffect(() => {
        fetchMenuItems();
    }, [restaurantId]);

    const fetchMenuItems = async () => {
        const { data, error } = await supabase
            .from('menu')
            .select('*')
            .eq('restaurant', restaurantId)
            .order('no', { ascending: true });

        if (error) {
            console.error('Error fetching menu items:', error);
        } else {
            setMenuItems(data || []);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        
        if (!formData.no || !formData.food || !formData.style || !formData.score) {
            alert('请填写所有字段');
            return;
        }

        const currentDate = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('menu')
            .insert([
                {
                    ...formData,
                    restaurant: restaurantId,
                    date: currentDate,
                    score: parseFloat(formData.score)
                }
            ])
            .select();

        if (error) {
            console.error('Error adding menu item:', error);
            alert('添加失败: ' + error.message);
        } else {
            setFormData({
                no: '',
                food: '',
                style: '',
                score: ''
            });
            fetchMenuItems(); // 刷新列表
        }
    };

    return (
        <div className="menu-container">
            <h1>餐厅菜单管理</h1>
            <button onClick={() => navigate(-1)}>返回餐厅列表</button>
            
            <div className="menu-list">
                <h2>现有菜单项</h2>
                <table>
                    <thead>
                        <tr>
                            <th>编号</th>
                            <th>菜品</th>
                            <th>类型</th>
                            <th>评分</th>
                            <th>日期</th>
                        </tr>
                    </thead>
                    <tbody>
                        {menuItems.map(item => (
                            <tr key={item.id}>
                                <td>{item.no}</td>
                                <td>{item.food}</td>
                                <td>{item.style}</td>
                                <td>{item.score}</td>
                                <td>{item.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="add-form">
                <h2>添加新菜品</h2>
                <form onSubmit={handleAddItem}>
                    <div className="form-group">
                        <label>编号:</label>
                        <input
                            type="text"
                            name="no"
                            value={formData.no}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>菜品名称:</label>
                        <input
                            type="text"
                            name="food"
                            value={formData.food}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>菜品类型:</label>
                        <input
                            type="text"
                            name="style"
                            value={formData.style}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>评分:</label>
                        <input
                            type="number"
                            name="score"
                            value={formData.score}
                            onChange={handleInputChange}
                            step="0.1"
                            min="0"
                            max="10"
                            required
                        />
                    </div>
                    <button type="submit">添加菜品</button>
                </form>
            </div>
        </div>
    );
};

export default Menu;
