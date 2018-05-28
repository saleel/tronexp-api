import { formatToken } from './tokens.utils';

class TokenService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');
  }

  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;

    const tokenRes = await this.client.getTokens();
    const tokens = tokenRes.map(formatToken);

    const data = tokens
      .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
      .slice(skip, skip + limit);

    return {
      total: tokens.length,
      limit,
      skip,
      data
    };
  }
}

export default TokenService;
