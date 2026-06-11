import fs from 'fs';
import { faker } from '@faker-js/faker';

const FILE_PATH = './data/raw-logs.txt';
const TARGET_SIZE = 1 * 1024 *1024 *1024;

const generateTable = fs.createWriteStream(FILE_PATH);

let currentSize = 0;

console.log('Generating data...');

function writeLog() {
    let canWrite = true;

    while (currentSize < TARGET_SIZE && canWrite) {
        const timestamp = faker.date.recent().toISOString();
        const level = faker.helpers.arrayElement(['INFO', 'WARN', 'ERROR', 'DEBUG'])
        const ip = faker.internet.ipv4();
        const message = faker.lorem.sentence();

        const logLine = `[${timestamp}] [${level}] ${ip} - ${message}\n`;
        currentSize += Buffer.byteLength(logLine);

        canWrite = generateTable.write(logLine);
    }

    if (currentSize >= TARGET_SIZE) {
        generateTable.once('drain', writeLog);
    } else {
        generateTable.end();
        console.log(`Finished generating data (${Math.round((currentSize / (1024 * 1024)) * 100) / 100} MB)`)
    }
}

writeLog();