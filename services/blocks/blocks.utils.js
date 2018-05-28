import crypto from 'crypto';
import { deserializeTransaction } from '../../rpc';
import {
  byteArray2hexStr,
  base64DecodeFromString
} from '../../rpc/utils/bytes';
import { SHA256, getBase58CheckAddress } from '../../rpc/utils/crypto';

function formatBlock(block, includeTransactions = false) {
  if (typeof block.getBlockHeader !== 'function') {
    return {};
  }

  let transactions = [];
  if (includeTransactions) {
    transactions = [].concat(
      ...block.getTransactionsList().map(deserializeTransaction)
    );
  }

  return {
    hash: byteArray2hexStr(SHA256(block.getBlockHeader().serializeBinary())),
    size: base64DecodeFromString(block.serializeBinary()).length,
    parentHash: byteArray2hexStr(
      block
        .getBlockHeader()
        .getRawData()
        .getParenthash()
    ),
    number: block
      .getBlockHeader()
      .getRawData()
      .getNumber(),
    witnessAddress: getBase58CheckAddress(
      Array.from(
        block
          .getBlockHeader()
          .getRawData()
          .getWitnessAddress()
      )
    ),
    timestamp: block
      .getBlockHeader()
      .getRawData()
      .getTimestamp(),
    transactionsCount: block.getTransactionsList().length,
    ...(includeTransactions && { transactions })
  };
}

export { formatBlock };
