import React, { useState, useEffect } from 'react';
import api from '../api/api';

const roles = ['Employee', 'Team Lead', 'Project Lead', 'HR', 'CEO'];
const approverOrder = ['Team Lead', 'Project Lead', 'HR', 'CEO'];

const profilePositions = [
  { x: 50, y: 50, labelPosition: 'below' },
  { x: 250, y: 130, labelPosition: 'below' },
  { x: 450, y: 50, labelPosition: 'above' },
  { x: 650, y: 130, labelPosition: 'below' },
  { x: 850, y: 50, labelPosition: 'above' }
];

function LeaveStatus({ leave, updateLeave }) {
  const [approvers, setApprovers] = useState({});
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    const fetchApprovers = async () => {
      const approverData = {};
      approverData['Employee'] = { profileImage: leave.employeeId.profileImage, name: leave.employeeId.name };
      for (const role of roles.slice(1)) {
        try {
          const data = await api.fetchApprover(role, localStorage.getItem('token'));
          approverData[role] = data;
        } catch (err) {
          console.error(`Error fetching approver for ${role}:`, err);
          approverData[role] = { role, profileImage: null, name: `${role} (Not Assigned)` };
        }
      }
      setApprovers(approverData);
    };
    fetchApprovers();
  }, [leave.employeeId]);

  let completedStages = 1;
  if (leave.status === 'Pending') {
    completedStages = approverOrder.indexOf(leave.currentApprover) + 2;
  } else if (leave.status === 'Approved') {
    completedStages = roles.length;
  } else if (leave.status === 'Rejected') {
    completedStages = approverOrder.indexOf(leave.currentApprover) + 1;
  }
  const completedLines = completedStages - 1;

  const handleApprove = async () => {
    try {
      const updatedLeave = await api.approveLeave(leave._id, localStorage.getItem('token'));
      updateLeave(updatedLeave);
      alert('Leave approved');
    } catch (err) {
      console.error('Approve leave error:', err);
      alert('Failed to approve');
    }
  };

  const handleReject = async () => {
    try {
      const updatedLeave = await api.rejectLeave(leave._id, localStorage.getItem('token'));
      updateLeave(updatedLeave);
      alert('Leave rejected');
    } catch (err) {
      console.error('Reject leave error:', err);
      alert('Failed to reject');
    }
  };

  const getLineStyle = (lineIndex) => {
    const isCompleted = lineIndex < completedLines;
    return {
      stroke: isCompleted ? '#59d888ff' : '#d1d5db',
      strokeWidth: '3',
      fill: 'none',
      strokeDasharray: '8,6',
      filter: isCompleted ? 'url(#greenGlow)' : 'none'
    };
  };

  const getProfileStyle = (index) => {
    const isCompleted = index < completedStages;
    const isRejected = leave.status === 'Rejected' && index === completedStages - 1;
    return {
      filter: isCompleted ? 'url(#greenGlow)' : isRejected ? 'url(#grayGlow)' : 'none'
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mt-6 relative">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 border-b border-sky-500 pb-2">Leave Status</h2>
      <div className="relative" style={{ height: '200px', width: '900px' }}>
        <svg className="absolute top-0 left-0 w-full h-full z-0">
          <defs>
            <filter id="greenGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="grayGlow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <path
            d={`M${profilePositions[0].x + 25} ${profilePositions[0].y + 25} C${profilePositions[0].x + 75} ${profilePositions[0].y + 25}, ${profilePositions[1].x - 75} ${profilePositions[1].y + 25}, ${profilePositions[1].x - 25} ${profilePositions[1].y + 25}`}
            style={getLineStyle(0)}
          />
          <path
            d={`M${profilePositions[1].x + 25} ${profilePositions[1].y + 25} C${profilePositions[1].x + 75} ${profilePositions[1].y + 25}, ${profilePositions[2].x - 75} ${profilePositions[2].y + 25}, ${profilePositions[2].x - 25} ${profilePositions[2].y + 25}`}
            style={getLineStyle(1)}
          />
          <path
            d={`M${profilePositions[2].x + 25} ${profilePositions[2].y + 25} C${profilePositions[2].x + 75} ${profilePositions[2].y + 25}, ${profilePositions[3].x - 75} ${profilePositions[3].y + 25}, ${profilePositions[3].x - 25} ${profilePositions[3].y + 25}`}
            style={getLineStyle(2)}
          />
          <path
            d={`M${profilePositions[3].x + 25} ${profilePositions[3].y + 25} C${profilePositions[3].x + 75} ${profilePositions[3].y + 25}, ${profilePositions[4].x - 75} ${profilePositions[4].y + 25}, ${profilePositions[4].x - 25} ${profilePositions[4].y + 25}`}
            style={getLineStyle(3)}
          />
        </svg>

        {roles.map((role, index) => {
          const position = profilePositions[index];
          const isCompleted = index < completedStages;
          const isRejected = leave.status === 'Rejected' && index === completedStages - 1;
          const approverData = approvers[role];
          
          return (
            <div 
              key={role} 
              className="absolute flex flex-col items-center z-10"
              style={{ 
                left: `${position.x}px`, 
                top: `${position.y}px`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {position.labelPosition === 'above' && (
                <span className="text-sm font-medium mb-2 text-center whitespace-nowrap">
                  {approverData?.role || role}
                </span>
              )}
              
              <div className="relative" style={getProfileStyle(index)}>
                <div className="absolute inset-0 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                <img
                  src={approverData?.profileImage || 'https://via.placeholder.com/50'}
                  alt={role}
                  className={`w-12 h-12 rounded-full object-cover border-4 transition-all duration-300 relative z-10 ${
                    isCompleted 
                      ? 'border-green-500' 
                      : isRejected 
                        ? 'border-gray-500'
                        : 'border-gray-300 shadow-md'
                  }`}
                />
              </div>
              
              {position.labelPosition === 'below' && (
                <span className="text-sm font-medium mt-2 text-center whitespace-nowrap">
                  {approverData?.role || role}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <p className="text-sm"><strong>Employee:</strong> {leave.employeeId.name}</p>
        <p className="text-sm"><strong>Dates:</strong> {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</p>
        <p className="text-sm"><strong>Reason:</strong> {leave.reason}</p>
        <p className="text-sm"><strong>Status:</strong> {leave.status}</p>
        {leave.status === 'Approved' && user.role === 'Employee' && (
          <div className="bg-cyan-100 text-cyan-500 font-semibold text-lg p-3 rounded-md mt-4 border border-cyan-300">
            Your leave application is approved
          </div>
        )}
      </div>
      
      {leave.status === 'Pending' && user.role === leave.currentApprover && (
        <div className="absolute bottom-6 right-6 text-right">
          <p className="text-sm font-medium mb-4 mr-14">Check Details, Then Approve or Reject</p>
          <div className="flex gap-4 justify-end">
            <button onClick={handleReject} className="bg-red-500 text-white px-6 py-2 rounded font-medium">
              Reject Leave
            </button>
            <button onClick={handleApprove} className="bg-green-500 text-white px-6 py-2 rounded font-medium">
              Approve Leave
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeaveStatus;