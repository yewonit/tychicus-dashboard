import styled from 'styled-components';

// 공통 색상 변수
export const colors = {
  primary: '#667eea',
  secondary: '#764ba2',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545',
  textPrimary: '#2c3e50',
  textSecondary: '#6c757d',
  border: '#e9ecef',
  background: '#f8f9fa',
  white: '#ffffff'
};

// 레이아웃 컴포넌트
export const PageContainer = styled.div`
  padding: 20px 40px 20px 0;
  min-height: 100vh;
  background: #f5f5f5;
`;

export const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

export const AdminHeader = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-bottom: 24px;
  overflow: hidden;
`;

export const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #f0f0f0;
`;

export const HeaderLeft = styled.div`
  h1 {
    font-size: 1.5rem;
    font-weight: 700;
    color: ${colors.textPrimary};
    margin: 0;
  }
  
  p {
    font-size: 0.9rem;
    color: ${colors.textSecondary};
    margin: 4px 0 0 0;
  }
`;

export const HeaderRight = styled.div`
  display: flex;
  gap: 12px;
`;

export const HeaderBreadcrumb = styled.div`
  padding: 16px 24px;
  background: ${colors.background};
  border-top: 1px solid #f0f0f0;
  font-size: 0.85rem;
  
  span {
    color: ${colors.textSecondary};
    margin: 0 8px;
    
    &.active {
      color: ${colors.textPrimary};
      font-weight: 600;
    }
  }
`;

// 버튼 컴포넌트
export const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

export const PrimaryButton = styled(Button)`
  background: ${colors.primary};
  color: white;
  
  &:hover:not(:disabled) {
    background: #5a6fd8;
  }
`;

export const SecondaryButton = styled(Button)`
  background: ${colors.textSecondary};
  color: white;
  
  &:hover:not(:disabled) {
    background: #5a6268;
  }
`;

export const SuccessButton = styled(Button)`
  background: ${colors.success};
  color: white;
  
  &:hover:not(:disabled) {
    background: #218838;
  }
`;

export const DangerButton = styled(Button)`
  background: ${colors.danger};
  color: white;
  
  &:hover:not(:disabled) {
    background: #c82333;
  }
`;

export const OutlineButton = styled(Button)`
  background: transparent;
  color: ${colors.primary};
  border: 2px solid ${colors.primary};
  padding: 8px 16px;
  font-size: 0.9rem;
  
  &:hover:not(:disabled) {
    background: ${colors.primary};
    color: white;
  }
`;

export const SmallButton = styled(Button)`
  padding: 8px 16px;
  font-size: 0.9rem;
`;

export const IconButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  
  &:hover {
    background: ${colors.background};
  }
`;

export const EditIconButton = styled(IconButton)`
  &:hover {
    background: #e3f2fd;
    color: #1976d2;
  }
`;

export const DeleteIconButton = styled(IconButton)`
  &:hover {
    background: #ffebee;
    color: #d32f2f;
  }
`;

// 폼 컴포넌트
export const FormInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 2px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  margin: 10px 0;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: ${colors.textSecondary};
    font-size: 0.9rem;
  }
`;

export const FormSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 2px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: white;
  margin: 10px 0;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const FormTextarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 2px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
  
  &::placeholder {
    color: ${colors.textSecondary};
  }
`;

// 날짜 범위 조회 컴포넌트
export const DateRangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
  padding: 20px;
  background: ${colors.background};
  border-radius: 12px;
  border: 1px solid ${colors.border};
  flex-wrap: nowrap;
`;

