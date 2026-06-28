import { Transform } from 'stream';

class CensorStream extends Transform {
    constructor(options) {
        super(options);
        this.targetWord = 'ERROR';
    }

    _transform(chunk, encoding, callback) {
        let dataString = chunk.toString();

        if (dataString.includes(this.targetWord)) {
            dataString = dataString.replaceAll(this.targetWord, '[REDACTED]');
        }

        this.push(dataString);

        callback();
    }

    _flush(callback) {
        this.push('\n--- Censor Process Completed ---\n');
        callback();
    }
}

const censor = new CensorStream();

censor.on('data', (chunk) => {
    console.log(`Mutated >>> ${chunk.toString().trim()}`);
});

console.log('--- Transform Stream Test ---');

censor.write('INFO: System started successfully.\n');
censor.write('ERROR: Database connection failed!\n');
censor.write('WARN: Memory usage is high.\n');
censor.write('ERROR: Out of memory.\n');

censor.end();