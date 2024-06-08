import { readFileSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process'

const path = process.argv[2]
const mpix = parseFloat(process.argv[3]) || 2.0 // roughly Full HD

const svg = readFileSync(path, { encoding: 'utf-8' })

const inkscapeOutput = execSync(
    `inkscape -S ${path} 2> /dev/null`,
    { shell: true }
)
let baseName = undefined;
const objectSizes = Object.fromEntries(inkscapeOutput.toString().split("\n").filter(x => x).map(line => {
    const [name, x, y, width, height] = line.split(",");
    if (!baseName) baseName = name;
    return [name, {x, y, width, height}]
}));

for (const size of Object.values(objectSizes)) {
    size.fraction = (size.width / objectSizes[baseName].width) * (size.height / objectSizes[baseName].height);
}

const optimizedSvg = svg.replaceAll(/\<image.*?\>/gs, (imageTag) => {
    const id = imageTag.match(/id="(.*?)"/)[1];
    const sizeMpix = mpix * objectSizes[id].fraction;
    console.log(id, sizeMpix)
    return imageTag.replaceAll(/"data:image\/([a-z]+);base64,(.+)"/g, (_, filetype, base64) => {
        const buffer = Buffer.from(base64.replaceAll("&#10;", "\n"), "base64");
    
        try {
            const optimized = execSync(
                `convert - -resize ${Math.round(sizeMpix * 1e6)}@\\> png:- | pngquant - --quality 50-50 --speed 1`,
                { shell: true, input: buffer }
            )
            const saved_percent = (1 - (optimized.length / buffer.length)) * 100;
            if (saved_percent > 20) {
                console.log(`saved ${saved_percent}% (${buffer.length / 1024 / 1024}Mb -> ${optimized.length / 1024 / 1024}Mb)`)
                return `"data:image/png;base64,${optimized.toString('base64')}"`;
            } else {
                console.log(`would save less than 20% (${saved_percent}%) writing unoptimized version`)
                return `"data:image/png;base64,${buffer.toString('base64')}"`;
            }
        } catch (err) {
            console.log("shell output invocation failed")
            console.log(err.stderr.toString())
            return `"data:image/png;base64,${buffer.toString('base64')}"`;
        }
    
    })
});

writeFileSync(path, optimizedSvg);
