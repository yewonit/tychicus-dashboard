import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import {
  PopupOverlay,
  PopupContainer,
  PopupHeader,
  PopupTitle,
  CloseButton,
  PopupContent,
  HoverPopup,
  HoverPopupTitle,
  HoverPopupItem,
  HoverPopupLabel,
  HoverPopupValue,
  AttendanceList,
  AttendanceItem,
  MemberInfo,
  MemberName,
  MemberRole,
  TeamName,
  ConsecutiveWeeks
} from './common/PopupStyles';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  attendanceData, 
  recentActivities, 
  getConsecutiveAttendanceStats,
  calculateConsecutiveAbsence,
  weekOverWeekData,
  newQuickStatsData
} from '../data/attendanceData';
import attendanceData2025 from '../data/attendanceData2025';
import AttendanceChart from './AttendanceChart';



const DashboardContainer = styled.div`
  padding: 10px;
  /* margin-left: 240px; */
  min-height: 100vh;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    /* margin-left: 200px; */
    padding: 8px;
  }
  
  @media (max-width: 768px) {
    /* margin-left: 180px; */
    padding: 6px;
  }
`;

const Header = styled.div`
  margin-bottom: 20px;
  
  h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text-primary);
    margin-bottom: 5px;
  }
  
  p {
    font-size: 1rem;
    color: var(--text-secondary);
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    margin-bottom: 15px;
    
    h1 {
      font-size: 1.8rem;
    }
    
    p {
      font-size: 0.9rem;
    }
  }
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
    
    h1 {
      font-size: 1.6rem;
    }
    
    p {
      font-size: 0.85rem;
    }
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  align-items: center;
  flex-wrap: wrap;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 12px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-bottom: 12px;
  }
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 6px;
  }
  
  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const FilterLabel = styled.label`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const FilterSelect = styled.select`
  padding: 6px 10px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  font-size: 0.85rem;
  background: white;
  color: var(--text-primary);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: var(--accent-primary);
    box-shadow: 0 0 0 3px rgba(38, 58, 153, 0.1);
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 5px 8px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    padding: 4px 6px;
    font-size: 0.75rem;
  }
`;

const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: 12px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
    margin-bottom: 12px;
  }
`;

const QuickStatCard = styled.div`
  background: var(--bg-card);
  border-radius: 10px;
  padding: 20px 15px;
  box-shadow: var(--shadow-light);
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 140px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 15px 12px;
    min-height: 120px;
  }
  
  @media (max-width: 768px) {
    padding: 12px 10px;
    min-height: 100px;
  }
`;

const QuickStatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 8px;
  line-height: 1;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 1.8rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const QuickStatLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
  margin-bottom: auto;
  padding-top: 5px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.75rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
  }
`;

const QuickStatGrowth = styled.div`
  font-size: 0.75rem;
  color: ${props => props.growth >= 0 ? '#10B981' : '#EF4444'};
  font-weight: 600;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  padding: 6px 8px;
  background: ${props => props.growth >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
  border-radius: 6px;
  border: 1px solid ${props => props.growth >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'};
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.7rem;
    padding: 5px 6px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
    padding: 4px 5px;
  }
`;

const GrowthIcon = styled.span`
  font-size: 0.7rem;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.65rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

const OrganizationSection = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  margin-bottom: 20px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

const OrgGrid = styled.div`
  display: flex;
  flex-direction: row;
  gap: 15px;
  margin-top: 15px;
  overflow-x: auto;
  padding: 10px 0 10px 0;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  @media (max-width: 768px) {
    flex-wrap: wrap;
    gap: 10px;
  }
`;

const OrgCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  min-width: 200px;
  flex-shrink: 0;
  margin-top: 2px;
  
  &:hover {
    border-color: var(--blue-oblivion);
    transform: translateY(-2px);
    margin-top: 0px;
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    min-width: 180px;
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    min-width: 160px;
    padding: 10px;
  }
`;

const OrgTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
`;

const OrgStats = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
`;

const OrgStatLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const OrgStatValue = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
`;

// 연속 출석 통계 섹션
const ConsecutiveAttendanceSection = styled.div`
  background: linear-gradient(135deg, var(--bg-card) 0%, #f8fafc 100%);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ConsecutiveGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || 'repeat(auto-fit, minmax(320px, 1fr))'};
  gap: 24px;
  margin-top: 20px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }
`;

const ConsecutiveCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid var(--border-color);
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 12px;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ConsecutiveTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.9rem;
    margin-bottom: 10px;
  }
  
  @media (max-width: 768px) {
    font-size: 0.85rem;
    margin-bottom: 8px;
  }
`;

const ConsecutiveStats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    gap: 14px;
  }
  
  @media (max-width: 768px) {
    gap: 12px;
  }
`;

const ConsecutiveStat = styled.div`
  text-align: center;
  padding: 10px;
  background: var(--bg-card);
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 8px;
  }
  
  @media (max-width: 768px) {
    padding: 6px;
  }
`;

const ConsecutiveStatValue = styled.div`
  font-size: 1.3rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 3px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 1.1rem;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ConsecutiveStatLabel = styled.div`
  font-size: 0.75rem;
  color: var(--text-secondary);
  font-weight: 500;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.7rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.65rem;
  }
`;

const ConsecutiveStatPercentage = styled.div`
  font-size: 0.7rem;
  color: var(--text-muted);
  margin-top: 2px;
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    font-size: 0.65rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

// 표 형식 스타일 컴포넌트
const TableContainer = styled.div`
  background: white;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  background: var(--bg-card);
  padding: 12px 8px;
  text-align: left;
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
  border-bottom: 2px solid var(--border-color);
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 10px 6px;
    font-size: 0.85rem;
  }
  
  @media (max-width: 768px) {
    padding: 8px 5px;
    font-size: 0.8rem;
  }
