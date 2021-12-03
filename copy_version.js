#!/usr/bin/env node

const pkg = require('./package.json');
const fs = require("fs");


const fileContents = "export const VERSION = '" + pkg.version + "';";


fs.writeFile('src/version.ts', fileContents, (err) => {
  if (err) {
    throw err;
  }
});
