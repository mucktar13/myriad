import React from 'react';

import { Typography } from '@material-ui/core';

import { useStyles } from './Tab.style';

import { TrendingListContainer } from 'src/components/Trending';

export const TrendingTab: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root} id="worldwide">
      <Typography variant="h4" className={styles.desktop}>
        Trends
      </Typography>
      <div className={styles.content}>
        <TrendingListContainer />
      </div>
    </div>
  );
};

export default TrendingTab;
