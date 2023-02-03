import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router';

import {useRouter} from 'next/router';

import {Button, TextField, Typography} from '@material-ui/core';

import {useStyles} from './LoginByEmail.style';

import SelectServer from 'components/SelectServer';
import Cookies from 'js-cookie';
import {useAuthLinkHook} from 'src/hooks/auth-link.hook';
import {ServerListProps} from 'src/interfaces/server-list';
import i18n from 'src/locale';
import validator from 'validator';

type LoginByEmailProps = {
  onNext: (successCallback: () => void, failedCallback: () => void, email: string) => Promise<void>;
  setSelectedInstance?: (server: ServerListProps) => void;
};

const LoginByEmail = ({onNext, setSelectedInstance}: LoginByEmailProps) => {
  const styles = useStyles();
  const {requestLink} = useAuthLinkHook();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [error, setError] = useState({
    isError: false,
    message: '',
  });
  const [serverSelected, setServerSelected] = useState<null | ServerListProps>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    if (!input.length) {
      setError({isError: false, message: ''});
    } else if (!validator.isEmail(input)) {
      setError({
        isError: true,
        message: 'Please enter a valid email!',
      });
    } else {
      setError({
        isError: false,
        message: '',
      });
    }
    setEmail(event.target.value);
  };

  const navigate = useNavigate();

  const handleNext = () => {
    onNext(
      () => {
        requestLink(email);
        navigate('/magiclink');
      },
      () => {
        navigate('/createAccounts');
      },
      email,
    );
  };

  const handleBack = () => {
    navigate('/');
  };

  useEffect(() => {
    if (serverSelected) {
      router.push({query: {rpc: `${serverSelected.apiUrl}`}}, undefined, {shallow: true});
      Cookies.set('instance', serverSelected.apiUrl);
    }
  }, [serverSelected]);

  const toggleSelected = (server: ServerListProps) => {
    setServerSelected(server);
    setSelectedInstance(server);
  };

  return (
    <div className={styles.root}>
      <div>
        <Typography className={styles.title}>{i18n.t('Login.Email.LoginByEmail.Title')}</Typography>
        <Typography className={styles.subtitle}>
          {i18n.t('Login.Email.LoginByEmail.Subtitle')}
        </Typography>
      </div>
      <TextField
        fullWidth
        id="user-email-input"
        label="Email"
        variant="outlined"
        placeholder={i18n.t('Login.Email.LoginByEmail.Email_Placeholder')}
        value={email}
        onChange={handleChange}
        error={error.isError}
        helperText={error.isError ? error.message : ''}
      />
      <SelectServer onServerSelect={server => toggleSelected(server)} />
      <div className={styles.actionWrapper}>
        <Button variant="outlined" color="primary" onClick={handleBack}>
          {i18n.t('Login.Email.LoginByEmail.Back')}
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={!email.length || error.isError || !serverSelected}
          onClick={handleNext}>
          {i18n.t('Login.Email.LoginByEmail.Next')}
        </Button>
      </div>
    </div>
  );
};

export default LoginByEmail;