`;

const TableCell = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  
  &:last-child {
    text-align: right;
    font-weight: 600;
  }
  
  /* 태블릿 크기까지만 지원 */
  @media (max-width: 1024px) {
    padding: 8px 6px;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    padding: 6px 5px;
    font-size: 0.75rem;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: var(--bg-card);
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const RankBadge = styled.span`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.rank <= 3 ? '#10B981' : '#6B7280'};
  color: white;
  text-align: center;
  line-height: 24px;
  font-size: 0.75rem;
  font-weight: 600;
  margin-right: 8px;
`;

const AttendanceRate = styled.span`
  color: ${props => props.rate >= 80 ? '#10B981' : props.rate >= 60 ? '#F59E0B' : '#EF4444'};
  font-weight: 600;
`;





const ConsecutiveBadge = styled.span`
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  background: ${props => {
    if (props.consecutiveWeeks >= 3) return '#10B981';
    if (props.consecutiveWeeks >= 2) return '#F59E0B';
    return '#EF4444';
  }};
`;

const ViewButton = styled.button`
  background: linear-gradient(135deg, #26428B, #516AC8);
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 16px;
  box-shadow: 0 2px 8px rgba(38, 66, 139, 0.2);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(38, 66, 139, 0.3);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: ${props => props.columns || '2fr 1fr'};
  gap: 20px;
  margin-bottom: 25px;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
`;

const ChartTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &::before {
    content: '📊';
    font-size: 1.5rem;
  }
`;

const ActivitiesSection = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
`;

const ActivityItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
  
  &:last-child {
    border-bottom: none;
  }
`;

const ActivityIcon = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 0.9rem;
  color: white;
`;

const ActivityContent = styled.div`
  flex: 1;
`;

const ActivityTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 2px;
  font-size: 0.95rem;
`;

const ActivitySubtitle = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
`;

const ActivityTime = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  text-align: right;
`;

// 더 명확하고 대비가 강한 색상으로 변경
const COLORS = ['#E3AF64', '#26428B', '#516AC8', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#06B6D4', '#F97316', '#84CC16'];

// 출석 상태별 통계 섹션 스타일 컴포넌트
const AttendanceStatusSection = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  margin-bottom: 20px;
`;

const StatusGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 15px;
`;

const StatusCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 15px;
  border-left: 4px solid ${props => props.color};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-medium);
  }
`;

const StatusTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const StatusCount = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-primary);
`;

const StatusPercentage = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: ${props => props.color};
  background: ${props => props.color}20;
  padding: 4px 8px;
  border-radius: 12px;
`;

const StatusDescription = styled.div`
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.3;
`;



const OrgCardWithHover = styled(OrgCard)`
  position: relative;
  cursor: pointer;
`;

// 연속 결석자 섹션 스타일 컴포넌트
const ConsecutiveAbsenceSection = styled.div`
  background: linear-gradient(135deg, var(--bg-card) 0%, #f8fafc 100%);
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const AbsenceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const AbsenceCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 16px;
  border: 2px solid ${props => {
    if (props.severity === 'high') return '#EF4444';
    if (props.severity === 'medium') return '#F59E0B';
    return '#10B981';
  }};
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const AbsenceTitle = styled.h4`
  font-size: 1rem;
  font-weight: 700;
  color: ${props => {
    if (props.severity === 'high') return '#EF4444';
    if (props.severity === 'medium') return '#F59E0B';
    return '#10B981';
  }};
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const AbsenceStats = styled.div`
  text-align: center;
  margin: 16px 0;
`;

const AbsenceStatValue = styled.div`
  font-size: 2.2rem;
  font-weight: 800;
  color: ${props => props.severity === 'high' ? '#EF4444' : props.severity === 'medium' ? '#F59E0B' : '#10B981'};
  margin-bottom: 6px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const AbsenceStatLabel = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const AbsenceList = styled.div`
  margin-top: 16px;
  max-height: 200px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8;
  }
`;

const AbsenceItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: ${props => {
    if (props.consecutiveWeeks >= 4) return '#FEF2F2';
    if (props.consecutiveWeeks >= 3) return '#FFFBEB';
    return '#F0FDF4';
  }};
  border-radius: 6px;
  margin-bottom: 6px;
  border-left: 3px solid ${props => {
    if (props.consecutiveWeeks >= 4) return '#EF4444';
    if (props.consecutiveWeeks >= 3) return '#F59E0B';
    return '#10B981';
  }};
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateX(2px);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
  }
`;

const AbsenceMemberInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const AbsenceMemberName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.9rem;
`;

const AbsenceMemberRole = styled.span`
  font-size: 0.7rem;
  color: var(--text-muted);
  font-style: italic;
`;

const AbsenceTeamName = styled.span`
  font-size: 0.75rem;
  color: var(--text-secondary);
`;

const AbsenceBadge = styled.span`
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 700;
  color: white;
  background: ${props => {
    if (props.consecutiveWeeks >= 4) return '#EF4444';
    if (props.consecutiveWeeks >= 3) return '#F59E0B';
    return '#10B981';
  }};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
`;

