import { formatBlock } from './blocks.utils';
import { format } from 'path';

class BlocksService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');

    this.blocks = [];
    this.updatedTillBlock = 0;
    this.cacheBlocks();
  }

  // Cache transactions from last 50 blocks
  async cacheBlocks() {
    const lastBlock = await this.client.getLatestBlock();
    const latestBlockNumber = lastBlock.toObject().blockHeader.rawData.number;

    if (latestBlockNumber > this.updatedTillBlock) {
      const limit = 100;

      let newBocks = [];
      for (let i = latestBlockNumber; i > latestBlockNumber - limit; i -= 1) {
        const blockRes = await this.client.getBlockByNumber(i);
        newBocks.push(formatBlock(blockRes));
      }

      this.blocks = newBocks;
      this.updatedTillBlock = latestBlockNumber;
    }

    setTimeout(async () => {
      await this.cacheBlocks();
    }, 10000);
  }

  // Cache most recent 10 blcoks in memory, for faster response
  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;
    const blocks = [];

    const lastBlock = await this.client.getLatestBlock();
    const latestBlockNumber = lastBlock.toObject().blockHeader.rawData.number;

    for (let i = skip; i < skip + limit; i += 1) {
      const blockRes = await this.client.getBlockByNumber(
        latestBlockNumber - i
      );
      const block = formatBlock(blockRes);
      blocks.push(block);
    }

    const data = blocks.sort((a, b) => b.number - a.number);
    // .slice(skip, skip + limit);

    return {
      total: latestBlockNumber,
      limit,
      skip,
      data
    };
  }

  async get(id) {
    const blockRes = await this.client.getBlockByNumber(id);
    return formatBlock(blockRes, true);
  }
}

export default BlocksService;
