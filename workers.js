import { deserializeTransaction } from './rpc';
import Transaction from './services/transactions/transactions.model';
import Account from './services/accounts/accounts.model';
import { getBase58CheckAddress } from './rpc/utils/crypto';

function setup(app) {
  let interval = 1000;

  async function getDataForBlock(num) {
    const client = app.get('grpcClient');

    const blockRes = await client.getBlockByNumber(num);
    const blockNumber = blockRes
      .getBlockHeader()
      .getRawData()
      .getNumber();

    const witnessAddress = getBase58CheckAddress(
      Array.from(
        blockRes
          .getBlockHeader()
          .getRawData()
          .getWitnessAddress()
      )
    );

    if (!blockNumber) {
      return [];
    }

    const trans = []
      .concat(...blockRes.getTransactionsList().map(deserializeTransaction))
      .map(t => ({
        ...t,
        blockNumber
      }));

    return { trans, witnessAddress };
  }

  async function runTask() {
    try {
      console.log('Starting worker');
      const client = app.get('grpcClient');

      const lastBlock = await client.getLatestBlock();
      const latestBlockNumber = lastBlock.toObject().blockHeader.rawData.number;

      const latestTransactionInDb = await Transaction.findOne({}).sort({
        blockNumber: -1
      });
      const latestBlockNumInDb =
        (latestTransactionInDb && latestTransactionInDb.blockNumber) || 0;

      for (
        let i = latestBlockNumber;
        i < Math.min(latestBlockNumber, latestBlockNumInDb + 5000);
        i += 1
      ) {
        const { trans = [], witnessAddress } = await getDataForBlock(i);
        try {
          await Transaction.insertMany(trans);
        } catch (e) {
          for (let t of trans) {
            await Transaction.findOneAndUpdate({ hash: t.hash }, t, {
              upsert: true
            });
          }
        }

        if (witnessAddress) {
          await Account.findOneAndUpdate(
            { address: witnessAddress },
            {
              address: witnessAddress,
              $addToSet: {
                blocks: i
              }
            },
            {
              upsert: true
            }
          );
        }

        const accounts = []
          .concat(...trans.map(t => [t.from, t.to]))
          .map(a => ({
            address: a
          }));

        try {
          await Account.insertMany(accounts);
        } catch (e) {
          for (let a of accounts) {
            await Account.findOneAndUpdate({ address: a.address }, a, {
              upsert: true
            });
          }
        }
      }

      if (latestBlockNumber - latestBlockNumInDb < 100) {
        interval = 10000;
      }
    } catch (err) {
      console.warn(err);
    }

    setTimeout(() => {
      runTask();
    }, interval);
  }

  runTask();
}

export default setup;
