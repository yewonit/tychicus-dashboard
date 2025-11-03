import styled from 'styled-components';

export const ChartContainer = styled.div`
  background: var(--bg-card);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--shadow-light);
  margin-bottom: 20px;
  
  @media (max-width: 1024px) {
    padding: 15px;
    margin-bottom: 15px;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 12px;
  }
`;

export const SummaryInfo = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: rgba(54, 162, 235, 0.1);
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    padding: 12px;
  }
`;

export const SummaryItem = styled.div`
  text-align: center;
  
  .label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 5px;
  }
  
  .value {
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary);
  }
`;

export const ChartTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 20px;
  text-align: left;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }
`;

export const ChartWrapper = styled.div`
  position: relative;
  height: 400px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    height: 300px;
    margin-bottom: 15px;
  }
`;

export const WorshipInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
    margin-top: 15px;
  }
`;

export const WorshipCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 15px;
  border: 1px solid var(--border-color);
  box-shadow: var(--shadow-light);
  
  .worship-title {
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 10px;
    text-align: center;
  }
  
  .worship-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    text-align: center;
  }
  
  .stat-item {
    .label {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin-bottom: 3px;
    }
    
    .value {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
  }
  
  @media (max-width: 768px) {
    padding: 12px;
    
    .worship-stats {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
`;

export const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-size: 1rem;
  
  @media (max-width: 768px) {
    padding: 30px 15px;
    font-size: 0.9rem;
  }
`;

