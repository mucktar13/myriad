import {BalanceDetail} from 'src/interfaces/balance';
import {Token} from 'src/interfaces/token';
import {WalletDetail} from 'src/interfaces/wallet';

export interface InputState {
  amount: string;
}

export interface InputErrorState {
  isErrorInput: boolean;
  isTextChanged: boolean;
  isInsufficientBalance: boolean;
  errorMessage: string;
}

export interface SendTipConfirmed {
  isConfirmed: boolean;
  message: string;
}

export type Props = {
  userAddress: string;
  success: (postId: string) => void;
  postId: string;
  balanceDetails: BalanceDetail[];
  receiverId?: string;
  availableTokens: Token[];
  walletReceiverDetail?: WalletDetail;
};
