import { pipeline } from 'stream/promises';
import { createReadStream, createWriteStream } from 'fs';
import { Transform } from 'stream';
import readline from 'readline';

class ErroringTransform extends Transform {
    _transform(chunk, encoding, callback) {
        const lines = chunk.toString().split('\n');
        for (const line of lines) {
            if (line.includes('[ERROR]')) {
                const processedLine = `[FOUND ERROR] ${line.trim()}\n`;
                this.push(processedLine);
            }
        }
        callback();
    }
}

async function analyzeLogs() {
    
}