const Dashboard = () => {
  const [selectedGuk, setSelectedGuk] = useState('전체');
  const [selectedGroup, setSelectedGroup] = useState('전체');
  const [showAttendancePopup, setShowAttendancePopup] = useState(false);
  const [attendancePopupData, setAttendancePopupData] = useState({
    title: '',
    data: []
  });

  // 2025년 주일 청년예배 주차별 출석 트렌드 데이터
  const weeklyAttendanceTrends = useMemo(() => {
    if (!attendanceData2025?.weeklyData) return [];
    
    return attendanceData2025.weeklyData.map((week, index) => {
      // 주차 번호 계산 (1월 1주차부터 시작)
      const weekNumber = index + 1;
      
      // 월 정보 추가 (1월부터 8월까지)
      const month = week.month + 1; // month는 0부터 시작하므로 +1
      const monthName = `${month}월`;
      
      // 전체 국의 주일청년예배 출석 수 합계
      let totalAttendance = 0;
      Object.keys(week.attendance.guk).forEach(gukName => {
        if (week.attendance.guk[gukName]?.주일청년예배?.present) {
          totalAttendance += week.attendance.guk[gukName].주일청년예배.present;
        }
      });
      
      return {
        week: `W${weekNumber}`,
        month: monthName,
        weekLabel: `${monthName} W${weekNumber}`,
        출석: totalAttendance
      };
    });
  }, [attendanceData2025]);

  // 연속 결석 통계 데이터 (성능 최적화)
  const consecutiveAbsenceStats = useMemo(() => {
    const members = attendanceData?.members || [];
    const targetGroup = selectedGroup !== '전체' ? `${selectedGroup} 그룹` : null;
    return calculateConsecutiveAbsence(members, targetGroup);
  }, [attendanceData?.members, selectedGroup]);
  const [attendanceStatusStats, setAttendanceStatusStats] = useState(null);
  const [activeAttendanceRate, setActiveAttendanceRate] = useState(null);
  
  // 호버 팝업 상태 추가
  const [hoveredGuk, setHoveredGuk] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [popupPosition, setPopupPosition] = useState('above'); // 'above' or 'below'

  // 출석 상태별 통계 데이터 가져오기
  useEffect(() => {
    const fetchAttendanceStatusStats = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/attendance-status-stats');
        if (response.ok) {
          const data = await response.json();
          setAttendanceStatusStats(data);
        }
      } catch (error) {
        console.error('출석 상태별 통계 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchAttendanceStatusStats();
  }, []);

  // 활성인원 출석률 데이터 가져오기
  useEffect(() => {
    const fetchActiveAttendanceRate = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/active-attendance-rate');
        if (response.ok) {
          const data = await response.json();
          setActiveAttendanceRate(data);
        }
      } catch (error) {
        console.error('활성인원 출석률 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchActiveAttendanceRate();
  }, []);

  // 국 목록 생성
  const guks = ['전체', ...Object.keys(attendanceData?.gukStats || {})];
  
  // 선택된 국에 따른 그룹 목록
  const availableGroups = useMemo(() => {
    if (selectedGuk === '전체') {
      return ['전체'];
    }
    
    const groups = [];
    // 해당 국에 속한 구성원들의 그룹 정보를 수집
    const gukMembers = (attendanceData?.members || []).filter(member => 
      member.소속국 === selectedGuk
    );
    
    // 고유한 그룹명 수집
    const uniqueGroups = [...new Set(gukMembers.map(member => member.소속그룹))];
    
    // 그룹명에서 그룹장 이름 추출 (예: "김민수 그룹" -> "김민수")
    uniqueGroups.forEach(groupName => {
      const groupLeaderName = groupName.replace(' 그룹', '');
      groups.push(groupLeaderName);
    });
    
    return ['전체', ...groups];
  }, [selectedGuk]);

  // 현재 선택된 필터에 따른 통계 데이터
  const currentStats = useMemo(() => {
    if (selectedGuk === '전체') {
      return attendanceData.overallStats;
    }
    
    if (selectedGroup === '전체') {
      return attendanceData.gukStats[selectedGuk];
    }
    
    // 선택된 그룹의 통계 데이터 찾기
    const groupKey = `${selectedGroup} 그룹`;
    const groupStats = attendanceData?.groupStats?.[groupKey];
    return groupStats || attendanceData?.gukStats?.[selectedGuk];
  }, [selectedGuk, selectedGroup]);









  // 연속 출석 통계
  const consecutiveStats = useMemo(() => {
    const targetGroup = selectedGroup !== '전체' ? `${selectedGroup} 그룹` : null;
    return getConsecutiveAttendanceStats(attendanceData?.members || [], targetGroup);
  }, [selectedGuk, selectedGroup]);

  // 국별 조직 현황 데이터
  const gukOrganizationData = useMemo(() => {
    if (selectedGuk === '전체') return null;
    
    const gukMembers = (attendanceData?.members || []).filter(member => 
      member.소속국 === selectedGuk
    );
    
    // 그룹별 통계 계산
    const groupStats = {};
    gukMembers.forEach(member => {
      const groupName = member.소속그룹;
      if (!groupStats[groupName]) {
        groupStats[groupName] = {
          totalMembers: 0,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          teams: new Set(),
          groupLeader: member.그룹장
        };
      }
      
      groupStats[groupName].totalMembers++;
      groupStats[groupName].teams.add(member.소속순);
      
      // 최근 주 출석 여부 확인
      const recentWeek = '주1주';
      const attendance = member[`${recentWeek}_주일청년예배출석여부`];
      if (attendance === '출석') {
        groupStats[groupName].totalPresent++;
      } else if (attendance === '결석') {
        groupStats[groupName].totalAbsent++;
      } else if (attendance === '지각') {
        groupStats[groupName].totalLate++;
      }
    });
    
    // 출석률 계산
    Object.keys(groupStats).forEach(groupName => {
      const stats = groupStats[groupName];
      const total = stats.totalPresent + stats.totalAbsent + stats.totalLate;
      stats.attendanceRate = total > 0 ? Math.round((stats.totalPresent / total) * 100) : 0;
      stats.teams = stats.teams.size;
    });
    
    return groupStats;
  }, [selectedGuk]);

  // 그룹별 조직 현황 데이터
  const groupOrganizationData = useMemo(() => {
    if (selectedGuk === '전체' || selectedGroup === '전체') return null;
    
    const targetGroup = `${selectedGroup} 그룹`;
    const groupMembers = (attendanceData?.members || []).filter(member => 
      member.소속그룹 === targetGroup
    );
    
    // 순별 통계 계산
    const teamStats = {};
    groupMembers.forEach(member => {
      const teamName = member.소속순;
      if (!teamStats[teamName]) {
        teamStats[teamName] = {
          totalMembers: 0,
          totalPresent: 0,
          totalAbsent: 0,
          totalLate: 0,
          teamLeader: member.순장
        };
      }
      
      teamStats[teamName].totalMembers++;
      
      // 최근 주 출석 여부 확인
      const recentWeek = '주1주';
      const attendance = member[`${recentWeek}_주일청년예배출석여부`];
      if (attendance === '출석') {
        teamStats[teamName].totalPresent++;
      } else if (attendance === '결석') {
        teamStats[teamName].totalAbsent++;
      } else if (attendance === '지각') {
        teamStats[teamName].totalLate++;
      }
    });
    
    // 출석률 계산
    Object.keys(teamStats).forEach(teamName => {
      const stats = teamStats[teamName];
      const total = stats.totalPresent + stats.totalAbsent + stats.totalLate;
      stats.attendanceRate = total > 0 ? Math.round((stats.totalPresent / total) * 100) : 0;
    });
    
    return teamStats;
  }, [selectedGuk, selectedGroup]);

  // 연속 출석 인원 데이터 계산
  const getConsecutiveAttendanceMembers = (type) => {
    try {
      // attendanceData가 존재하는지 확인
      if (!attendanceData || !attendanceData.members) {
        console.error('attendanceData is not available');
        return [];
      }

      const members = attendanceData.members;
      const targetGroup = selectedGroup !== '전체' ? `${selectedGroup} 그룹` : null;
      
      // 그룹별 필터링
      const filteredMembers = targetGroup 
        ? members.filter(member => member.소속그룹 === targetGroup)
        : members;

      const result = [];
      
      filteredMembers.forEach(member => {
        let consecutiveWeeks = 0;
        
        // 최근 4주간 출석 여부 확인
        for (let week = 1; week <= 4; week++) {
          const weekKey = `주${week}주`;
                  const attendanceKey = type === 'wednesday' 
          ? `${weekKey}_수요제자기도회출석여부`
          : `${weekKey}_두란노사역자모임출석여부`;
          
          if (member[attendanceKey] === '출석') {
            consecutiveWeeks++;
          } else {
            break; // 연속이 끊어지면 중단
          }
        }
        
        if (consecutiveWeeks >= 2) {
          result.push({
            name: member.이름,
            team: member.소속순,
            role: member.직분 || null,
            consecutiveWeeks: consecutiveWeeks
          });
        }
      });
      
      // 연속 주수별로 정렬 (높은 순)
      return result.sort((a, b) => b.consecutiveWeeks - a.consecutiveWeeks);
    } catch (error) {
      console.error('Error in getConsecutiveAttendanceMembers:', error);
      return [];
    }
  };

  // 팝업창 열기 함수
  const openAttendancePopup = (type, title) => {
    try {
      const data = getConsecutiveAttendanceMembers(type);
      setAttendancePopupData({
        title: title,
        data: data
      });
      setShowAttendancePopup(true);
    } catch (error) {
      console.error('Error opening attendance popup:', error);
      // 에러가 발생해도 팝업은 열어서 사용자에게 알림
      setAttendancePopupData({
        title: title,
        data: []
      });
      setShowAttendancePopup(true);
    }
  };

  // 현재 선택된 필터에 따른 활동 데이터 (심방, 지역모임만 표시)
  const currentActivities = useMemo(() => {
    // 심방과 지역모임만 필터링
    const filteredActivities = recentActivities.filter(activity => 
      activity.type === '심방' || activity.type === '지역모임'
    );
    
    if (selectedGuk === '전체') {
      return filteredActivities;
    }
    
    return filteredActivities.filter(activity => {
      // 활동 데이터의 그룹 정보가 새로운 형식과 맞는지 확인
      const activityGroup = activity.group;
      if (selectedGroup === '전체') {
        // 국별 필터링만 적용
        return activityGroup.includes(selectedGuk);
      } else {
        // 특정 그룹 필터링
        return activityGroup === `${selectedGroup} 그룹`;
      }
    });
  }, [selectedGuk, selectedGroup]);

  // 필터 조건에 따른 콘텐츠 노출/비노출 로직
  const shouldShowContent = {
    // 퀵 스탯 그리드
    quickStats: {
      totalMembers: true, // 항상 표시
      totalPresent: true, // 항상 표시
      attendanceRate: true, // 항상 표시
      groupCount: selectedGuk === '전체' || selectedGroup === '전체' // 전체 선택 시에만 표시
    },
    
    // 청년회 조직 현황
    organizationSection: true, // 항상 표시
    

    
    // 연속 출석 통계
    consecutiveStats: true, // 항상 표시
    
    // 차트 섹션
    charts: {
      monthlyTrend: true // 항상 표시
    },
    
    // 출석 상태별 통계
    attendanceStatus: {
      totalMembers: true, // 항상 표시
      present: true, // 항상 표시
      absent: true, // 항상 표시
      late: true, // 항상 표시
      attendanceRate: true // 항상 표시
    },
    
    // 최근 활동
    recentActivities: true // 항상 표시
  };

  // 국별 상세 통계 데이터 계산
  const getGukDetailedStats = (gukName) => {
    if (!attendanceData?.members) return null;
    
    const gukMembers = attendanceData.members.filter(member => 
      member.소속국 === gukName
    );
    
    // 출석 상태별 분류
    const stats = {
      정기출석자: 0,
      관심출석자: 0,
      단기결석자: 0,
      장기결석자: 0,
      제적대상자: 0,
      새가족: 0
    };
    
    gukMembers.forEach(member => {
      // 최근 4주간 출석 여부 확인
      let recentAttendance = 0;
      for (let week = 1; week <= 4; week++) {
        const weekKey = `주${week}주`;
        if (member[`${weekKey}_주일청년예배출석여부`] === '출석') {
          recentAttendance++;
        }
      }
      
      // 출석 상태 분류
      if (recentAttendance >= 3) {
        stats.정기출석자++;
      } else if (recentAttendance === 2) {
        stats.관심출석자++;
      } else if (recentAttendance === 1) {
        stats.단기결석자++;
      } else {
        stats.장기결석자++;
      }
      
      // 제적 대상자 (6주 이상 결석)
      let longAbsence = 0;
      for (let week = 1; week <= 6; week++) {
        const weekKey = `주${week}주`;
        if (member[`${weekKey}_주일청년예배출석여부`] === '결석') {
          longAbsence++;
        }
      }
      if (longAbsence >= 6) {
        stats.제적대상자++;
      }
      
      // 새가족 (최근 3개월 내 등록)
      const registrationDate = member.등록일;
      if (registrationDate) {
        const regDate = new Date(registrationDate);
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        if (regDate >= threeMonthsAgo) {
          stats.새가족++;
        }
      }
    });
    
    return stats;
  };

  // 마우스 호버 이벤트 핸들러
  const handleGukHover = (event, gukName) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const popupWidth = 300; // 팝업의 예상 너비
    const popupHeight = 200; // 팝업의 예상 높이
    
    // 화면 크기 확인
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    // 기본 위치 계산 (카드 중앙 위쪽)
    let x = rect.left + rect.width / 2;
    let y = rect.top - 10;
    let position = 'above';
    
    // 화면 왼쪽 경계 확인
    if (x - popupWidth / 2 < 10) {
      x = popupWidth / 2 + 10;
    }
    
    // 화면 오른쪽 경계 확인
    if (x + popupWidth / 2 > screenWidth - 10) {
      x = screenWidth - popupWidth / 2 - 10;
    }
    
    // 화면 위쪽 경계 확인 (팝업이 위로 표시될 때)
    if (y - popupHeight < 10) {
      // 위쪽 공간이 부족하면 아래쪽에 표시
      y = rect.bottom + 10;
      position = 'below';
    }
    
    setHoverPosition({ x, y });
    setPopupPosition(position);
    setHoveredGuk(gukName);
  };

  const handleGukLeave = () => {
    setHoveredGuk(null);
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>청년회 대시보드</h1>
        <p>코람데오 청년회 현황을 한눈에 확인하세요</p>
      </Header>

      <FilterSection>
        <FilterGroup>
          <FilterLabel>국 선택:</FilterLabel>
          <FilterSelect 
            value={selectedGuk} 
            onChange={(e) => {
              setSelectedGuk(e.target.value);
              setSelectedGroup('전체');
            }}
          >
            {guks.map(guk => (
              <option key={guk} value={guk}>{guk}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>그룹 선택:</FilterLabel>
          <FilterSelect 
            value={selectedGroup} 
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            {availableGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </FilterSelect>
        </FilterGroup>
      </FilterSection>

      <QuickStatsGrid>
        <QuickStatCard>
          <QuickStatLabel>전체 구성원 수</QuickStatLabel>
          <QuickStatValue>
            {Object.values(attendanceData2025.organizationStats.guk)
              .reduce((sum, guk) => sum + guk.totalMembers, 0)}
          </QuickStatValue>
          <QuickStatGrowth growth={0}>
            <GrowthIcon>↗</GrowthIcon>
            전주 대비 +0명
          </QuickStatGrowth>
        </QuickStatCard>
        <QuickStatCard>
          <QuickStatLabel>이번주 출석 수</QuickStatLabel>
          <QuickStatValue>
            {(() => {
              const augustWeeks = attendanceData2025.weeklyData.filter(week => week.month === 7);
              const lastWeek = augustWeeks[augustWeeks.length - 1];
              if (!lastWeek) return 0;
              
              let totalPresent = 0;
              Object.keys(attendanceData2025.organizationStats.guk).forEach(gukName => {
                if (lastWeek.attendance.guk[gukName]) {
                  Object.values(lastWeek.attendance.guk[gukName]).forEach(worship => {
                    totalPresent += worship.present;
                  });
                }
              });
              return totalPresent;
            })()}
          </QuickStatValue>
          <QuickStatGrowth growth={0}>
            <GrowthIcon>↗</GrowthIcon>
            전주 대비 +0명
          </QuickStatGrowth>
        </QuickStatCard>
        <QuickStatCard>
          <QuickStatLabel>이번주 새가족</QuickStatLabel>
          <QuickStatValue>{newQuickStatsData.thisWeekNewFamily}</QuickStatValue>
          <QuickStatGrowth growth={weekOverWeekData.growth.totalNewFamily}>
            <GrowthIcon>
              {weekOverWeekData.growth.totalNewFamily >= 0 ? '↗' : '↘'}
            </GrowthIcon>
            전주 대비 {weekOverWeekData.growth.totalNewFamily >= 0 ? '+' : ''}{weekOverWeekData.growth.totalNewFamily}명
          </QuickStatGrowth>
        </QuickStatCard>
        <QuickStatCard>
          <QuickStatLabel>전체 출석률</QuickStatLabel>
          <QuickStatValue>
            {(() => {
              const augustWeeks = attendanceData2025.weeklyData.filter(week => week.month === 7);
              const lastWeek = augustWeeks[augustWeeks.length - 1];
              if (!lastWeek) return 0;
              
              let totalPresent = 0;
              let totalMembers = 0;
              
              Object.keys(attendanceData2025.organizationStats.guk).forEach(gukName => {
                if (lastWeek.attendance.guk[gukName]) {
                  Object.values(lastWeek.attendance.guk[gukName]).forEach(worship => {
                    totalPresent += worship.present;
                    totalMembers += worship.total;
                  });
                }
              });
              
              return totalMembers > 0 ? Math.round((totalPresent / totalMembers) * 100) : 0;
            })()}%
          </QuickStatValue>
          <QuickStatGrowth growth={0}>
            <GrowthIcon>↗</GrowthIcon>
            전주 대비 +0%
          </QuickStatGrowth>
        </QuickStatCard>
        <QuickStatCard>
          <QuickStatLabel>활성인원 출석률</QuickStatLabel>
          <QuickStatValue>
            {(() => {
              const augustWeeks = attendanceData2025.weeklyData.filter(week => week.month === 7);
              const lastWeek = augustWeeks[augustWeeks.length - 1];
              if (!lastWeek) return 0;
              
              let totalPresent = 0;
              let totalMembers = 0;
              
              Object.keys(attendanceData2025.organizationStats.guk).forEach(gukName => {
                if (lastWeek.attendance.guk[gukName]) {
                  Object.values(lastWeek.attendance.guk[gukName]).forEach(worship => {
                    totalPresent += worship.present;
                    totalMembers += worship.total;
                  });
                }
              });
              
              return totalMembers > 0 ? Math.round((totalPresent / totalMembers) * 100) : 0;
            })()}%
          </QuickStatValue>
          <QuickStatGrowth growth={0}>
            <GrowthIcon>↗</GrowthIcon>
            전주 대비 +0%
          </QuickStatGrowth>
        </QuickStatCard>
      </QuickStatsGrid>

      {/* 출석 수 현황 */}
      {shouldShowContent.organizationSection && (
        <>
          {/* 국별 출석 수 현황 (국: 전체, 그룹: 전체) */}
          {selectedGuk === '전체' && selectedGroup === '전체' && (
            <AttendanceChart 
              attendanceData2025={attendanceData2025}
              chartType="guk"
            />
          )}
          
          {/* 그룹별 출석 수 현황 (국: 선택, 그룹: 전체) */}
          {selectedGuk !== '전체' && selectedGroup === '전체' && (
            <AttendanceChart 
              attendanceData2025={attendanceData2025}
              selectedGuk={selectedGuk}
              chartType="group"
            />
          )}
          
          {/* 순별 출석 수 현황 (국: 선택, 그룹: 선택) */}
          {selectedGuk !== '전체' && selectedGroup !== '전체' && (
            <AttendanceChart 
              attendanceData2025={attendanceData2025}
              selectedGuk={selectedGuk}
              selectedGroup={selectedGroup}
              chartType="sun"
            />
          )}
        </>
      )}

      {/* 청년회 조직 현황 영역은 새롭게 기획 예정으로 임시 제거 */}

      {/* 국별 조직 현황 */}
      {shouldShowContent.gukOrganizationSection && gukOrganizationData && (
        <OrganizationSection>
          <ChartTitle>{selectedGuk} 조직 현황</ChartTitle>
          <OrgGrid>
            {Object.keys(gukOrganizationData).map(groupName => {
              const groupData = gukOrganizationData[groupName];
              return (
                <OrgCard key={groupName}>
                  <OrgTitle>{groupName}</OrgTitle>
                  <OrgStats>
                    <OrgStatLabel>구성원:</OrgStatLabel>
                    <OrgStatValue>{groupData.totalMembers}명</OrgStatValue>
                  </OrgStats>
                  <OrgStats>
                    <OrgStatLabel>순:</OrgStatLabel>
                    <OrgStatValue>{groupData.teams}개</OrgStatValue>
                  </OrgStats>
                  <OrgStats>
                    <OrgStatLabel>출석률:</OrgStatLabel>
                    <OrgStatValue>{groupData.attendanceRate}%</OrgStatValue>
                  </OrgStats>
                </OrgCard>
              );
            })}
          </OrgGrid>
        </OrganizationSection>
      )}

      {/* 그룹별 조직 현황 */}
      {shouldShowContent.groupOrganizationSection && groupOrganizationData && (
        <OrganizationSection>
          <ChartTitle>{selectedGroup} 그룹 조직 현황</ChartTitle>
          <OrgGrid>
            {Object.keys(groupOrganizationData).map(teamName => {
              const teamData = groupOrganizationData[teamName];
              return (
                <OrgCard key={teamName}>
                  <OrgTitle>{teamName}</OrgTitle>
                  <OrgStats>
                    <OrgStatLabel>구성원:</OrgStatLabel>
                    <OrgStatValue>{teamData.totalMembers}명</OrgStatValue>
                  </OrgStats>
                  <OrgStats>
                    <OrgStatLabel>출석률:</OrgStatLabel>
                    <OrgStatValue>{teamData.attendanceRate}%</OrgStatValue>
                  </OrgStats>
                </OrgCard>
              );
            })}
          </OrgGrid>
        </OrganizationSection>
      )}

      {/* 연속 결석자 정보 섹션 */}
      <ConsecutiveAbsenceSection>
        <ChartTitle>최근 4주 청년예배 연속 결석 현황</ChartTitle>
        <AbsenceGrid>
          <AbsenceCard severity="high">
            <AbsenceTitle severity="high">
              🚨 4주 연속 결석자
            </AbsenceTitle>
            <AbsenceStats>
              <AbsenceStatValue severity="high">
                {consecutiveAbsenceStats?.sunday?.consecutive4Weeks || 0}명
              </AbsenceStatValue>
            </AbsenceStats>
            <AbsenceList>
              {(consecutiveAbsenceStats?.sunday?.members?.consecutive4Weeks || []).slice(0, 5).map((member, index) => (
                <AbsenceItem key={index} consecutiveWeeks={member.consecutiveWeeks}>
                  <AbsenceMemberInfo>
                    <AbsenceMemberName>{member.name}</AbsenceMemberName>
                    {member.role && <AbsenceMemberRole>{member.role}</AbsenceMemberRole>}
                    <AbsenceTeamName>{member.team}</AbsenceTeamName>
                  </AbsenceMemberInfo>
                  <AbsenceBadge consecutiveWeeks={member.consecutiveWeeks}>
                    {member.consecutiveWeeks}주 연속
                  </AbsenceBadge>
                </AbsenceItem>
              ))}
            </AbsenceList>
          </AbsenceCard>

          <AbsenceCard severity="medium">
            <AbsenceTitle severity="medium">
              ⚠️ 3주 연속 결석자
            </AbsenceTitle>
            <AbsenceStats>
              <AbsenceStatValue severity="medium">
                {consecutiveAbsenceStats?.sunday?.consecutive3Weeks || 0}명
              </AbsenceStatValue>
            </AbsenceStats>
            <AbsenceList>
              {(consecutiveAbsenceStats?.sunday?.members?.consecutive3Weeks || []).slice(0, 5).map((member, index) => (
                <AbsenceItem key={index} consecutiveWeeks={member.consecutiveWeeks}>
                  <AbsenceMemberInfo>
                    <AbsenceMemberName>{member.name}</AbsenceMemberName>
                    {member.role && <AbsenceMemberRole>{member.role}</AbsenceMemberRole>}
                    <AbsenceTeamName>{member.team}</AbsenceTeamName>
                  </AbsenceMemberInfo>
                  <AbsenceBadge consecutiveWeeks={member.consecutiveWeeks}>
                    {member.consecutiveWeeks}주 연속
                  </AbsenceBadge>
                </AbsenceItem>
              ))}
            </AbsenceList>
          </AbsenceCard>

          <AbsenceCard severity="low">
            <AbsenceTitle severity="low">
              🔄 2주 연속 결석자
            </AbsenceTitle>
            <AbsenceStats>
              <AbsenceStatValue severity="low">
                {consecutiveAbsenceStats?.sunday?.consecutive2Weeks || 0}명
              </AbsenceStatValue>
            </AbsenceStats>
            <AbsenceList>
              {(consecutiveAbsenceStats?.sunday?.members?.consecutive2Weeks || []).slice(0, 5).map((member, index) => (
                <AbsenceItem key={index} consecutiveWeeks={member.consecutiveWeeks}>
                  <AbsenceMemberInfo>
                    <AbsenceMemberName>{member.name}</AbsenceMemberName>
                    {member.role && <AbsenceMemberRole>{member.role}</AbsenceMemberRole>}
                    <AbsenceTeamName>{member.team}</AbsenceTeamName>
                  </AbsenceMemberInfo>
                  <AbsenceBadge consecutiveWeeks={member.consecutiveWeeks}>
                    {member.consecutiveWeeks}주 연속
                  </AbsenceBadge>
                </AbsenceItem>
              ))}
            </AbsenceList>
          </AbsenceCard>
        </AbsenceGrid>
      </ConsecutiveAbsenceSection>

      {/* 연속 출석 통계 섹션 */}
      <ConsecutiveAttendanceSection>
        <ChartTitle>최근 4주 연속 출석 현황</ChartTitle>
        <ConsecutiveGrid columns="1fr 1fr 1fr">
          <ConsecutiveCard>
            <ConsecutiveTitle>
              🙏 수요제자기도회
            </ConsecutiveTitle>
            <ConsecutiveStats>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.wednesday.consecutive4Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>4주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.wednesday.consecutive3Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>3주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.wednesday.consecutive2Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>2주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
            </ConsecutiveStats>
            {selectedGuk !== '전체' && (
              <ViewButton onClick={() => openAttendancePopup('wednesday', '수요제자기도회 4주간 연속 출석 인원')}>
                출석인원 확인
              </ViewButton>
            )}
          </ConsecutiveCard>

          <ConsecutiveCard>
            <ConsecutiveTitle>
              ⛪ 두란노사역자모임
            </ConsecutiveTitle>
            <ConsecutiveStats>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.friday.consecutive4Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>4주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.friday.consecutive3Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>3주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.friday.consecutive2Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>2주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
            </ConsecutiveStats>
            {selectedGuk !== '전체' && (
              <ViewButton onClick={() => openAttendancePopup('friday', '두란노사역자모임 4주간 연속 출석 인원')}>
                출석인원 확인
              </ViewButton>
            )}
          </ConsecutiveCard>

          <ConsecutiveCard>
            <ConsecutiveTitle>
              🎯 대예배
            </ConsecutiveTitle>
            <ConsecutiveStats>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.special.consecutive4Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>4주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.special.consecutive3Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>3주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
              <ConsecutiveStat>
                <ConsecutiveStatValue>{consecutiveStats.special.consecutive2Weeks}</ConsecutiveStatValue>
                <ConsecutiveStatLabel>2주 연속</ConsecutiveStatLabel>
              </ConsecutiveStat>
            </ConsecutiveStats>
            {selectedGuk !== '전체' && (
              <ViewButton onClick={() => openAttendancePopup('special', '대예배 4주간 연속 출석 인원')}>
                출석인원 확인
              </ViewButton>
            )}
          </ConsecutiveCard>
        </ConsecutiveGrid>
      </ConsecutiveAttendanceSection>

      {/* 출석 상태별 통계 섹션 */}
      {shouldShowContent.attendanceStatus && attendanceStatusStats && (
        <AttendanceStatusSection>
          <ChartTitle>출석 상태별 통계</ChartTitle>
          <StatusGrid>
            {Object.entries(attendanceStatusStats).map(([status, stats]) => (
              <StatusCard key={status} color={stats.color}>
                <StatusTitle>
                  {status === '정기 출석자' && '✅ 정기 출석자'}
                  {status === '관심 출석자' && '⚠️ 관심 출석자'}
                  {status === '단기 결석자' && '🔄 단기 결석자'}
                  {status === '장기 결석자' && '🚨 장기 결석자'}
                  {status === '제적 대상자' && '❌ 제적 대상자'}
                </StatusTitle>
                <StatusStats>
                  <StatusCount>{stats.count}명</StatusCount>
                  <StatusPercentage color={stats.color}>
                    {stats.percentage}%
                  </StatusPercentage>
                </StatusStats>
                <StatusDescription>{stats.description}</StatusDescription>
              </StatusCard>
            ))}
          </StatusGrid>
        </AttendanceStatusSection>
      )}

      <ChartsGrid columns="1fr">
        {shouldShowContent.charts.monthlyTrend && (
          <ChartCard>
            <ChartTitle>주차별 청년예배 출석 트렌드</ChartTitle>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart 
                data={weeklyAttendanceTrends}
                margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="weekLabel" 
                  stroke="#6B7280"
                  interval={0} // 모든 라벨 표시
                  tick={{ fontSize: 11, angle: -45, textAnchor: 'end' }} // 라벨 회전 및 정렬
                  height={70} // X축 높이 증가
                />
                <YAxis stroke="#6B7280" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #E5E7EB',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  labelFormatter={(value) => `주차: ${value}`}
                  formatter={(value, name) => [`${value}명`, '출석 인원']}
                />
                <Line 
                  type="monotone" 
                  dataKey="출석" 
                  stroke="#26428B" 
                  strokeWidth={3}
                  dot={{ fill: '#26428B', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#26428B', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        )}


      </ChartsGrid>



      {/* 여백 추가 */}
      <div style={{ height: '40px' }}></div>

      {shouldShowContent.recentActivities && (
        <ActivitiesSection>
          <ChartTitle>최근 활동 (심방, 지역모임)</ChartTitle>
                    {currentActivities.slice(0, 10).map((activity) => (
            <ActivityItem key={activity.id}>
              <ActivityIcon 
                color={
                  activity.type === '심방' ? '#E3AF64' :
                  activity.type === '지역모임' ? '#26428B' : '#6B7280'
                }
              >
                {activity.type === '심방' ? '🏠' :
                 activity.type === '지역모임' ? '📍' : '📝'}
              </ActivityIcon>
              <ActivityContent>
                <ActivityTitle>{activity.member} - {activity.type}</ActivityTitle>
                <ActivitySubtitle>{activity.group}</ActivitySubtitle>
              </ActivityContent>
              <ActivityTime>
                {activity.date}<br />
                {activity.time}
              </ActivityTime>
            </ActivityItem>
          ))}
        </ActivitiesSection>
      )}

      {/* 출석 인원 팝업창 */}
      {showAttendancePopup && (
        <PopupOverlay onClick={() => setShowAttendancePopup(false)}>
          <PopupContainer onClick={(e) => e.stopPropagation()}>
            <PopupHeader>
              <PopupTitle>{attendancePopupData.title}</PopupTitle>
              <CloseButton onClick={() => setShowAttendancePopup(false)}>×</CloseButton>
            </PopupHeader>
            <PopupContent>
              <AttendanceList>
                {attendancePopupData.data.length > 0 ? (
                  attendancePopupData.data.map((member, index) => (
                    <AttendanceItem key={index} consecutiveWeeks={member.consecutiveWeeks}>
                      <MemberInfo>
                        <MemberName>{member.name}</MemberName>
                        {member.role && <MemberRole>{member.role}</MemberRole>}
                        <TeamName>{member.team}</TeamName>
                      </MemberInfo>
                      <ConsecutiveBadge consecutiveWeeks={member.consecutiveWeeks}>
                        {member.consecutiveWeeks}주 연속
                      </ConsecutiveBadge>
                    </AttendanceItem>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-secondary)' }}>
                    연속 출석한 인원이 없습니다.
                  </div>
                )}
              </AttendanceList>
            </PopupContent>
          </PopupContainer>
        </PopupOverlay>
      )}
    </DashboardContainer>
  );
};

export default Dashboard; 