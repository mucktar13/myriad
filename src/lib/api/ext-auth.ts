import MyriadAPI from './base';

type LoginProps = {
  nonce: number;
  signature: string;
  publicAddress: string;
};

type SignUpProps = {
  id: string;
  name: string;
  username: string;
};

type SignUpResponseProps = {
  nonce: number;
};

type LoginResponseProps = {
  accessToken: string;
};

export const login = async (values: LoginProps): Promise<LoginResponseProps | null> => {
  try {
    const {data} = await MyriadAPI.request({
      url: '/login',
      method: 'POST',
      data: values,
    });

    return data;
  } catch (error) {
    console.log({error});
    return null;
  }
};

export const signUp = async (values: SignUpProps): Promise<SignUpResponseProps | null> => {
  try {
    const {data} = await MyriadAPI.request({
      url: '/signup',
      method: 'POST',
      data: values,
    });

    return data;
  } catch (error) {
    console.log({error});
    return null;
  }
};
