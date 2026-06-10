import fs from 'fs/promises';
import { faker } from '@faker-js/faker';

const FILE_PATH = './data/raw-logs.txt';
const TARGET_SIZE = 1 * 1024 *1024 *1024;

const generateTable = fs.createWriteStream(FILE_PATH);

let currentSize = 0;

console.log('Generating data...');
