'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const path = require(`path`);
const chalk = require(`chalk`);
const {
  HttpCode,
} = require(`../../utils/constants`);

const DEFAULT_PORT = 3000;
const FILENAME = path.join(process.cwd(), `mocks.json`);
const NOT_FOUND_MESSAGE_TEXT = `Not found`;

const sendResponse = (response, statusCode, message) => {
  const template = `
    <!Doctype html>
      <html lang="ru">
      <head>
        <title>With love from Node</title>
      </head>
      <body>${message}</body>
    </html>`.trim();

  response.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });

  response.end(template);
};

const router = {
  GET: {
    '/': async (request, response) => {
      try {
        const fileContent = await fs.readFile(FILENAME);
        const mocks = JSON.parse(fileContent);
        const message = mocks.map((post) => `<li>${post.title}</li>`).join(``);

        sendResponse(response, HttpCode.OK, message);
      } catch (err) {
        sendResponse(response, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE_TEXT);
      }
    },
  },
};

const onClientConnect = async (request, response) => {
  const {pathname} = new URL(request.url, `http://${request.headers.host}`);
  const routes = router[request.method];

  const result = pathname && Object.keys(routes).find((str) => {
    const regexp = new RegExp(`^${str}$`);
    const matches = pathname.match(regexp);

    if (!matches) {
      return false;
    }

    routes[str](request, response);

    return true;
  });

  if (!result) {
    sendResponse(response, HttpCode.NOT_FOUND, NOT_FOUND_MESSAGE_TEXT);
  }
};

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    http.createServer(onClientConnect)
      .listen(port)
      .on(`listening`, () => {
        console.info(chalk.green(`Ожиадаю соединений на ${port}`));
      })
      .on(`error`, ({message}) => {
        console.error(chalk.red(`Ошибка при создании сервера: ${message}`));
      });
  }
};
