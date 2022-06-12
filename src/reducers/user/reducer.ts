import {HYDRATE} from 'next-redux-wrapper';

import {State as BaseState} from '../base/state';
import {Actions} from './actions';
import * as constants from './constants';

import * as Redux from 'redux';
import {Currency} from 'src/interfaces/currency';
import {WrappedExperience} from 'src/interfaces/experience';
import {Network} from 'src/interfaces/network';
import {SocialMedia} from 'src/interfaces/social';
import {User, UserTransactionDetail, UserWallet} from 'src/interfaces/user';

export interface UserState extends BaseState {
  user?: User;
  socials: SocialMedia[];
  currencies: Currency[];
  experiences: WrappedExperience[];
  transactionDetail: UserTransactionDetail;
  anonymous: boolean;
  alias: string;
  verifying: boolean;
  currentWallet?: UserWallet;
  wallets: UserWallet[];
  networks: Network[];
  userWalletAddress: string | null;
}

const initalState: UserState = {
  loading: false,
  anonymous: false,
  currencies: [],
  socials: [],
  experiences: [],
  wallets: [],
  networks: [],
  userWalletAddress: null,
  transactionDetail: {
    sent: [],
    received: [],
  },
  alias: '',
  verifying: false,
};

export const UserReducer: Redux.Reducer<UserState, Actions> = (state = initalState, action) => {
  switch (action.type) {
    case HYDRATE: {
      return action.payload.userState;
    }

    case constants.FETCH_USER: {
      return {
        ...state,
        user: action.user,
        currencies: action.user.currencies,
      };
    }

    case constants.SET_USER_AS_ANONYMOUS: {
      return {
        ...state,
        anonymous: true,
        alias: action.alias,
      };
    }

    case constants.UPDATE_USER: {
      return {
        ...state,
        user: action.user,
      };
    }

    case constants.CLEAR_USER: {
      return {
        ...state,
        anonymous: false,
        alias: '',
      };
    }

    case constants.SET_DEFAULT_CURRENCY: {
      return {
        ...state,
        user: action.user,
      };
    }

    case constants.ADD_USER_TOKEN: {
      return {
        ...state,
        currencies: [...state.currencies, action.payload],
      };
    }

    case constants.FETCH_USER_SOCIALS: {
      return {
        ...state,
        socials: action.payload,
      };
    }

    case constants.FETCH_USER_EXPERIENCE: {
      return {
        ...state,
        experiences: action.experiences,
      };
    }

    case constants.FETCH_CURRENT_USER_WALLETS: {
      return {
        ...state,
        currentWallet: action.payload,
      };
    }

    case constants.ADD_USER_WALLET: {
      return {
        ...state,
        wallets: [...state.wallets, action.payload],
      };
    }

    case constants.FETCH_USER_WALLETS: {
      return {
        ...state,
        wallets: action.payload,
      };
    }

    case constants.FETCH_USER_WALLET_ADDRESS: {
      return {
        ...state,
        userWalletAddress: action.payload,
      };
    }

    case constants.FETCH_NETWORK: {
      return {
        ...state,
        networks: action.payload,
      };
    }

    case constants.FETCH_USER_TRANSACTION_DETAIL: {
      return {
        ...state,
        transactionDetail: action.payload,
      };
    }

    case constants.SET_VERIFYING_SOCIAL_ACCOUNT: {
      return {
        ...state,
        verifying: true,
        error: undefined,
      };
    }

    case constants.RESET_VERIFYING_SOCIAL_ACCOUNT: {
      return {
        ...state,
        verifying: false,
        error: undefined,
      };
    }

    default: {
      return state;
    }
  }
};
