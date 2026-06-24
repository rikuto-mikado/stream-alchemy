import { Writable } from 'stream';

class SlowBlackhole extends Writable {
    constructor(options) {
        super({ ...options, highWaterMark: 16 });
    }

    _write(chunk, encoding, callback) {
        console.log(`[Blackhole] We received ${chunk.length} data: ${chunk.toString().trim()}`);

        setTimeout(() => {
            console.log(`[Blackhole] Processing completed`);

            callback();
        }, 500);
    }
}

const blackhole = new SlowBlackhole();
let i = 1;

console.log('--- We will begin importing data at high speed ---');

function pump() {
    let canWrite = true;

    while (i <= 20 && canWrite) {
        const chunk = `Data-${i}`;
        canWrite = blackhole.write(chunk);
        console.log(`Sender >>> Sending "${chunk.trim()}". Buffer has capacity?: ${canWrite}`);
        i++;
    }

    if (i <= 20) {
        console.log(`Sender >>> !!! Backpressure detected !!! Receiver is congested. Pausing`);

        blackhole.once('drain', () => {
            console.log(`Sender >>> !! drain event received !! Buffer cleared. Resuming transmission.`);
            pump();
        });
    } else {
        console.log(`Sender >>> Completed all data transmission requests.`);
        blackhole.end();
    }
}

pump();