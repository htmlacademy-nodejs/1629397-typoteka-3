'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (request, response) => response.send(`/my`));
myRouter.get(`/comments`, (request, response) => response.send(`/my/comments`));
myRouter.get(`/categories`, (request, response) => response.send(`/my/categories`));

module.exports = myRouter;
