import { deserializeTransaction } from '../../rpc';
import Transaction from './transactions.model';

class TransactionService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');
  }

  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;

    const transactions = await Transaction.find()
      .sort({ blockNumber: -1 })
      .limit(limit)
      .skip(skip);

    const count = await Transaction.count();

    return {
      total: count,
      limit,
      skip,
      data: transactions
    };
  }

  async get(hash) {
    const transaction = await Transaction.findOne({ hash });
    return transaction;
  }
}

export default TransactionService;
