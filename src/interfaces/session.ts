import {NetworkIdEnum} from './network';
import {WalletTypeEnum} from './wallet';

export interface SignInCredential {
  nonce: number;
  signature: string;
  name: string;
  anonymous: 'false' | 'true';
  address: string;
  publicAddress: string;
  instanceURL: string;
  networkId: NetworkIdEnum;
  walletType: WalletTypeEnum;
}

export interface SignInWithEmailCredential {
  name: string;
  username: string;
  email: string;
  loginToken: string;
  instanceURL: string;
}
