import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';

class UnstableTransform extends Transform {
    constructor(options) {
        super(options);
        this.bytesProcessed = 0;
    }

    _transform(chunk, encoding, callback) {
        this.bytesProcessed += chunk.length;
        if (this.bytesProcessed > 10 * 1024 * 1024) {
            return callback(new Error('Too much data processed, and crashed!!'));
        }
        this.push(chunk);
        callback(null, chunk);
    }
}

async function run() {
    console.log('--- Starting Safe Pipeline ---');

    const source = createReadStream('./data/raw-logs.txt');
    const mutator = new UnstableTransform();
    const sink = createWriteStream('./data/broken-logs.txt');

    try {

    } catch (err) {
        console.error(`Pipeline failed: ${err.message}`);
        console.log('---');
        console.log(`Did you close the pipeline properly?: ${source.destroyed}`);
        console.log(`Did you close the writable stream properly?: ${sink.destroyed}`);
        console.log('---');
        console.log('Because of the pipeline(), all of the streams are closed automatically, and preventing resource leaks successfully.');
    }
}

runPipeline();
