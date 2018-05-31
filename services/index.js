import BlocksService from './blocks/blocks.service';
import WitnessesService from './witnesses/witnesses.service';
import NodesService from './nodes/nodes.service';
import AccountsService from './accounts/accounts.service';
import TransactionService from './transactions/transactions.service';
import TokenService from './tokens/tokens.service';
import MarketsService from './markets/markets.service';

function services(app) {
  app.use('/blocks', new BlocksService());
  app.use('/witnesses', new WitnessesService());
  app.use('/nodes', new NodesService());
  app.use('/accounts', new AccountsService());
  app.use('/transactions', new TransactionService());
  app.use('/tokens', new TokenService());
  app.use('/markets', new MarketsService());
}

export default services;
