// use top users route to get the top activity, from there get the collections, and then
// The pipeline is users, then requests for each collections

export async function getParasTopUsers() {
  return await (await fetch("https://api-v2-mainnet.paras.id/activities/top-users")).json();
}

export async function getFeaturedCollections() {
  return await (await fetch("https://api-v2-mainnet.paras.id/featured-collections")).json();
}

console.log(await getFeaturedCollections());