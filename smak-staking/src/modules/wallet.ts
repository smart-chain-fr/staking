import { TezosToolkit } from "@taquito/taquito";
import { config } from "../../config/config";
import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";

export class Wallet{
    private tk: TezosToolkit;
    private wallet: BeaconWallet;
    private network: NetworkType;

    constructor(tk: TezosToolkit){
        // Set the RPC
        this.tk = tk
        
        // Set the network
        this.network = (config.NODE_ENV=="development")?NetworkType.EDONET:NetworkType.MAINNET;
        
        // Set the wallet
        const options = {
            name: 'SMAK Staking',
            iconUrl: 'https://tezostaquito.io/img/favicon.png',
            preferredNetwork: this.network
        };
        this.wallet = new BeaconWallet(options);
    }

    public async setupWallet(){
      const activeAccount = await this.wallet.client.getActiveAccount();

      if (activeAccount) {
        // If defined, the user is connected to a wallet.
        // You can now do an operation request, sign request, or send another permission request to switch wallet
        console.log("Already connected");
      } else {
        await this.wallet.requestPermissions();
        //this.tk.setWalletProvider(this.wallet);
        this.tk.setProvider({wallet: this.wallet})
      }
    
      const address = await this.wallet.getPKH();
      return address;
    }
}
