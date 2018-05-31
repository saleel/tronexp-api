import scrapeIt from 'scrape-it';

class MarketsService {
  setup(app) {
    this.app = app;
    this.data = [];

    this.fetchData();
  }

  async fetchData() {
    try {
      const { data } = await scrapeIt(
        'https://coinmarketcap.com/currencies/tron/#markets',
        {
          markets: {
            listItem: '#markets-table tr',
            data: {
              exchange: 'td:nth-child(2)',
              pair: 'td:nth-child(3)',
              volume24: 'td:nth-child(4)',
              price: 'td:nth-child(5)',
              volumePercent: 'td:nth-child(6)'
            }
          }
        }
      );

      this.data = data.markets.filter(m => m.exchange);
    } catch (e) {
      console.warn('Error fetching market data', e);
    }

    setTimeout(async () => {
      await this.fetchData();
    }, 600000);
  }

  async find(params) {
    let { skip, limit } = params.query;
    limit = parseInt(limit, 10) || 10;
    skip = parseInt(skip, 10) || 0;

    const data = this.data.slice(skip, skip + limit);

    return {
      skip,
      limit,
      total: this.data.length,
      data
    };
  }
}

export default MarketsService;
