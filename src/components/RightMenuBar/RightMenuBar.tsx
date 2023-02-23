import {
  ChatAlt2Icon,
  HashtagIcon,
  VariableIcon,
  TrendingUpIcon,
} from '@heroicons/react/outline';

import React, { useState } from 'react';

import dynamic from 'next/dynamic';

import { SvgIcon } from '@material-ui/core';

import { TabsComponent } from '../atoms/Tabs';
import { useStyles } from './RightMenuBar.styles';

import i18n from 'src/locale';

const ExperienceTab = dynamic(() => import('./tabs/ExperienceTab'));
const TrendingTab = dynamic(() => import('./tabs/TrendingTab'));
const TrendingExperienceTab = dynamic(
  () => import('./tabs/TrendingExperienceTab'),
);

export const RightMenuBar: React.FC = () => {
  const iconTabs = [
    {
      id: 'experienceTabMenu',
      icon: <SvgIcon component={VariableIcon} />,
      component: <ExperienceTab />,
    },
    {
      id: 'trendingExperienceTabPanel',
      icon: <SvgIcon component={TrendingUpIcon} />,
      component: <TrendingExperienceTab />,
    },
    {
      id: 'trendingTabPanel',
      icon: <SvgIcon component={HashtagIcon} />,
      component: <TrendingTab />,
    },
    {
      id: 'chatTabPanel',
      icon: <SvgIcon component={ChatAlt2Icon} />,
      component: null,
      tooltip: i18n.t('Tooltip.Chat'),
      disabled: true,
    },
  ];

  const classes = useStyles();

  const [activeTab, setActiveTab] = useState('experienceTabMenu');

  const handleChangeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className={classes.root}>
      <TabsComponent
        selected={activeTab}
        tabs={iconTabs}
        position="left"
        mark="cover"
        size="small"
        onChangeTab={handleChangeTab}
      />
    </div>
  );
};
