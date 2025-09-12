import React, { useState, useEffect, Component } from 'react';
import Header from '../components/Header';
import LeaveApplyForm from '../components/LeaveApplyForm';
import LeaveStatus from '../components/LeaveStatus';
import EmployeeList from '../components/EmployeeList';
import api from '../api/api';

class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }
    return this.props.children;
  }
}

function Dashboard() {
  const [showStatus, setShowStatus] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (user.role === 'Employee' && showStatus) {
      fetchLeaves(user.id);
    }
  }, [showStatus, user]);

  const fetchLeaves = async (userId) => {
    try {
      const data = await api.fetchLeaves(userId, localStorage.getItem('token'));
      setLeaves(data);
    } catch (err) {
      console.error('Fetch leaves error:', err);
    }
  };

  const updateLeave = (updatedLeave) => {
    setLeaves((prev) => prev.map((l) => (l._id === updatedLeave._id ? updatedLeave : l)));
  };

  if (!user) return null;

  return (
    <ErrorBoundary>
      <div>
        <Header />
        <div className="p-6 max-w-5xl mx-auto">
          {user.role === 'Employee' ? (
            <div>
              <LeaveApplyForm onApply={() => setShowStatus(true)} />
              <button
                onClick={() => setShowStatus(!showStatus)}
                className="bg-sky-500 text-white p-3 rounded mt-6 w-full font-medium"
              >
                {showStatus ? 'Hide Leave Status' : 'View Leave Status'}
              </button>
              {showStatus && (
                <div className="mt-6 space-y-8 overflow-y-auto max-h-[600px] px-2">
                  {leaves.map((leave) => (
                    <LeaveStatus key={leave._id} leave={leave} updateLeave={updateLeave} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmployeeList />
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default Dashboard;