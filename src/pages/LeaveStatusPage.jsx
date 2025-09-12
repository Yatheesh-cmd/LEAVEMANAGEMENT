import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LeaveStatus from '../components/LeaveStatus';

function LeaveStatusPage() {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState(null);
  const { userId } = useParams();
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchLeaves = async () => {
      try {
        const targetUserId = user.role === 'Employee' ? user.id : userId;
        if (!targetUserId) {
          setError('No employee selected');
          return;
        }
        const res = await axios.get(`http://localhost:5000/api/leaves/user/${targetUserId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setLeaves(res.data);
        setError(null);
      } catch (err) {
        console.error('Fetch leaves error:', err);
        setError('Failed to load leave statuses. Please try again later.');
      }
    };

    fetchLeaves();
  }, [user, userId, navigate]);

  const updateLeave = (updatedLeave) => {
    setLeaves((prev) => prev.map((l) => (l._id === updatedLeave._id ? updatedLeave : l)));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6 text-gray-800">Leave Status</h1>
        {error ? (
          <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>
        ) : leaves.length === 0 ? (
          <p className="text-gray-600 bg-white p-4 rounded-lg shadow">No leave requests found.</p>
        ) : (
          <div className="space-y-6">
            {leaves.map((leave) => (
              <LeaveStatus key={leave._id} leave={leave} updateLeave={updateLeave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaveStatusPage;