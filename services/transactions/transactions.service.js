import { deserializeTransaction } from '../../rpc';
import Transaction from './transactions.model';

class TransactionService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');
  }

  async find(params) {
    let { skip, limit, contractType = [], address } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;
    contractType = Array.isArray(contractType) ? contractType : [contractType];

    const findParams = {
      ...contractType.length && { contractType: { $in: contractType } },
      ...address && { $or: [
        { 'owner': address },
        { 'data.from': address },
        { 'data.to': address }]
      },
    }

    const transactions = await Transaction.find(findParams)
      .sort({ blockNumber: -1 })
      .limit(limit)
      .skip(skip);

    const count = await Transaction.count(findParams);

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
