import React from 'react';

interface AttendancePopupProps {
  isOpen: boolean;
  title: string;
  data: any[];
  onClose: () => void;
}

const AttendancePopup: React.FC<AttendancePopupProps> = ({ isOpen, title, data, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='popup-overlay' onClick={onClose}>
      <div className='popup-container' onClick={e => e.stopPropagation()}>
        <div className='popup-header'>
          <h3 className='popup-title'>{title}</h3>
          <button className='popup-close-button' onClick={onClose}>
            ×
          </button>
        </div>
        <div className='popup-content'>
          <div className='attendance-list'>
            {data.length > 0 ? (
              data.map((member: any, index: number) => (
                <div key={index} className='attendance-item'>
                  <div className='member-info'>
                    <span className='member-name'>{member.name}</span>
                    {member.role && <span className='member-role'>{member.role}</span>}
                    <span className='team-name'>{member.team}</span>
                  </div>
                  <span className='consecutive-badge'>{member.consecutiveWeeks}주 연속</span>
                </div>
              ))
            ) : (
              <div className='empty-message'>연속 출석한 인원이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendancePopup;
