import React from 'react';

import { Typography } from '@material-ui/core';

import { useStyles } from './Tab.style';

import { TrendingListContainer } from 'src/components/Trending';

export const TrendingTab: React.FC = () => {
  const styles = useStyles();

  return (
    <div className={styles.root} id="worldwide">
      <div className={styles.content}>
        <Typography variant="h4">Top Weekly Hashtag</Typography>
        <TrendingListContainer />
      </div>
    </div>
  );
};

export default TrendingTab;
