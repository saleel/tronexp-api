import { bytesToString, base64DecodeFromString } from '../../rpc/utils/bytes';
import { getBase58CheckAddress } from '../../rpc/utils/crypto';

function formatAccount(account) {
  let name = bytesToString(account.getAccountName());
  let address = getBase58CheckAddress(Array.from(account.getAddress()));
  let balance = account.getBalance();
  let trxBalance = 0;
  if (balance !== 0) {
    trxBalance = (balance / 1000000).toFixed(6);
  }

  let assetMap = account.getAssetMap().toArray();

  let tokenBalances = [];

  for (let asset of Object.keys(assetMap)) {
    tokenBalances.push({
      name: assetMap[asset][0],
      balance: assetMap[asset][1]
    });
  }

  let frozenBalances = account.getFrozenList().map(frozenBalance => ({
    amount: frozenBalance.getFrozenBalance(),
    expires: frozenBalance.getExpireTime()
  }));

  let totalFrozenBalance = 0;

  for (let frozenBalance of frozenBalances) {
    totalFrozenBalance += frozenBalance.amount;
  }

  return {
    name,
    address,
    trxBalance,
    tokenBalances
  };
}

export { formatAccount };
