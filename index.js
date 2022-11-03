const fm = require("@jb_fmanager/node-utils");

module.exports = (app, { prefix = "/", errorHandler, maxUploadSize }) => {
  app.addContentTypeParser(
    "multipart/form-data",
    function (request, payload, done) {
      done(null, payload);
    }
  );

  const wrapAsync = async (fn, rep, ...args) => {
    try {
      const pd = await fn(...args);
      return rep.code(200).send(pd || {});
    } catch (error) {
      app.log.error(error);

      if (errorHandler) {
        return errorHandler(error);
      } else {
        rep.code(500).send(error);
      }
    }
  };

  app.get(
    prefix + "/map",
    async ({ query }, rep) => await wrapAsync(fm.map, rep, query.path)
  );

  app.get(
    prefix + "/create_folder",
    async ({ query }, rep) =>
      await wrapAsync(fm.create_folder, rep, query.path, query.name)
  );

  app.get(
    prefix + "/rename",
    async ({ query }, rep) =>
      await wrapAsync(fm.rename, rep, query.oldPath, query.newPath)
  );

  app.post(
    prefix + "/remove",
    async ({ body }, rep) => await wrapAsync(fm.remove, rep, body)
  );

  app.post(
    prefix + "/copy",
    async ({ query, body }, rep) =>
      await wrapAsync(fm.copy, rep, query.target, body)
  );

  app.post(
    prefix + "/move",
    async ({ query, body }, rep) =>
      await wrapAsync(fm.move, rep, query.target, body)
  );

  app.post(prefix + "/upload", async (req, rep) => {
    const uploadLimit = maxUploadSize || req.query.max_size;

    try {
      const pd = await fm.upload(
        req.raw,
        rep.raw,
        req.query.destination,
        uploadLimit
      );

      return rep.code(200).serialize(pd);
    } catch (error) {
      app.log.error(error);

      if (errorHandler) {
        return errorHandler(error);
      } else {
        rep.code(500).send(error);
      }
    }
  });
};
