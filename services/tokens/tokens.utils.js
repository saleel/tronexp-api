import { bytesToString } from '../../rpc/utils/bytes';
import { getBase58CheckAddress } from '../../rpc/utils/crypto';

function formatToken(token) {
  return {
    name: bytesToString(token.getName()),
    ownerAddress: getBase58CheckAddress(Array.from(token.getOwnerAddress())),
    totalSupply: token.getTotalSupply(),
    startTime: token.getStartTime(),
    endTime: token.getEndTime(),
    description: bytesToString(token.getDescription()),
    num: token.getNum(),
    trxNum: token.getTrxNum(),
    decayRatio: token.getDecayRatio(),
    voteScore: token.getVoteScore(),
    price: token.getTrxNum() / token.getNum(),
    url: bytesToString(token.getUrl())
  };
}

export { formatToken };
