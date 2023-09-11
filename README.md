# bun-kv-store

> **Archived.** Check out https://github.com/nunogois/bun-kiwi instead for a Bun 1.0 version.

A basic key-value store made with the purpose of checking out Bun.

Includes a very basic custom router.

Could be useful as a simple REST API for a key-value store for testing (e.g. playing around with a front-end when you don't want to bother with setting up something more complicated).

## Routes

- GET /store (returns all public data in the store)
- GET /store/this/is/my/identifier (returns all data in the `this/is/my/identifier` key)
- POST /store (stores/patches public data in the store)
- POST /store/this/is/my/identifier (stores/patches data in the `this/is/my/identifier` key)
- DELETE /store (deletes all public data in the store)
- DELETE /store/this/is/my/identifier (deletes all data in the `this/is/my/identifier` key)

A common use-case could be POSTing a JSON with your app's current state, then retrieving it at anytime by GETting it with the same URL.

You could technically generate a random and secure key to store your data, like `/store/my_app/MY_SECRET_KEY/users`, but...

**Even though you can delete the data you store at anytime, you should not store private or sensitive information in this store, unless you're hosting it yourself and know what you're doing.**

**Data in this store is solely the responsibility of its owners and can be lost at anytime.**

## Authentication

If you would like to enable authentication, you can create a `tokens.json` file at the root of the project with an array of tokens to be used. You will need to send one of them as a Bearer token and each of them will use its own store.
