import { formatNode } from './nodes.utils';

class NodesService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');
  }

  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;

    const nodesRes = await this.client.getNodes();
    const nodes = await nodesRes.reduce((acc, i) => {
      return acc.then(arr => {
        return formatNode(i).then(formatted => {
          return [...arr, formatted];
        });
      });
    }, Promise.resolve([]));

    const data = nodes
      .sort((a, b) => (a.city > b.city ? 1 : b.city > a.city ? -1 : 0))
      .slice(skip, skip + limit);

    return {
      total: nodes.length,
      limit,
      skip,
      data
    };
  }
}

export default NodesService;
