const getBase58CheckAddress = require('../utils/crypto').getBase58CheckAddress;
const { Block, Transaction } = require('../protocol/core/Tron_pb');
const {
  TransferContract,
  TransferAssetContract,
  VoteAssetContract,
  VoteWitnessContract,
  WitnessCreateContract,
  AssetIssueContract
} = require('../protocol/core/Contract_pb');
import { SHA256 } from '../utils/crypto';
import { getContractListFromTransaction } from '../lib/code';
import { bytesToString, byteArray2hexStr } from '../utils/bytes';

function deserializeTransaction(tx) {
  let contractType = Transaction.Contract.ContractType;

  let contractList = tx.getRawData().getContractList();
  let timestamp = +`${tx.getRawData().getTimestamp()}`.slice(0, 13);
  var hash = byteArray2hexStr(SHA256(tx.serializeBinary()));
  let transactions = [];

  console.log(contractList);

  // { ACCOUNTCREATECONTRACT: 0,
  //   TRANSFERCONTRACT: 1,
  //   TRANSFERASSETCONTRACT: 2,
  //   VOTEASSETCONTRACT: 3,
  //   VOTEWITNESSCONTRACT: 4,

  //   WITNESSCREATECONTRACT: 5,
  //   ASSETISSUECONTRACT: 6,

  //   DEPLOYCONTRACT: 7,
  //   WITNESSUPDATECONTRACT: 8,
  //   PARTICIPATEASSETISSUECONTRACT: 9,
  //   ACCOUNTUPDATECONTRACT: 10,
  //   FREEZEBALANCECONTRACT: 11,
  //   UNFREEZEBALANCECONTRACT: 12,
  //   WITHDRAWBALANCECONTRACT: 13,
  //   CUSTOMCONTRACT: 20 }

  let transaction;

  for (let contract of contractList) {
    let any = contract.getParameter();

    switch (contract.getType()) {
      case contractType.ACCOUNTCREATECONTRACT:
        {
          let obje = any.unpack(
            AccountCreateContract.deserializeBinary,
            'protocol.AccountCreateContract'
          );
          let owner = obje.getOwnerAddress();
          transactions.push({
            owner,
            hash,
            timestamp
          });
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
            owner,
            asset: 'TRX',
            hash,
            from: ownerHex,
            to: toHex,
            amount,
            timestamp
          });
        }
        break;

      case contractType.TRANSFERASSETCONTRACT:
        {
          let obje = any.unpack(
            TransferAssetContract.deserializeBinary,
            'protocol.TransferAssetContract'
          );

          let asset = obje.getAssetName();
          let assetHex = bytesToString(asset);

          let owner = obje.getOwnerAddress();
          let ownerHex = getBase58CheckAddress(Array.from(owner));

          let to = obje.getToAddress();
          let toHex = getBase58CheckAddress(Array.from(to));

          let amount = obje.getAmount() / 1000000;

          transactions.push({
            owner,
            asset: assetHex,
            hash,
            from: ownerHex,
            to: toHex,
            amount,
            timestamp
          });
        }
        break;

      case contractType.VOTEASSETCONTRACT:
        {
          let obje = any.unpack(
            VoteAssetContract.deserializeBinary,
            'protocol.VoteAssetContract'
          );
          let owner = obje.getOwnerAddress();
          transactions.push({
            owner,
            hash,
            timestamp
          });
        }
        break;

      case contractType.VOTEWITNESSCONTRACT:
        {
          let obje = any.unpack(
            VoteWitnessContract.deserializeBinary,
            'protocol.VoteWitnessContract'
          );
          let owner = obje.getOwnerAddress();
          transactions.push({
            owner,
            hash,
            timestamp
          });
        }
        break;

      case contractType.WITNESSCREATECONTRACT:
        {
          let obje = any.unpack(
            WitnessCreateContract.deserializeBinary,
            'protocol.WitnessCreateContract'
          );
          let owner = obje.getOwnerAddress();
          transactions.push({
            owner,
            hash,
            timestamp
          });
        }
        break;

      case contractType.ASSETISSUECONTRACT:
        {
          let obje = any.unpack(
            AssetIssueContract.deserializeBinary,
            'protocol.AssetIssueContract'
          );
          let owner = obje.getOwnerAddress();
          transactions.push({
            owner,
            hash,
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
