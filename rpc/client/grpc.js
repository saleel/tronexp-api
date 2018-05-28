const {
  EmptyMessage,
  NumberMessage,
  BytesMessage,
  Account
} = require('../protocol/api/api_pb');
import { decode58Check } from '../utils/crypto';
import { base64DecodeFromString } from '../lib/code';

class GrpcClient {
  constructor(options) {
    this.hostname = options.hostname;
    this.port = options.port;

    const {
      WalletClient,
      WalletSolidityClient
    } = require('../protocol/api/api_grpc_pb');
    const caller = require('grpc-caller');

    this.api = caller(`${this.hostname}:${this.port}`, WalletClient);
    this.solidityApi = caller(
      `${this.hostname}:${this.port}`,
      WalletSolidityClient
    );
  }

  async getWitnesses() {
    return await this.api
      .listWitnesses(new EmptyMessage())
      .then(x => x.getWitnessesList());
  }

  async getNodes() {
    return await this.api
      .listNodes(new EmptyMessage())
      .then(x => x.getNodesList());
  }

  async getAccounts() {
    return await this.api
      .listAccounts(new EmptyMessage())
      .then(x => x.getAccountsList());
  }

  async getBlockByNumber(number) {
    let message = new NumberMessage();
    message.setNum(number);
    return await this.api.getBlockByNum(message);
  }

  async getLatestBlock() {
    return await this.api.getNowBlock(new EmptyMessage());
  }

  async getTokens() {
    return await this.api
      .getAssetIssueList(new EmptyMessage())
      .then(a => a.getAssetissueList());
  }

  async getTotalTransactions() {
    return await this.api.totalTransaction(new EmptyMessage());
  }

  async getTransactionById(hash) {
    const msg = new BytesMessage();
    const btoa = function(str) {
      return new Buffer(str).toString('base64');
    };
    msg.setValue(Uint8Array.from(base64DecodeFromString(btoa(hash))));
    return await this.api.getTransactionById(msg);
  }

  async getAccountByAddress(address) {
    const account = new Account();
    account.setAddress(Uint8Array.from(decode58Check(address)));
    return await this.api.getAccount(account);
  }
}

module.exports = GrpcClient;
