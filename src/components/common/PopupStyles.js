import styled from 'styled-components';

// 공통 팝업 스타일 컴포넌트들
export const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

export const PopupContainer = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  display: flex;
  flex-direction: column;
`;

export const PopupHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #ecf0f1;
  flex-shrink: 0;
`;

export const PopupContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
  
  /* 스크롤바 스타일링 */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 4px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

export const PopupTitle = styled.h2`
  color: #2c3e50;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 2rem;
  color: #7f8c8d;
  cursor: pointer;
  padding: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    background: #ecf0f1;
    color: #2c3e50;
  }
`;

export const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 25px;
`;

export const DetailCard = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 20px;
  border-radius: 12px;
  text-align: center;
`;

export const DetailValue = styled.div`
  font-size: 1.8rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
`;

export const DetailLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

export const TrendSection = styled.div`
  background: linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%);
  padding: 20px;
  border-radius: 12px;
  margin-top: 20px;
`;

export const TrendTitle = styled.h4`
  color: #2c3e50;
  margin: 0 0 15px 0;
  font-size: 1.1rem;
  font-weight: 600;
`;

export const TrendDescription = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.4;
`;

export const ManagementDirection = styled.div`
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  padding: 15px;
  border-radius: 8px;
  margin-top: 15px;
  border-left: 4px solid #f39c12;
`;

export const ManagementTitle = styled.h5`
  color: #2c3e50;
  margin: 0 0 8px 0;
  font-size: 1rem;
  font-weight: 600;
`;

export const ManagementText = styled.p`
  color: #7f8c8d;
  margin: 0;
  font-size: 0.85rem;
  line-height: 1.4;
`;

// 호버 팝업 스타일
export const HoverPopup = styled.div`
  position: absolute;
  background: white;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
  border: 1px solid #e1e8ed;
  z-index: 1000;
  min-width: 250px;
  max-width: 300px;
  backdrop-filter: blur(10px);
  
  &.above {
    bottom: 100%;
    margin-bottom: 8px;
  }
  
  &.below {
    top: 100%;
    margin-top: 8px;
  }
  
  &::after {
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
  }
  
  &.above::after {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-top: 6px solid white;
  }
  
  &.below::after {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-bottom: 6px solid white;
  }
`;

export const HoverPopupTitle = styled.div`
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 12px;
  font-size: 1rem;
`;

export const HoverPopupItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

export const HoverPopupLabel = styled.span`
  color: #7f8c8d;
  font-size: 0.85rem;
`;

export const HoverPopupValue = styled.span`
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.85rem;
`;

// 출석 리스트 스타일
export const AttendanceList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const AttendanceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid ${props => {
    if (props.consecutiveWeeks >= 3) return '#10B981';
    if (props.consecutiveWeeks >= 2) return '#F59E0B';
    return '#EF4444';
  }};
`;

export const MemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const MemberName = styled.span`
  font-weight: 600;
  color: #2c3e50;
  font-size: 1rem;
`;

export const MemberRole = styled.span`
  font-size: 0.75rem;
  color: #7f8c8d;
  font-style: italic;
`;

export const TeamName = styled.span`
  font-size: 0.85rem;
  color: #7f8c8d;
`;

export const ConsecutiveWeeks = styled.span`
  font-weight: 600;
  color: ${props => {
    if (props.consecutiveWeeks >= 3) return '#10B981';
    if (props.consecutiveWeeks >= 2) return '#F59E0B';
    return '#EF4444';
  }};
  font-size: 0.9rem;
`; 