import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Menu.css';

function Menu() {
  const { restaurantName } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu')
          .select('*')
          .eq('restaurant', decodeURIComponent(restaurantName))
          .order('score', { ascending: false }); // 按分数降序排列

        if (error) throw error;
        
        setMenuItems(data);
      } catch (error) {
        console.error('Error fetching menu items:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [restaurantName]);

  if (loading) return <div className="loading">加载中...</div>;

  return (
    <div className="menu-container">
      <h1>{decodeURIComponent(restaurantName)} 菜单</h1>
      <div className="menu-header">
        <span>菜品</span>
        <span>类型</span>
        <span>评分</span>
      </div>
      
      {menuItems.length > 0 ? (
        <ul className="menu-list">
          {menuItems.map((item) => (
            <li key={item.no} className="menu-item">
              <span className="food-name">{item.food}</span>
              <span className="food-style">{item.style}</span>
              <span className="food-score">{item.score.toFixed(1)}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-items">暂无菜单数据</p>
      )}
    </div>
  );
}

export default Menu;
