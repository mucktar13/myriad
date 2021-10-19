import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import {useStyles} from './help.style';

export const HelpComponent: React.FC = () => {
  const style = useStyles();

  return (
    <List className={style.root}>
      <ListItem className={style.item} alignItems="center">
        <ListItemText>
          <Typography className={style.name} component="span" color="textPrimary">
            Terms and conditions
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem className={style.item} alignItems="center">
        <ListItemText>
          <Typography className={style.name} component="span" color="textPrimary">
            Privacy and Policy
          </Typography>
        </ListItemText>
      </ListItem>
      <ListItem className={style.item} alignItems="center">
        <ListItemText>
          <Typography className={style.name} component="span" color="textPrimary">
            Contact us
          </Typography>
        </ListItemText>
      </ListItem>
    </List>
  );
};
