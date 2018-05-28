// import geopip from 'geoip-lite';
import geolite2 from 'geolite2';
import maxmind from 'maxmind';
import isPortReachable from 'is-port-reachable';

const lookup = maxmind.openSync(geolite2.paths.city);
function getIpData(ipAddress) {
  return;
}

async function formatNode(nodeRes) {
  const node = nodeRes.toObject();

  const address = Buffer.from(node.address.host, 'base64').toString('ascii');
  const ipData = lookup.get(address);

  // const reachable = await isPortReachable(18888, { host: address });

  let city = 'Unknown';
  let country = 'Unknown';
  let latitude;
  let longitude;

  if (ipData && ipData.city) {
    city = ipData.city.names.en;
  }
  if (ipData && ipData.country) {
    country = ipData.country.names.en;
  }
  if (ipData && ipData.location) {
    latitude = ipData.location.latitude;
  }
  if (ipData && ipData.location) {
    longitude = ipData.location.longitude;
  }

  return {
    address,
    city,
    country,
    latitude,
    longitude
  };
}

export { formatNode };
