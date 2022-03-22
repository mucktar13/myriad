import {BalanceDetail} from 'src/interfaces/balance';
import {Comment} from 'src/interfaces/comment';
import {ReferenceType} from 'src/interfaces/interaction';
import {People} from 'src/interfaces/people';
import {Post} from 'src/interfaces/post';
import {User} from 'src/interfaces/user';

export type TippingOptions = {
  receiver: User | People;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
};

export interface TippingProviderProps {
  anonymous: boolean;
  sender?: User;
  balances: BalanceDetail[];
}

export type SendTipProps = {
  sender: User;
  receiver: User | People;
  reference: Post | Comment | User;
  referenceType: ReferenceType;
  balances: BalanceDetail[];
  onSuccess: (currency: BalanceDetail) => Promise<void> | void;
};