export const DateInputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const DateLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${colors.textPrimary};
`;

export const DateInput = styled.input`
  padding: 10px 12px;
  border: 2px solid ${colors.border};
  border-radius: 8px;
  font-size: 0.95rem;
  background: white;
  color: ${colors.textPrimary};
  min-width: 140px;
  
  &:focus {
    outline: none;
    border-color: ${colors.primary};
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

export const DateSeparator = styled.span`
  font-size: 1.2rem;
  font-weight: 600;
  color: ${colors.textSecondary};
  margin: 0 8px;
`;

export const QuickDateButtons = styled.div`
  display: flex;
  gap: 8px;
  margin: 0;
  flex-wrap: nowrap;
`;

// 데이터 테이블 컴포넌트
export const TableContainer = styled.div`
  background: white;
  border-radius: 12px;
  border: 1px solid ${colors.border};
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin: 20px 0;
`;

export const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: ${colors.background};
  border-bottom: 1px solid ${colors.border};
`;

export const TableTitle = styled.div`
  display: flex;
  align-items: center;
  
  h4 {
    margin: 0;
    color: ${colors.textPrimary};
    font-size: 1.2rem;
    font-weight: 600;
  }
`;

export const TableCount = styled.span`
  color: ${colors.textSecondary};
  font-size: 0.9rem;
  margin-left: 12px;
`;

export const TableActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
`;

export const TableHead = styled.thead`
  th {
    background: ${colors.background};
    padding: 16px 12px;
    text-align: left;
    font-weight: 600;
    color: ${colors.textPrimary};
    border-bottom: 2px solid ${colors.border};
    white-space: nowrap;
    
    &.sortable {
      cursor: pointer;
      user-select: none;
      
      &:hover {
        background: ${colors.border};
      }
    }
    
    &.checkbox-column {
      width: 50px;
      text-align: center;
    }
    
    &.action-column {
      width: 100px;
      text-align: center;
    }
  }
`;

export const TableBody = styled.tbody`
  tr {
    transition: background-color 0.2s ease;
    
    &:hover {
      background: ${colors.background};
      cursor: pointer;
    }
    
    td {
      padding: 16px 12px;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }
  }
`;

export const TableFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background: ${colors.background};
  border-top: 1px solid ${colors.border};
`;

export const TableInfo = styled.div`
  color: ${colors.textSecondary};
  font-size: 0.9rem;
`;

export const TablePagination = styled.div`
  display: flex;
  gap: 4px;
`;

export const PageButton = styled.button`
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  background: white;
  color: ${colors.textSecondary};
  cursor: pointer;
  border-radius: 6px;
  font-size: 0.9rem;
  min-width: 36px;
  
  &:hover:not(:disabled) {
    background: ${colors.background};
    border-color: ${colors.primary};
  }
  
  &.active {
    background: ${colors.primary};
    color: white;
    border-color: ${colors.primary};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const PageSizeSelect = styled.select`
  padding: 6px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  background: white;
  color: ${colors.textPrimary};
  font-size: 0.9rem;
`;

// 상태 배지 컴포넌트
export const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-block;
  margin: 5px;
  
  &.active {
    background: #d4edda;
    color: #155724;
  }
  
  &.inactive {
    background: #f8d7da;
    color: #721c24;
  }
`;

export const CategoryBadge = styled.span`
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
  
  &.faith {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  &.life {
    background: #f3e5f5;
    color: #7b1fa2;
  }
  
  &.worship {
    background: #e8f5e8;
    color: #388e3c;
  }
`;

// 체크박스 컴포넌트
export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
  border: 2px solid ${colors.border};
  border-radius: 4px;
  cursor: pointer;
  
  &:checked {
    background: ${colors.primary};
    border-color: ${colors.primary};
  }
`;

// 탭 컴포넌트
export const TabContainer = styled.div`
  display: flex;
  border-bottom: 2px solid ${colors.border};
  margin-bottom: 20px;
  padding: 0 20px;
`;

export const TabButton = styled.button`
  padding: 12px 20px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${colors.textSecondary};
  border-bottom: 3px solid transparent;
  font-weight: 700;
  font-size: 1rem;
  transition: all 0.2s;
  
  &.active {
    color: ${colors.primary};
    border-bottom-color: ${colors.primary};
  }
  
  &:hover {
    color: ${props => props.active ? colors.primary : colors.textPrimary};
    background: ${props => props.active ? 'transparent' : colors.background};
  }
`;

// 알림 컴포넌트
export const Alert = styled.div`
  padding: 15px 20px;
  border-radius: 6px;
  margin: 15px 0;
  border-left: 4px solid;
  
  &.success {
    background: #d4edda;
    color: #155724;
    border-left-color: ${colors.success};
  }
  
  &.warning {
    background: #fff3cd;
    color: #856404;
    border-left-color: ${colors.warning};
  }
  
  &.danger {
    background: #f8d7da;
    color: #721c24;
    border-left-color: ${colors.danger};
  }
`;

// 모달 컴포넌트
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 0;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

export const ModalHeader = styled.div`
  padding: 24px 24px 0 24px;
  position: relative;
`;

export const ModalTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.textPrimary};
  margin: 0;
  padding-left: 16px;
  border-left: 4px solid ${colors.secondary};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${colors.textSecondary};
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:hover {
    background: ${colors.background};
  }
`;

export const ModalBody = styled.div`
  padding: 24px;
`;

export const ModalFooter = styled.div`
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid ${colors.border};
`;

// 사용자 정보 컴포넌트
export const UserInfoBox = styled.div`
  background: ${colors.background};
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

export const UserInfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const UserInfoLabel = styled.span`
  font-weight: 600;
  color: ${colors.textPrimary};
  min-width: 80px;
  margin-right: 16px;
`;

export const UserInfoValue = styled.span`
  color: ${colors.textSecondary};
`;

// 콘텐츠 섹션 컴포넌트
export const ContentSection = styled.div`
  margin-bottom: 24px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const SectionTitle = styled.h3`
  color: ${colors.primary};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 12px 0;
`;

export const SectionContent = styled.p`
  color: ${colors.textPrimary};
  line-height: 1.6;
  margin: 0;
  padding-left: 16px;
  border-left: 2px solid ${colors.secondary};
`;

// 반응형 미디어 쿼리
export const media = {
  mobile: '@media (max-width: 768px)',
  tablet: '@media (max-width: 1024px)',
  desktop: '@media (min-width: 1025px)'
};

// 반응형 스타일 적용
export const ResponsivePageContainer = styled(PageContainer)`
  ${media.mobile} {
    padding: 15px 20px 15px 0;
  }
`;

export const ResponsiveAdminHeader = styled(AdminHeader)`
  ${media.mobile} {
    .header-top {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    
    .header-right {
      width: 100%;
      justify-content: flex-start;
    }
    
    .header-breadcrumb {
      padding: 12px 16px;
      font-size: 0.8rem;
    }
  }
`;

export const ResponsiveDateRangeContainer = styled(DateRangeContainer)`
  ${media.mobile} {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    
    ${DateInputGroup} {
      flex-direction: column;
      align-items: stretch;
    }
    
    ${DateSeparator} {
      align-self: center;
      margin: 0;
    }
    
    ${QuickDateButtons} {
      justify-content: center;
      flex-wrap: wrap;
    }
  }
`;

export const ResponsiveTableContainer = styled(TableContainer)`
  ${media.mobile} {
    .table-header {
      flex-direction: column;
      gap: 16px;
      align-items: flex-start;
    }
    
    .table-actions {
      width: 100%;
      justify-content: flex-start;
    }
    
    .table-footer {
      flex-direction: column;
      gap: 16px;
      align-items: center;
    }
    
    .table-pagination {
      order: 2;
    }
    
    .table-settings {
      order: 3;
    }
  }
`;

export const ResponsiveDataTable = styled(DataTable)`
  ${media.mobile} {
    th, td {
      padding: 12px 8px;
      font-size: 0.8rem;
    }
  }
`;

export const ResponsiveTabContainer = styled(TabContainer)`
  ${media.mobile} {
    padding: 0 15px;
    overflow-x: auto;
    
    button {
      white-space: nowrap;
      min-width: 120px;
    }
  }
`;

export const ResponsiveCardContainer = styled(CardContainer)`
  ${media.mobile} {
    margin-right: 20px;
    
    .card-header, .card-body, .card-footer {
      padding: 16px;
    }
  }
`;
