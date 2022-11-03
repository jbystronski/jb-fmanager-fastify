<p><a href="https://github.com/jbystronski/jb-fmanager-react">@jb_fmanager/react</a> setup for fastify</p>
<h4>Installation</h4>

<p>Include the routes and the utility package <a href="https://github.com/jbystronski/jb-fmanager-node-utils">@jb_fmanager/node-utils</a></p>

```bash

npm i @jb_fmanager/fastify @jb_fmanager/node-utils

yarn add @jb_fmanager/fastify @jb_fmanager/node-utils

```

<h4>Options</h4>

<p style="font-weight: bold;">prefix</p>
<p>Must match the namespace provided to the manager, default is "api/fm".</p>
<p style="font-weight: bold;">maxUploadSize</p><p>If you want to override the value provided to the manager. Accepts bytes, ie 5242880 (5mb).</p>

<h4>Example use</h5>

```js
const fastify = require("fastify")({ logger: true });
const path = require("path");

// including the package

require("@jb_fmanager/fastify")(fastify, { prefix: "/api/fm" });

// registering static files

fastify.register((instance, opts, next) => {
  instance.register(require("@fastify/static"), {
    root: path.join(__dirname, "public"),
    prefix: "/media",
  });
  next();
});

// including cors plugin

fastify.register(require("@fastify/cors"), {});

const start = async () => {
  try {
    await fastify.listen({ port: 4000 });
  } catch (error) {
    fastify.log.error(error);
  }
};

start();
```
