import React, { ReactNode } from 'react';

import { Session } from 'next-auth';
import dynamic from 'next/dynamic';
import Head from 'next/head';

import NoSsr from '@material-ui/core/NoSsr';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import { TimelineProvider } from '../../context/timeline.context';
import AlertComponent from '../alert/Alert.component';
import { ConverstionProvider } from '../conversation/conversation.context';
import { ExperienceProvider } from '../experience/experience.context';
import { TransactionProvider } from '../tippingJar/transaction.context';

import TipAlertComponent from 'src/components/alert/TipAlert.component';
import { LayoutSettingProvider } from 'src/context/layout.context';
import { UserProvider } from 'src/context/user.context';
import TourComponent from 'src/tour/Tour.component';

const DektopLayoutComponent = dynamic(() => import('./desktop-layout.component'));
const MobileLayoutComponent = dynamic(() => import('./mobile-layout.component'));

type LayoutProps = {
  session: Session | null;
  children: ReactNode;
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      maxHeight: '100vh',
      overflow: 'auto'
    }
  })
);

const Layout: React.FC<LayoutProps> = ({ children, session }) => {
  const style = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const userId = session?.user.id as string;

  if (!session) return null;

  return (
    <div className={style.root}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <LayoutSettingProvider>
        <UserProvider>
          <NoSsr>
            <TourComponent disable={Boolean(session.user.anonymous)} userId={userId} />
          </NoSsr>
          <TransactionProvider>
            <ExperienceProvider>
              <ConverstionProvider>
                <TimelineProvider>
                  {isMobile ? (
                    <MobileLayoutComponent user={session.user}>{children}</MobileLayoutComponent>
                  ) : (
                    <DektopLayoutComponent user={session.user}>{children}</DektopLayoutComponent>
                  )}
                </TimelineProvider>
              </ConverstionProvider>
            </ExperienceProvider>
          </TransactionProvider>
        </UserProvider>
      </LayoutSettingProvider>

      <AlertComponent />
      <TipAlertComponent />
    </div>
  );
};

export default Layout;
