#! /usr/bin/env node
const fs = require("fs");

// Remove token file
const token_file = `${process.cwd()}/node_modules/figma-styles-to-ts/token.json`;
if (fs.existsSync(token_file)) {
	fs.unlinkSync(token_file);
}
