import { getBase58CheckAddress } from '../../rpc/utils/crypto';

function formatWitness(witnessRes) {
  const witness = witnessRes.toObject();

  const producedTotal = witnessRes.getTotalproduced();
  const missedTotal = witnessRes.getTotalmissed();

  return {
    address: getBase58CheckAddress(Array.from(witnessRes.getAddress())),
    url: witnessRes.getUrl(),
    latestBlockNumber: witnessRes.getLatestblocknum(),
    producedTotal,
    missedTotal,
    voteCount: witnessRes.getVotecount(),
    productivity: +(
      producedTotal /
      (producedTotal + missedTotal) *
      100
    ).toFixed(2)
  };

  // return {
  //   address: witness.address,
  //   voteCount: witness.votecount,
  //   url: witness.url,
  //   latestBlockNumber: witness.latestblocknum,
  //   producedTotal: witness.totalproduced,
  //   missedTotal: witness.totalmissed,
  //   productivity: +(
  //     witness.totalproduced /
  //     (witness.totalproduced + witness.totalmissed) *
  //     100
  //   ).toFixed(2)
  // };
}

export { formatWitness };
