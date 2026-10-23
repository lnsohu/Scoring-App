import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { useParams } from 'react-router-dom';
import './Menu.css';  // 添加这行

// 空白表单的初始值（每次重置都用一份新的拷贝，避免共享引用）
const emptyItem = {
  no: '',
  food: '',
  style: '',
  score: '',
  price: '',
  persistent: ''
};

// 定位一条菜单数据：优先用数据库主键 id，没有 id 时用 no + date 组合
const getItemKey = (item) =>
  item.id !== undefined && item.id !== null
    ? `id-${item.id}`
    : `${item.no}-${item.date}-${item.food}`;

// 价格显示：兼容 null / 数字字符串，避免 toFixed 报错
const formatPrice = (price) => {
  if (price === null || price === undefined || price === '') return '-';
  const value = Number(price);
  return Number.isNaN(value) ? '-' : `¥${value.toFixed(2)}`;
};

const Menu = () => {
  const { restaurantId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [newItem, setNewItem] = useState({ ...emptyItem });
  const [loading, setLoading] = useState(false);
  const [editingKey, setEditingKey] = useState(null); // 正在编辑的行的 key
  const [editItem, setEditItem] = useState({ ...emptyItem }); // 编辑中的临时数据
  const [savingKey, setSavingKey] = useState(null); // 正在保存的行的 key

  // 使用useCallback缓存函数以避免重复创建
  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('menu')
      .select('*')
      .eq('restaurant', restaurantId)
      .order('no', { ascending: true });

    if (!error) {
      setMenuItems(data || []);
    } else {
      console.error('Error fetching menu items:', error);
    }
    setLoading(false);
  }, [restaurantId]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddItem = async () => {
    if (!newItem.no.trim() || !newItem.food.trim() || !newItem.style.trim() || newItem.score === '' || newItem.price === '' || newItem.persistent === '') {
      alert('请填写所有字段');
      return;
    }

    setLoading(true);
    const currentDate = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('menu')
      .insert([
        {
          no: newItem.no.trim(),
          food: newItem.food.trim(),
          style: newItem.style.trim(),
          score: parseFloat(newItem.score),
          price: parseFloat(newItem.price),
          persistent: parseFloat(newItem.persistent),
          restaurant: restaurantId,
          date: currentDate
        }
      ]);

    if (!error) {
      setNewItem({ ...emptyItem });
      await fetchMenuItems();
    } else {
      console.error('Error adding menu item:', error);
      alert('添加失败，请重试');
    }
    setLoading(false);
  };

  // 点击“编辑”：把该行数据复制到临时表单
  const handleStartEdit = (item) => {
    setEditingKey(getItemKey(item));
    setEditItem({
      no: String(item.no ?? ''),
      food: String(item.food ?? ''),
      style: String(item.style ?? ''),
      score: item.score ?? '',
      price: item.price ?? '',
      persistent: item.persistent ?? ''
    });
  };

  // 编辑表单输入变化
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 取消编辑，丢弃未保存的修改
  const handleCancelEdit = () => {
    setEditingKey(null);
    setEditItem({ ...emptyItem });
  };

  // 保存编辑：有 id 用 id 定位，否则用 no + date + restaurant 定位
  const handleSaveEdit = async (item) => {
    if (!editItem.no.trim() || !editItem.food.trim() || !editItem.style.trim() || editItem.score === '') {
      alert('请填写编号、菜品、类型和评分');
      return;
    }

    const itemKey = getItemKey(item);
    setSavingKey(itemKey);

    const payload = {
      no: editItem.no.trim(),
      food: editItem.food.trim(),
      style: editItem.style.trim(),
      score: parseFloat(editItem.score),
      price: editItem.price === '' ? null : parseFloat(editItem.price),
      persistent: editItem.persistent === '' ? null : parseFloat(editItem.persistent)
    };

    let query = supabase.from('menu').update(payload);

    if (item.id !== undefined && item.id !== null) {
      query = query.eq('id', item.id);
    } else {
      query = query
        .eq('no', item.no)
        .eq('restaurant', restaurantId);
      if (item.date) {
        query = query.eq('date', item.date);
      }
    }

    const { data, error } = await query.select();

    if (error) {
      console.error('Error updating menu item:', error);
      alert('保存失败，请重试');
    } else if (!data || data.length === 0) {
      console.warn('No rows updated, check RLS update policy or the row key.', item);
      alert('保存失败：没有数据被更新，请检查数据库权限或该条数据是否还存在');
    } else {
      setEditingKey(null);
      setEditItem({ ...emptyItem });
      await fetchMenuItems();
    }
    setSavingKey(null);
  };

  // 编辑状态下的键盘操作：Enter 保存，Esc 取消
  const handleEditKeyDown = (e, item) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(item);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  // 按分数从高到低排序
  const sortedMenuItems = [...menuItems].sort((a, b) => b.score - a.score);

  return (
    <div className="menu-container">
      <h2>餐厅菜单</h2>

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
                <th>价格</th>
                <th>临时摊位</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {sortedMenuItems.map(item => {
                const itemKey = getItemKey(item);
                const isEditing = editingKey === itemKey;
                const isSaving = savingKey === itemKey;

                return isEditing ? (
                  <tr key={itemKey} className="editing-row" onKeyDown={(e) => handleEditKeyDown(e, item)}>
                    <td>
                      <input
                        className="cell-input"
                        type="text"
                        name="no"
                        value={editItem.no}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className="cell-input"
                        type="text"
                        name="food"
                        value={editItem.food}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className="cell-input"
                        type="text"
                        name="style"
                        value={editItem.style}
                        onChange={handleEditInputChange}
                      />
                    </td>
                    <td>
                      <input
                        className="cell-input"
                        type="number"
                        name="score"
                        value={editItem.score}
                        onChange={handleEditInputChange}
                        step="0.1"
                        min="0"
                        max="10"
                      />
                    </td>
                    <td>
                      <input
                        className="cell-input"
                        type="number"
                        name="price"
                        value={editItem.price}
                        onChange={handleEditInputChange}
                        step="0.01"
                        min="0"
                      />
                    </td>
                    <td>
                      <input
                        className="cell-input"
                        type="number"
                        name="persistent"
                        value={editItem.persistent}
                        onChange={handleEditInputChange}
                        step="1"
                        min="0"
                      />
                    </td>
                    <td className="action-cell">
                      <button
                        className="btn-save"
                        onClick={() => handleSaveEdit(item)}
                        disabled={isSaving}
                      >
                        {isSaving ? '保存中...' : '保存'}
                      </button>
                      <button
                        className="btn-cancel"
                        onClick={handleCancelEdit}
                        disabled={isSaving}
                      >
                        取消
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr key={itemKey}>
                    <td>{item.no}</td>
                    <td>{item.food}</td>
                    <td>{item.style}</td>
                    <td>{item.score}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.persistent ?? '-'}</td>
                    <td className="action-cell">
                      <button
                        className="btn-edit"
                        onClick={() => handleStartEdit(item)}
                        disabled={editingKey !== null || savingKey !== null}
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <p>暂无菜单数据</p>
        )}
      </div>
      
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
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            name="price"
            value={newItem.price}
            onChange={handleInputChange}
            placeholder="输入价格"
            step="0.01"
            min="0"
          />
        </div>
        <div className="form-group">
          <label>Persistent</label>
          <input
            type="number"
            name="persistent"
            value={newItem.persistent}
            onChange={handleInputChange}
            placeholder="输入Persistent值"
            step="1"
            min="0"
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
