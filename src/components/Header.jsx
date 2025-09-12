// frontend/src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa'; // Import logout icon from react-icons

function Header() {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-semibold">Leave Management</h1>
      <div className="flex items-center">
        <span className="mr-3 font-medium">{user.name || 'Guest'}</span>
        <img
          src={user.profileImage || 'https://via.placeholder.com/40'}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover mr-3"
        />
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-500"
          title="Logout"
        >
          <FaSignOutAlt size={24} />
        </button>
      </div>
    </header>
  );
}

export default Header;

