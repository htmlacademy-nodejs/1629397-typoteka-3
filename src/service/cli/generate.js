'use strict';

const fs = require(`fs`).promises;
const dayjs = require(`dayjs`);
const chalk = require(`chalk`);
const {
  getRandomInt,
  shuffle
} = require(`../../utils/utils`);
const {ExitCode} = require(`../../utils/constants`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;

const restricts = {
  anounce: 5,
  mocks: 1000,
};

const readData = async (filepath) => {
  try {
    const data = await fs.readFile(filepath, `utf8`);
    return data.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateDate = () => {
  const endDate = dayjs();
  const startDate = dayjs().subtract(3, `month`);
  const randomDate = dayjs(+startDate + Math.random() * (endDate - startDate));

  return randomDate.format(`YYYY-MM-DD hh:mm:ss`);
};

const generateArticles = (count, sentences, titles, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    announce: shuffle(sentences).slice(0, getRandomInt(1, restricts.anounce)).join(` `),
    fullText: shuffle(sentences).slice(0, getRandomInt(1, sentences.length - 1)).join(` `),
    createdDate: generateDate(),
    category: shuffle(categories).slice(0, getRandomInt(1, categories.length - 1)),
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const [count] = args;
    const countOffer = Number.parseInt(count, 10) || DEFAULT_COUNT;

    if (countOffer > restricts.mocks) {
      console.error(chalk.red(`Не больше ${restricts.mocks} публикаций `));
      process.exit(ExitCode.error);
    }

    const sentences = await readData(FILE_SENTENCES_PATH);
    const titles = await readData(FILE_TITLES_PATH);
    const categories = await readData(FILE_CATEGORIES_PATH);
    const content = JSON.stringify(generateArticles(countOffer, sentences, titles, categories));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.log(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.error);
    }
  }
};
