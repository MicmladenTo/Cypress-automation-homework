const cypress = require('cypress');
const fse = require('fs-extra');
const {merge} = require('mochawesome-merge');
const generate = require('mochawesome-report-generator');

async function runTests() {
    await fse.remove('mochawesome-report');  //ocistimo fajl sa prethodnim riportovima
    const {totalFailed} = await cypress.run(); //pokrecemo testove koji se cuvaju u objektu totalFailed
    const jsonReport = await merge(); // komanda da nam spoi sve reportove (svih testova, ne samo poslednjeg)
    await generate.create(jsonReport); // generisi mi report - generise html report koji moze da se pokaze
    process.exit(totalFailed); // kad zavrsis izadji iz procesa
}

runTests();