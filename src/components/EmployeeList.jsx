import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const data = await api.fetchEmployees(localStorage.getItem('token'));
      setEmployees(data);
      setError(null);
    } catch (err) {
      console.error('Fetch employees error:', err);
      setError('Failed to load employees. Please try again later.');
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Employee List</h2>
      {error ? (
        <div className="text-red-500">
          <p>{error}</p>
          <button
            onClick={fetchEmployees}
            className="mt-2 bg-sky-500 text-white p-2 rounded"
          >
            Retry
          </button>
        </div>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <ul>
          {employees.map((emp) => (
            <li
              key={emp._id}
              onClick={() => navigate(`/leave-status/${emp._id}`)}
              className={`cursor-pointer p-3 border-b hover:bg-gray-100 flex items-center ${
                emp.hasPendingLeave ? 'text-red-500 font-medium' : ''
              }`}
            >
              <img
                src={emp.profileImage || 'https://via.placeholder.com/30'}
                alt={emp.name}
                className="w-8 h-8 rounded-full mr-3"
              />
              {emp.name} {emp.hasPendingLeave && <span className="text-red-500 text-xs ml-2">(Leave Applied)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default EmployeeList;