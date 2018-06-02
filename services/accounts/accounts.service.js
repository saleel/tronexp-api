import Account from './accounts.model';
import Transaction from '../transactions/transactions.model';
import { formatAccount } from './accounts.utils';

class AccountsService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');

    this.app.service('accounts').hooks({
      error(context) {
        console.error(context.error);
      }
    });
  }

  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;
    const accountsTemp = await Account.find()
      .sort({ createdOn: -1 })
      .limit(limit)
      .skip(skip);

    const count = await Account.count();

    const accountPromises = accountsTemp.map(acc => {
      return this.client
        .getAccountByAddress(acc.address)
        .then(a => formatAccount(a));
    });

    const accounts = await Promise.all(accountPromises);

    return {
      total: count,
      limit,
      skip,
      data: accounts
    };
  }

  async get(address) {
    let accountRes;
    try {
      accountRes = await this.client.getAccountByAddress(address);
    } catch (err) {
      throw new Error('Invalid address');
    }

    const account = formatAccount(accountRes);

    // const accountDb = await Account.findOne({ address: account.address });
    // account.blocks = accountDb ? accountDb.blocks : [];

    if (account.address.length < 30) {
      account.address = address;
    }

    // Add to caching db
    await Account.findOneAndUpdate({ address }, { address }, { upsert: true });

    account.fromTransfers = await Transaction.find({
      from: address
    });

    account.toTransfers = await Transaction.find({
      to: address
    });

    // account.transactions = await Transaction.find({
    //   $or: [{ to: address }, { from: address }]
    // })
    //   .sort({ blockNumber: -1 })
    //   .limit(100);

    return account;
  }
}

export default AccountsService;
