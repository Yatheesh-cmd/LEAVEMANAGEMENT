import React, { useState } from 'react';
import axios from 'axios';

function LeaveApplyForm({ onApply }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:5000/api/leaves',
        { startDate, endDate, reason },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Leave applied successfully');
      onApply();
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (err) {
      console.error(err);
      alert('Failed to apply leave');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        min={today}
        className="border p-3 mb-4 w-full rounded"
        required
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        min={today}
        className="border p-3 mb-4 w-full rounded"
        required
      />
      <textarea
        placeholder="Reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border p-3 mb-4 w-full rounded"
        required
      />
      <button type="button" onClick={handleSubmit} className="bg-sky-500 text-white p-3 w-full rounded font-medium">
        Apply Leave
      </button>
    </div>
  );
}

export default LeaveApplyForm;