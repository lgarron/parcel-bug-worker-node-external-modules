This repo contains three similar versions of a code snippet from [the `comlink` library](https://github.com/GoogleChromeLabs/comlink#node), specifically the [`node` example](https://github.com/GoogleChromeLabs/comlink/tree/master/docs/examples/06-node-example).

This example seems to have two major issues when used in a fairly straightforward manner.

Note that my ultimate goal is to publish a single build of a library that transparently creates a worker regardless of whether it's run in `node` or the browser, so any `node`-specific fixes will not work.

# Original code

This is what we are trying to mimic in source code to be processed by Parcel:

    > cd node_modules/comlink/docs/examples/06-node-example
    > node main.mjs

    4

# Issue 1: External modules

    > cd issue1
    > npm install
    > npx parcel build src/main.ts

    🚨 Build failed.
    @parcel/packager-js: External modules are not supported when building for browser
    /Users/lgarron/parcel-bug-worker-node-external-modules/issue1/src/worker.ts:1:1
    > 1 | import * as Comlink from "comlink";
    >   | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
      2 | import nodeEndpoint from "comlink/dist/esm/node-adapter";
      3 | import { parentPort } from "worker_threads";

Note that `package.json` sets `"context": "node"` (not `"browser"`).

# Issue 2: Origin not found

This differs from the code for issue 1 as follows:

- `"includeNodeModules": true` is set for the `node` target in `package.json`. (This is not appropriate for library builds, but it allows us to demonstrate the second issue.)

Output:

    > cd issue2
    > npm install
    > npx parcel build src/main.ts
    > node dist/index.js
    
    (node:17465) UnhandledPromiseRejectionWarning: Error: Origin not found
        at Object.L [as getOrigin] (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:3467)
        at k (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:3708)
        at P (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:3873)
        at /Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:10995
        at s (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:4954)
        at Generator._invoke (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:4707)
        at Generator.forEach.t.<computed> [as next] (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:5311)
        at G (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:10554)
        at i (/Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:10757)
        at /Users/lgarron/parcel-bug-worker-node-external-modules/issue2/dist/index.js:1:10816
    (Use `node --trace-warnings ...` to show where the warning was created)
    (node:17465) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
    (node:17465) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.

Note that building with `npx parcel build --public-url . src/main.ts` produces the same result.
