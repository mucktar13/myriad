import React from 'react';

import {BlockListContainer} from '../../BlockUserList/BlockList.container';
import {HelpComponent} from '../../Help/Help';
import {AccountSettingsContainer} from '../AccountSettingsContainer';
import {LanguageSettingsContainer} from '../LanguageSettingsContainer';
import {NotificationSettingsContainer} from '../NotificationSettings.container';

import i18n from 'src/locale';

export type SettingsType =
  | 'account'
  | 'notification'
  | 'block'
  | 'language'
  | 'about'
  | 'feedback'
  | 'help'
  | 'version';
export type SettingsOption<T> = {
  id: T;
  title: string;
  subtitle?: string;
  component?: React.ReactNode;
};

export const useSettingList = (): SettingsOption<SettingsType>[] => {
  return [
    {
      id: 'account',
      title: i18n.t('Setting.List_Menu.Account_Title'),
      subtitle: i18n.t('Setting.List_Menu.Account_Subtitle'),
      component: <AccountSettingsContainer />,
    },
    {
      id: 'notification',
      title: i18n.t('Setting.List_Menu.Notification_Title'),
      subtitle: i18n.t('Setting.List_Menu.Notification_Subtitle'),
      component: <NotificationSettingsContainer />,
    },
    {
      id: 'block',
      title: i18n.t('Setting.List_Menu.Blocked_Title'),
      subtitle: i18n.t('Setting.List_Menu.Blocked_Subtitle'),
      component: <BlockListContainer />,
    },
    {
      id: 'language',
      title: i18n.t('Setting.List_Menu.Language_Title'),
      subtitle: i18n.t('Setting.List_Menu.Language_Subtitle'),
      component: <LanguageSettingsContainer />,
    },
    {
      id: 'help',
      title: i18n.t('Setting.List_Menu.Help_Title'),
      subtitle: i18n.t('Setting.List_Menu.Help_Subtitle'),
      component: <HelpComponent />,
    },
    {
      id: 'about',
      title: i18n.t('Setting.List_Menu.About_Title'),
      subtitle: i18n.t('Setting.List_Menu.About_Subtitle'),
    },
    {
      id: 'feedback',
      title: i18n.t('Setting.List_Menu.Feedback_Title'),
      subtitle: i18n.t('Setting.List_Menu.Feedback_Subtitle'),
    },
    {
      id: 'version',
      title: i18n.t('Setting.List_Menu.Version_Title'),
    },
  ];
};
