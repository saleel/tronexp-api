import { formatWitness } from './witnesses.utils';

class WitnessService {
  setup(app) {
    this.app = app;
    this.client = app.get('grpcClient');
  }

  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;
    const witnessesRes = await this.client.getWitnesses();
    const witnesses = witnessesRes.map(formatWitness);

    const data = witnesses
      .sort((a, b) => b.startTime - a.startTime)
      .slice(skip, skip + limit);

    return {
      total: witnesses.length,
      limit,
      skip,
      data
    };
  }
}

export default WitnessService;
