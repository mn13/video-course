import { Account, ConnectAdditionalRequest, TonProofItemReplySuccess } from "@tonconnect/sdk";

class TonProofApi {
    private host = 'http://localhost:9980';

    public accessToken: string | null = null;

    async generatePayload(): Promise<ConnectAdditionalRequest | undefined> {
        try {
            const a = new BigUint64Array(1);
            self.crypto.getRandomValues(a);
            return { tonProof: a[0].toString(10) };
        } catch (e) {
            console.error(e);
            return;
        }
    }

    async checkProof(proof: TonProofItemReplySuccess['proof'], account: Account) {
        try {
            const requestBody = {
                address: account.address,
                network: account.chain,
                stateInit: account.walletStateInit,
                proof
            }

            const response = await (
                await fetch(`${this.host}/login/ton`, {
                    method: 'POST',
                    body: JSON.stringify(requestBody)
                })
            ).json()

            if (response?.token) {
                this.accessToken = response?.token;
            }
        } catch (e) {
            console.log(e);
        }
    }

    async getAccountInfo(account: Account) {
        return (
            await fetch(`${this.host}/dapp/getAccountInfo?network=${account.chain}`, {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                }
            })
        ).json();
    }
}

export const tonProofApi = new TonProofApi();
