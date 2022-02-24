import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'relative',
      width: 312,
      marginBottom: 12,

      [theme.breakpoints.down('md')]: {
        maxWidth: 290,
      },

      '& .MuiSvgIcon-root': {
        fill: 'none',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 35,
        left: 0,
        width: 8,
        height: 40,
        borderRadius: theme.spacing(0, 1.25, 1.25, 0),
        background: theme.palette.primary.main,
      },
    },
    box: {
      background: '#FFF',
      paddingBottom: 4,
      padding: '30px 28px',
      boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.05)',
    },
    avatar: {
      width: 48,
      marginRight: 4,

      '&:hover': {
        cursor: 'pointer',
      },

      [theme.breakpoints.down('xs')]: {
        marginRight: 8,
      },
    },
    identity: {
      maxWidth: 162,

      [theme.breakpoints.down('md')]: {
        maxWidth: 142,
      },

      '& .MuiTypography-h5': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordWrap: 'break-word',
      },
    },
    name: {
      [theme.breakpoints.down('xs')]: {
        fontWeight: theme.typography.fontWeightMedium,
        fontSize: 16,
      },
    },
    username: {
      [theme.breakpoints.down('xs')]: {
        fontSize: 12,
      },
    },
    notification: {
      width: 40,

      '& .MuiIconButton-root': {
        padding: 8,
      },
      '& .MuiBadge-dot': {
        backgroundColor: theme.status.danger.main,
      },
    },
    text: {
      fontSize: '12px',
      '&:hover': {
        fontWeight: 600,
        cursor: 'pointer',
      },
    },
    textAlign: {
      textAlign: 'left',
    },
    downIconButton: {
      width: '100%',
      background: '#FFF',
      textAlign: 'center',
      borderBottomLeftRadius: theme.spacing(2.5),
      borderBottomRightRadius: theme.spacing(2.5),
      '&:hover': {
        cursor: 'pointer',
        background: 'rgba(255, 200, 87, 0.2)',
      },
    },
    gutters: {
      paddingLeft: '30px',
      paddingRight: '30px',
    },
    hover: {
      '&:hover': {
        background: 'rgba(255, 200, 87, 0.2)',
      },
    },
    content: {
      width: '100%',
      background: '#FFF',
    },
    open: {
      height: 'auto',
      maxHeight: '9999px',
      transition: 'all 0.5s cubic-bezier(1,0,1,0)',
    },
    close: {
      maxHeight: 0,
      overflow: 'hidden',
      transition: 'all 0.5s cubic-bezier(0,1,0,1)',
    },
    flex: {
      display: 'flex',
      alignItems: 'center',
    },
    profileContent: {
      [theme.breakpoints.down('xs')]: {
        marginBottom: theme.spacing(3),
      },
    },
  }),
);
