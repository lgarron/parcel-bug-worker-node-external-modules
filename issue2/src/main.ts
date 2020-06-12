import "regenerator-runtime/runtime"
import * as Comlink from "comlink";
// Ideally we could import this as `comlink/dist/esm/node-adapter` and automatically get the types, but this is tricky to work around, and not super specific to the issues documented in this repo.
// @ts-ignore
import nodeEndpoint from "comlink/dist/esm/node-adapter.mjs";
import { API } from "./worker";
import { Worker } from "worker_threads";

async function init() {
  const worker = new Worker("./worker.ts");

  const api = Comlink.wrap<API>(nodeEndpoint(worker));
  console.log(await api.doMath());
}
init();
