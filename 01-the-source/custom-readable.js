import { Readable } from 'stream';

// A class that streams English alphabet characters one by one with a delay
class AlphabetReadable extends Readable {
    constructor(opitions) {
        super({ ...opitions, hightWaterMark: 16 });
        this.currentCharCode = 65;
    }

    _read(size) {
        console.log(`\nInternal log >>> [_read() called] (System requested size: ${size}B)`);

        if (this.currentCharCode <= 90) {
            const char = String.fromCharCode(this.currentCharCode);

            const hasRoom = this.push(char);
            console.log(`Internal log >>> Pushed "${char}". Buffer has room?: ${hasRoom}`);

            this.currentCharCode++;
        } else {
            console.log('Internal log >>> All data flushed. Pushing null');
            this.push(null);
        }
    }
}


const alphabetStream = new AlphabetReadable();

console.log('Starting stream consumption');

alphabetStream.on('data', (chunk) => [
    console.log(`Received data >>> [on 'data']: ${chunk.toString()}`)
]);

alphabetStream.on('end', () => {
    console.log('All data read')
})