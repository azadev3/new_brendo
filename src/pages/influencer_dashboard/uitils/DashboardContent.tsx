import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import Dashboard from './sidebarPages/Dashboard';
import Collections from './sidebarPages/Collections';
import Promocodes from './sidebarPages/Promocodes';
import Payments from './sidebarPages/Payments';
import Settings from './sidebarPages/Settings';
import Story from './sidebarPages/Story';

const DashboardContent: React.FC = () => {
  const location = useLocation();
  const { lang = 'ru' } = useParams();

  const returnComponents = () => {
    if (location.pathname === `/${lang}/influencer/dashboard`) {
      return <Dashboard />;
    } else if (location.pathname === `/${lang}/influencer/kolleksiyalar`) {
      return <Collections />;
    } else if (location.pathname === `/${lang}/influencer/promokodlar`) {
      return <Promocodes />;
    } else if (location.pathname === `${lang}/influencer/qazanc-ve-odenisler`) {
      return <Payments />;
    } else if (location.pathname === `/${lang}/influencer/tenzimlemeler`) {
      return <Settings />;
    } else if (location.pathname === `/${lang}/influencer/story`) {
      return <Story />
    }
  };

  return <div className="right-dashboard-content">{returnComponents()}</div>;
};

export default DashboardContent;
