import { readFileSync } from "fs";
import { createPacResolver } from "pac-resolver";

// calling the readFileSync() method to read 'input.txt' file
// const pac = readFileSync("./tests/localproxy.pac", { encoding: "utf8", flag: "r" });
const pac = readFileSync("./tests/localproxy.pac", { encoding: "utf8" });
// display the file data
// console.log("[localproxy]: pac:", pac);

const FindProxyForURL = createPacResolver(pac);

// const res = await FindProxyForURL('http://foo.com/');
// console.log(res);
// "DIRECT"

console.log("[localproxy]: Initializing...");
// print process.argv
process.argv.forEach(function (val, index, array) {
  console.log("[localproxy]:", index, ":", val);
});
// const url = process.argv[2];
// const host = process.argv[3];
// const res = await FindProxyForURL(url);
// console.log("[localproxy]: getProxyForUrl:", res);
console.log("[localproxy]: End.");
