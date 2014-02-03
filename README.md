# exceptional-promises

Example of how to handle exceptions together with promises.

## Prerequisites

* Node.js 0.10.x, install via [nvm](https://github.com/creationix/nvm#readme)
* `npm install`

## How to run

    ./exceptional-promises.js

## What's going on?

Follow along in the code: Click each branch link below.

### Can't bar

At [branch cant-bar](https://github.com/hugojosefson/exceptional-promises/blob/cant-bar/exceptional-promises.js), the
call `bar()` happens inside a handler function, which is supplied to `then` and called by Q. According to the
[Q documentation on Propagation](https://github.com/kriskowal/q#propagation):

> If you throw an exception in a handler, `outputPromise` will get rejected.

That's why the Error thrown inside `bar` is caught by Q and handled as a rejection.

### Can't foo

However, at
[branch cant-foo](https://github.com/hugojosefson/exceptional-promises/blob/cant-foo/exceptional-promises.js)
([diff](https://github.com/hugojosefson/exceptional-promises/compare/cant-bar...cant-foo)), the call `foo()` happens
directly in the `init()` function's body. There is nothing to catch the Error thrown from inside `foo`. That's why it's
seen as an unhandled exception.

### Refactor

On [branch refactor](https://github.com/hugojosefson/exceptional-promises/blob/refactor/exceptional-promises.js)
([diff](https://github.com/hugojosefson/exceptional-promises/compare/cant-foo...refactor)), things are refactored to
show more clearly what's going on.

Each previously chained promise is now explicitly saved in a variable, and instead of single-argument `.then(fn)` or
`.fail(fn)`, every promise is _thenned_ with two handler functions to catch every outcome, like so:

    .then(successFn, errorFn)

The effect is the same. The Error thrown in `foo` is still not caught.

### Wrap

Finally, on [branch wrap](https://github.com/hugojosefson/exceptional-promises/blob/wrap/exceptional-promises.js)
([diff](https://github.com/hugojosefson/exceptional-promises/compare/refactor...wrap)), the call to `foo` has been
wrapped to catch anything thrown before the function returns. Any outcome of the function call is instead turned into
a promise, which is guaranteed not to throw anything, but rather be resolved or rejected.

When the exception from `foo` is caught and used for rejecting the wrapper promise, that rejection continues through the
promise chain, causing the rest of the error handlers to be called with the same rejection: _Can't foo_.