import * as Comlink from "comlink";
// Ideally we could import this as `comlink/dist/esm/node-adapter` and automatically get the types, but this is tricky to work around, and not super specific to the issues documented in this repo.
// @ts-ignore
import nodeEndpoint from "comlink/dist/esm/node-adapter.mjs";
import { parentPort } from "worker_threads";

const api = {
  doMath() {
    return 4;
  },
};
Comlink.expose(api, nodeEndpoint(parentPort));

export interface API {
  doMath(): number;
}
