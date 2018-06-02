import { bytesToString, base64DecodeFromString } from '../../rpc/utils/bytes';
import { getBase58CheckAddress } from '../../rpc/utils/crypto';
import { AccountType } from '../../rpc/protocol/core/Tron_pb';

function formatAccount(account) {
  const name = bytesToString(account.getAccountName());
  const address = getBase58CheckAddress(Array.from(account.getAddress()));
  const balance = account.getBalance();

  let trxBalance = 0;
  if (balance !== 0) {
    trxBalance = (balance / 1000000).toFixed(6);
  }

  const assetMap = account.getAssetMap().toArray();
  const tokenBalances = [];
  for (let asset of Object.keys(assetMap)) {
    tokenBalances.push({
      name: assetMap[asset][0],
      balance: assetMap[asset][1]
    });
  }

  const frozenBalances = account.getFrozenList().map(frozenBalance => ({
    amount: frozenBalance.getFrozenBalance(),
    expires: frozenBalance.getExpireTime()
  }));

  let totalFrozenBalance = 0;
  for (let frozenBalance of frozenBalances) {
    totalFrozenBalance += frozenBalance.amount;
  }

  const votes = account.getVotesList().map(v => ({
    address: getBase58CheckAddress(Array.from(v.getVoteAddress())),
    votes: v.getVoteCount()
  }));

  const typeNum = account.getType();
  const type = Object.keys(AccountType).find(k => AccountType[k] == typeNum);
  const bandwidth = account.getBandwidth();
  const createdOn = account.getCreateTime();
  const latestOprationTime = account.getLatestOprationTime();
  const latestWithdrawTime = account.getLatestWithdrawTime();
  const allowance = account.getAllowance();
  const code = account.getCode();

  return {
    name,
    address,
    trxBalance,
    tokenBalances,
    type,
    bandwidth,
    createdOn,
    allowance,
    latestOprationTime,
    latestWithdrawTime,
    votes,
    code,
    frozenBalances,
    totalFrozenBalance
  };
}

export { formatAccount };
