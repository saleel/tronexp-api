const getBase58CheckAddress = require("../utils/crypto").getBase58CheckAddress;
const { Block, Transaction, AccountType } = require("../protocol/core/Tron_pb");
const {
  TransferContract,
  TransferAssetContract,
  VoteAssetContract,
  VoteWitnessContract,
  WitnessCreateContract,
  AssetIssueContract,
  AccountCreateContract,
  DeployContract,
  WitnessUpdateContract,
  ParticipateAssetIssueContract,
  AccountUpdateContract,
  FreezeBalanceContract,
  UnfreezeBalanceContract,
  WithdrawBalanceContract
} = require("../protocol/core/Contract_pb");
import { SHA256 } from "../utils/crypto";
import { getContractListFromTransaction } from "../lib/code";
import { bytesToString, byteArray2hexStr } from "../utils/bytes";

function deserializeTransaction(tx) {
  // let contractType = Transaction.Contract.ContractType;

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

  const transactions = [];
  let transObject;
  let contractList = tx.getRawData().getContractList();
  const ContractType = Transaction.Contract.ContractType;

  const timestamp = +`${tx.getRawData().getTimestamp()}`.slice(0, 13);
  const hash = byteArray2hexStr(SHA256(tx.serializeBinary()));

  for (let contract of contractList) {
    let any = contract.getParameter();
    const contractType = contract.getType();
    const typeName = Object.keys(ContractType).find(k => ContractType[k] === contractType);
    let transactionData = {};

    switch (contractType) {
      case ContractType.ACCOUNTCREATECONTRACT:
        {
          transObject = any.unpack(
            AccountCreateContract.deserializeBinary,
            "protocol.AccountCreateContract"
          );

          const accountType = transObject.getType();
          const accountTypeName = Object.keys(AccountType).find(k => AccountType[k] === accountType);
          const owner = transObject.getOwnerAddress();
          const ownerHex = getBase58CheckAddress(Array.from(owner));
          const name = bytesToString(transObject.getAccountName());

          transactionData = {
            type: accountTypeName,
            owner: ownerHex,
            name,
          };
        }
        break;

      case ContractType.TRANSFERCONTRACT:
        {
          transObject = any.unpack(
            TransferContract.deserializeBinary,
            "protocol.TransferContract"
          );

          let owner = transObject.getOwnerAddress();
          let ownerHex = getBase58CheckAddress(Array.from(owner));
          let to = transObject.getToAddress();
          let toHex = getBase58CheckAddress(Array.from(to));
          let amount = transObject.getAmount() / 1000000;

          transactionData = {
            asset: "TRX",
            from: ownerHex,
            to: toHex,
            amount
          };
        }
        break;

      case ContractType.TRANSFERASSETCONTRACT:
        {
          transObject = any.unpack(
            TransferAssetContract.deserializeBinary,
            "protocol.TransferAssetContract"
          );

          const asset = transObject.getAssetName();
          const assetHex = bytesToString(asset);
          const owner = transObject.getOwnerAddress();
          const ownerHex = getBase58CheckAddress(Array.from(owner));
          const to = transObject.getToAddress();
          const toHex = getBase58CheckAddress(Array.from(to));
          const amount = transObject.getAmount() / 1000000;

          transactionData = {
            asset: assetHex,
            from: ownerHex,
            to: toHex,
            amount
          };
        }
        break;

      case ContractType.VOTEASSETCONTRACT:
        {
          transObject = any.unpack(
            VoteAssetContract.deserializeBinary,
            "protocol.VoteAssetContract"
          );
          
          const owner = transObject.getOwnerAddress();
          const ownerHex = getBase58CheckAddress(Array.from(owner));
          const voteAddressList = transObject.getVoteAddressList();
          const voteAddresses = voteAddressList.map(v => getBase58CheckAddress(Array.from(v.getVoteAddress)));
          const support = transObject.getSupport();
          const count = transObject.getCount();

          transactionData = {
            owner: ownerHex,
            voteAddresses,
            support,
            count
          };
        }
        break;

      case ContractType.VOTEWITNESSCONTRACT:
        {
          transObject = any.unpack(
            VoteWitnessContract.deserializeBinary,
            "protocol.VoteWitnessContract"
          );

          const owner = transObject.getOwnerAddress();
          const ownerHex = getBase58CheckAddress(Array.from(owner));
          const voteAddressList = transObject.getVotesList();
          const votes = voteAddressList.map(v => ({
            address: getBase58CheckAddress(Array.from(v.getVoteAddress)),
            count: v.getVoteCount(),
          }));
          const support = transObject.getSupport();

          transactionData = {
            owner: ownerHex,
            votes,
            support
          };
        }
        break;

      case ContractType.WITNESSCREATECONTRACT:
        {
          transObject = any.unpack(
            WitnessCreateContract.deserializeBinary,
            "protocol.WitnessCreateContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            url: bytesToString(transObject.getUrl()),
          };
        }
        break;

      case ContractType.ASSETISSUECONTRACT:
        {
          transObject = any.unpack(
            AssetIssueContract.deserializeBinary,
            "protocol.AssetIssueContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            name: bytesToString(transObject.getName()),
            totalSupply: transObject.getTotalSupply(),
            trxNum: transObject.getTrxNum(),
            num: transObject.getNum(),
            startTime: transObject.getStartTime(),
            endTime: transObject.getEndTime(),
            decayRatio: transObject.getDecayRatio(),
            voteScore: transObject.getVoteScore(),
            description: bytesToString(transObject.getDescription()),
            url: bytesToString(transObject.getUrl()),
          };
        }
        break;

      case ContractType.DEPLOYCONTRACT:
        {
          transObject = any.unpack(
            DeployContract.deserializeBinary,
            "protocol.DeployContract"
          );
          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            script: getBase58CheckAddress(Array.from(transObject.getScript())),
          }
        }
        break;

      case ContractType.WITNESSUPDATECONTRACT:
        {
          transObject = any.unpack(
            WitnessUpdateContract.deserializeBinary,
            "protocol.WitnessUpdateContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            updateUrl: bytesToString(transObject.getUpdateUrl()),
          }
        }
        break;

      case ContractType.PARTICIPATEASSETISSUECONTRACT:
        {
          transObject = any.unpack(
            ParticipateAssetIssueContract.deserializeBinary,
            "protocol.ParticipateAssetIssueContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            toAddress: getBase58CheckAddress(Array.from(transObject.getToAddress())),
            assetName: bytesToString(transObject.getAssetName()),
            amount: bytesToString(transObject.getAmount()),
          }
        }
        break;
      case ContractType.ACCOUNTUPDATECONTRACT:
        {
          transObject = any.unpack(
            AccountUpdateContract.deserializeBinary,
            "protocol.AccountUpdateContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            accountName: bytesToString(transObject.getAccountName()),
          }
        }
        break;
      case ContractType.FREEZEBALANCECONTRACT:
        {
          transObject = any.unpack(
            FreezeBalanceContract.deserializeBinary,
            "protocol.FreezeBalanceContract"
          );
          
          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
            frozenBalance: transObject.getFrozenBalance(),
            frozenDuration: transObject.getFrozenDuration(),
          }
        }
        break;

      case ContractType.UNFREEZEBALANCECONTRACT:
        {
          transObject = any.unpack(
            UnfreezeBalanceContract.deserializeBinary,
            "protocol.UnfreezeBalanceContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
          }
        }
        break;

      case ContractType.WITHDRAWBALANCECONTRACT:
        {
          transObject = any.unpack(
            WithdrawBalanceContract.deserializeBinary,
            "protocol.WithdrawBalanceContract"
          );

          transactionData = {
            owner: getBase58CheckAddress(Array.from(transObject.getOwnerAddress())),
          }
        }
        break;
    }

    const owner = transObject ? transObject.getOwnerAddress() : '';
    const ownerHex = getBase58CheckAddress(Array.from(owner));

    const transaction = {
      contractType: typeName,
      hash,
      timestamp,
      owner: ownerHex,
      data: transactionData
    };

    transactions.push(transaction);
  }

  return transactions;
}

module.exports = {
  deserializeTransaction
};
