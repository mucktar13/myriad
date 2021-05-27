import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import MoodIcon from '@material-ui/icons/Mood';
import PersonAddIcon from '@material-ui/icons/PersonAdd';

import { Transaction } from 'src/interfaces/transaction';

type Props = {
  transactions: Transaction[];
  userId: string;
  sortType?: string;
  sortDirection?: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: '#E0E0E0'
    },
    textSecondary: {
      color: '#E0E0E0'
    },
    action: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.common.white
    },
    badge: {
      textAlign: 'right',
      '& > *': {
        margin: '4px 2px',
        textAlign: 'right',
        height: theme.spacing(2),
        textTransform: 'uppercase'
      }
    },
    avatar: {
      minWidth: 40
    },
    green: {
      backgroundColor: '#4caf50',
      color: '#FFF'
    },
    received: {
      color: '#4caf50'
    },
    red: {
      backgroundColor: '#f44336',
      color: '#FFF'
    },
    sent: {
      color: '#f44336'
    },
    loading: {
      color: '#A942E9'
    },
    panel: {
      padding: '4px'
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    transactionActionList: {
      display: 'flex',
      flexDirection: 'row',
      padding: 0,
      alignItems: 'flex-start'
    },
    iconButton: {
      color: '#FFF',
      margin: theme.spacing(1)
    },
    typography: {
      padding: theme.spacing(2)
    }
  })
);

export default function TransactionListComponent({ transactions, userId }: Props) {
  const style = useStyles();
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setAllTransactions(transactions);
  }, []);

  const defaultUserName = 'Unknown Myrian';

  const RenderPrimaryText = (txHistory: Transaction) => {
    return (
      <div>
        {userId === txHistory?.from ? (
          <Typography>
            You sent tips to {txHistory?.toUser?.name ?? defaultUserName}'s post with {txHistory?.value / 1000000000000} ACA coins
          </Typography>
        ) : (
          <Typography>
            {txHistory?.fromUser?.name ?? defaultUserName} tipped your post with {txHistory?.value / 1000000000000} ACA coins
          </Typography>
        )}
      </div>
    );
  };

  const RenderSecondaryText = (txHistory: Transaction) => {
    const formatDate = () => {
      let formattedDate = new Date(txHistory?.createdAt);
      return formattedDate.toUTCString();
    };

    return <Typography variant="subtitle2">{formatDate()}</Typography>;
  };

  if (transactions.length === 0) return null;

  return (
    <List>
      {allTransactions.map(txHistory => (
        <ListItem key={txHistory?.id}>
          <Card>
            <CardActionArea>
              <CardContent>
                <ListItemAvatar className={style.avatar}>
                  <Avatar
                    aria-label="avatar"
                    src={txHistory?.toUser?.id === userId ? txHistory?.fromUser?.profilePictureURL : txHistory?.toUser?.profilePictureURL}
                  />
                </ListItemAvatar>
                <ListItemText
                  className={style.textSecondary}
                  secondaryTypographyProps={{ style: { color: '#bdbdbd' } }}
                  primary={RenderPrimaryText(txHistory)}
                  secondary={RenderSecondaryText(txHistory)}
                />
              </CardContent>
            </CardActionArea>
            {
              //<ListItemSecondaryAction>
              //<div className={style.badge}>
              //<Chip
              //color="default"
              //size="small"
              //label={
              //txHistory?.state === 'success' || txHistory?.state === 'verified'
              //? 'Success'
              //: [txHistory.state === 'pending' ? 'Pending' : 'Failed']
              //}
              ///>
              //<Chip
              //className={userId === txHistory?.from ? style.red : style.green}
              //color="default"
              //size="small"
              //label={userId === txHistory?.from ? 'Out' : 'In'}
              ///>
              //<Typography>{txHistory?.value / 1000000000000} Myria</Typography>
              //</div>
              //</ListItemSecondaryAction>
            }
            <CardActions>
              <Button size="small" variant="contained" color="default" className={style.iconButton} startIcon={<MoodIcon />}>
                Send Emoji
              </Button>
              <Button size="small" variant="contained" color="primary" className={style.iconButton} startIcon={<PersonAddIcon />}>
                Add Friend
              </Button>
            </CardActions>
          </Card>
        </ListItem>
      ))}
    </List>
  );
}
