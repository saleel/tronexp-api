const getBase58CheckAddress = require('../utils/crypto').getBase58CheckAddress;
const { Block, Transaction } = require('../protocol/core/Tron_pb');
const { TransferContract } = require('../protocol/core/Contract_pb');
import { SHA256 } from '../utils/crypto';
import { byteArray2hexStr } from '../utils/bytes';

function deserializeTransaction(tx) {
  let contractType = Transaction.Contract.ContractType;

  let contractList = tx.getRawData().getContractList();
  let timestamp = parseInt(tx.getRawData().getTimestamp(), 10);

  var hash = byteArray2hexStr(SHA256(tx.serializeBinary()));

  let transactions = [];

  for (let contract of contractList) {
    let any = contract.getParameter();

    switch (contract.getType()) {
      case contractType.ACCOUNTCREATECONTRACT:
        {
          // contractType = contractType .ACCOUNTCREATECONTRACT;

          let obje = any.unpack(
            AccountCreateContract.deserializeBinary,
            'protocol.AccountCreateContract'
          );

          console.log('obje', obje);
          throw new Error('');

          transactions.push({});
        }
        break;

      case contractType.TRANSFERCONTRACT:
        {
          // let contractType = contractType .TRANSFERCONTRACT;

          let obje = any.unpack(
            TransferContract.deserializeBinary,
            'protocol.TransferContract'
          );

          let owner = obje.getOwnerAddress();
          let ownerHex = getBase58CheckAddress(Array.from(owner));

          let to = obje.getToAddress();
          let toHex = getBase58CheckAddress(Array.from(to));

          let amount = obje.getAmount() / 1000000;

          transactions.push({
            hash,
            from: ownerHex,
            to: toHex,
            amount,
            timestamp
          });
        }
        break;
    }
  }

  return transactions;
}

module.exports = {
  deserializeTransaction
};
