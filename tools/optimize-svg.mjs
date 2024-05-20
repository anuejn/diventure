import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process'

const path = process.argv[2]
const mpix = parseFloat(process.argv[3]) || 2.0 // roughly Full HD

const svg = readFileSync(path, {encoding: 'utf-8'})
const optimizedSvg = svg.replaceAll(/"data:image\/([a-z]+);base64,(.+)"/g, (_, filetype, base64) => {
    const buffer = Buffer.from(base64.replaceAll("&#10;", "\n"), "base64");

    const optimized = execSync(
        `convert - -resize ${Math.round(mpix * 1e6)}@\\> png:- | pngquant - --quality 50-50 --speed 1`,
        { shell: true, input: buffer }
    )
    console.log(`saved ${(1 - (optimized.length / buffer.length)) * 100}% (${buffer.length / 1024 / 1024}Mb -> ${optimized.length / 1024 / 1024}Mb)`)
    return `"data:image/png;base64,${optimized.toString('base64')}"`;
});

writeFileSync(path, optimizedSvg);
