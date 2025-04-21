import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { useParams } from 'react-router-dom';

const Menu = () => {
  const { restaurantId } = useParams(); // 从路由获取当前餐厅ID
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({
    no: '',
    food: '',
    style: '',
    score: ''
  });
  const [loading, setLoading] = useState(false);

  // 获取当前餐厅的菜单
  useEffect(() => {
    fetchMenuItems();
  }, [restaurantId]);

  const fetchMenuItems = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Menu')
      .select('*')
      .eq('restaurant', restaurantId)
      .order('no', { ascending: true });

    if (!error) {
      setMenuItems(data || []);
    } else {
      console.error('Error fetching menu items:', error);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async () => {
    if (!newItem.no || !newItem.food || !newItem.style || !newItem.score) {
      alert('请填写所有字段');
      return;
    }

    setLoading(true);
    const currentDate = new Date().toISOString().split('T')[0]; // 获取当前日期 YYYY-MM-DD

    const { data, error } = await supabase
      .from('Menu')
      .insert([
        {
          no: newItem.no,
          food: newItem.food,
          style: newItem.style,
          score: parseFloat(newItem.score),
          restaurant: restaurantId,
          date: currentDate
        }
      ]);

    if (!error) {
      // 清空输入框并刷新列表
      setNewItem({
        no: '',
        food: '',
        style: '',
        score: ''
      });
      await fetchMenuItems();
    } else {
      console.error('Error adding menu item:', error);
      alert('添加失败，请重试');
    }
    setLoading(false);
  };

  return (
    <div className="menu-container">
      <h2>餐厅菜单</h2>
      
      {/* 菜单列表 */}
      <div className="menu-list">
        {loading && menuItems.length === 0 ? (
          <p>加载中...</p>
        ) : menuItems.length > 0 ? (
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
                <tr key={`${item.no}-${item.date}`}>
                  <td>{item.no}</td>
                  <td>{item.food}</td>
                  <td>{item.style}</td>
                  <td>{item.score}</td>
                  <td>{item.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>暂无菜单数据</p>
        )}
      </div>

      {/* 添加新菜单项表单 */}
      <div className="add-menu-form">
        <h3>添加新菜品</h3>
        <div className="form-group">
          <label>No.</label>
          <input
            type="text"
            name="no"
            value={newItem.no}
            onChange={handleInputChange}
            placeholder="输入编号"
          />
        </div>
        <div className="form-group">
          <label>Food</label>
          <input
            type="text"
            name="food"
            value={newItem.food}
            onChange={handleInputChange}
            placeholder="输入菜品名称"
          />
        </div>
        <div className="form-group">
          <label>Style</label>
          <input
            type="text"
            name="style"
            value={newItem.style}
            onChange={handleInputChange}
            placeholder="输入菜品类型"
          />
        </div>
        <div className="form-group">
          <label>Score</label>
          <input
            type="number"
            name="score"
            value={newItem.score}
            onChange={handleInputChange}
            placeholder="输入评分"
            step="0.1"
            min="0"
            max="10"
          />
        </div>
        <button 
          onClick={handleAddItem}
          disabled={loading}
        >
          {loading ? '添加中...' : 'Add'}
        </button>
      </div>
    </div>
  );
};

export default Menu;
