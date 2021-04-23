// This is where polkadot API functions live,
// if you want to perform any function, you should import it from here
// Don't know how to use the API? Visit https://polkadot.js.org/docs/api/start/basics

export const connectToBlockchain = async () => {
  try {
    const { ApiPromise, WsProvider } = await import('@polkadot/api');
    const wsProvider = new WsProvider('wss://rpc.myriad.systems/');
    const api = await new ApiPromise({
      provider: wsProvider
      //types: types
    }).isReadyOrError;
    console.log('api is:', api);
    return api;
  } catch (error) {
    console.log('error from connectToBlockchain: ', error);
  }
};

export const getBalance = async ADDR => {
  try {
    const DECIMAL_PLACES = 10000000000;
    //const ADDR = '5CS8upU5c44NaPu7qiSXGwna7oeDGG3vifM5nZAbwx3nTGTm';
    const api = await connectToBlockchain();
    const {
      data: { free: previousFree }
    } = await api.query.system.account(ADDR);
    return Number(Number(previousFree) / DECIMAL_PLACES.toFixed(3));
  } catch (error) {
    console.log('error from get balance: ', error);
  }
};

// snippets to send transaction
// finds an injector for an address
export const sendTip = async (fromAddress, toAddress, amountSent) => {
  try {
    const { enableExtension } = await import('../helpers/extension');
    const { web3FromSource } = await import('@polkadot/extension-dapp');

    const allAccounts = await enableExtension();
    // We select the first account found by using fromAddress
    // `account` is of type InjectedAccountWithMeta
    const account = allAccounts.find(function (account) {
      return account.address === fromAddress;
    });
    const api = await connectToBlockchain();

    // here we use the api to create a balance transfer to some account of a value of 12345678
    const transferExtrinsic = api.tx.balances.transfer(toAddress, amountSent);

    // to be able to retrieve the signer interface from this account
    // we can use web3FromSource which will return an InjectedExtension type
    const injector = await web3FromSource(account.meta.source);

    // passing the injected account address as the first argument of signAndSend
    // will allow the api to retrieve the signer and the user will see the extension
    // popup asking to sign the balance transfer transaction
    const txInfo = await transferExtrinsic.signAndSend(fromAddress, { signer: injector.signer });

    return { trxHash: txInfo.toHex(), from: fromAddress };
  } catch (error) {
    console.log('error from sendtip:', error);
  }
};

export const getWalletHistory = async () => {
  const api = await connectToBlockchain();
  //Subscribe to system events via storage
  api.query.system.events(events => {
    console.log(`\nReceived ${events.length} events:`);

    //Loop through the Vec<EventRecord>
    events.forEach(record => {
      //Extract the phase, event and the event types
      const { event, phase } = record;
      const types = event.typeDef;

      //Show what we are busy with
      console.log(`\t${event.section}:${event.method}:: (phase=${phase.toString()})`);
      console.log(`\t\t${event.meta.documentation.toString()}`);

      //Loop through each of the parameters, displaying the type and data
      event.data.forEach((data, index) => {
        console.log(`\t\t\t${types[index].type}: ${data.toString()}`);
      });
    });
  });
};
