import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';

class UnstableTransform extends Transform {
    constructor(options) {
        super(options);
        this.bytesProcessed = 0;
    }
}