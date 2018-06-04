import { deserializeTransaction } from "./rpc";
import Transaction from "./services/transactions/transactions.model";
import Account from "./services/accounts/accounts.model";
import { getBase58CheckAddress } from "./rpc/utils/crypto";

let lastBlockSynced;
function setup(app) {
  let interval = 1000;

  async function getDataForBlock(block) {
    const client = app.get("grpcClient");

    const blockRes = await client.getBlockByNumber(block);
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

    return { trans, witnessAddress, block };
  }

  async function insertDataToDb({ trans = [], witnessAddress, block }) {
    if (trans.length) {
      try {
        await Transaction.insertMany(trans);
      } catch (e) {
        for (let t of trans) {
          await Transaction.findOneAndUpdate({ hash: t.hash }, t, {
            upsert: true
          });
        }
      }

      const transfers = trans.filter(
        t => ["TRANSFERCONTRACT", "TRANSFERASSETCONTRACT"].includes(t.contractType)
      );

      if (transfers.length) {
        const accounts = []
        .concat(...transfers.map(t => [t.data.from, t.data.to]))
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
    }

    if (witnessAddress) {
      await Account.findOneAndUpdate(
        { address: witnessAddress },
        {
          address: witnessAddress,
          $addToSet: {
            blocks: block
          }
        },
        {
          upsert: true
        }
      );
    }
  }

  async function runTask() {
    try {
      console.log("Starting worker");
      const client = app.get("grpcClient");

      const lastBlock = await client.getLatestBlock();
      const latestBlockNumber = lastBlock.toObject().blockHeader.rawData.number;

      if (!lastBlockSynced) {
        const latestTransactionInDb = await Transaction.findOne({}).sort({
          blockNumber: -1
        });
        lastBlockSynced =
          (latestTransactionInDb && latestTransactionInDb.blockNumber) || 1;
      }

      const asyncLimit = 100;
      const perLoopLimit = 1000;
      const blockNums = Array.from(
        {
          length: Math.floor(
            Math.min(latestBlockNumber - lastBlockSynced, perLoopLimit) /
              asyncLimit
          )
        },
        (v, k) => asyncLimit * k + lastBlockSynced
      );

      if (blockNums.length > 1) {
        console.log('Syncing Blocks ', blockNums[0], ' to ', blockNums[blockNums.length -1]);
        
        for (let blockNum of blockNums) {
          const asyncBlockNums = Array.from(
            { length: asyncLimit },
            (v, k) => k + blockNum
          );
          await Promise.all(
            asyncBlockNums.map(n => getDataForBlock(n).then(insertDataToDb))
          );
        }
        lastBlockSynced = Math.min(lastBlockSynced + perLoopLimit, latestBlockNumber);
      } else {
        console.log('No new blocks. slowing down');
        interval += 10000;
      }

      setTimeout(() => {
        runTask();
      }, interval);
    } catch (err) {
      console.warn(err);
    }
  }

  runTask();
}

export default setup;
