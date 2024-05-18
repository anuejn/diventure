import { defineConfig, Plugin } from 'vite'
import mime from 'mime';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

// extract base64 embedded images in svgs into their own files for better performance
function svgBase64ExtractPlugin(): Plugin {

  function transformSvg(data: string, emitFile: (path: string, contents: Buffer) => void) {
    return data.replaceAll(/"data:image\/([a-z]+);base64,(.+)"/g, (_, filetype, base64) => {
      const buffer = Buffer.from(base64.replaceAll("&#10;", "\n"), "base64");
      const hash = crypto.createHash('sha256').update(buffer).digest("hex")
      const filename = `svg-img-${hash}.${filetype}`;
      emitFile(filename, buffer)
      return `"${filename}"`;
    });
  }

  return {
    name: 'svg-base64-extract', // required, will show up in warnings and errors
    configureServer(server) {
      const files: Record<string, Buffer> = {};

      server.middlewares.use((req, res, next) => {
        if (req.originalUrl?.endsWith(".svg")) {
          let data;
          try {
            data = fs.readFileSync(path.join(__dirname, req.originalUrl), 'utf8');
          } catch {
            next();
            return;
          }
          const transformed = transformSvg(data, (path, contents) => {
            files[`/${path}`] = contents
          })
          res.setHeader('Content-Type', "image/svg+xml");
          res.write(transformed);
          res.end();
        } else if (req.originalUrl && (req.originalUrl in files)) {
          res.setHeader('Content-Type', mime.getType(req.originalUrl) || "text/plain");
          res.write(files[req.originalUrl]);
          res.end();
        } else {
          next();
        }
      });
    },
    generateBundle(_, bundle) {
      Object.entries(bundle).forEach(([k, v]) => {
        if (k.endsWith(".svg") && v.type == 'asset') {
          v.source = Buffer.from(transformSvg(v.source.toString(), (fileName, source) => {
            this.emitFile({
              type: 'asset',
              fileName,
              source
            })
          }))
        }
      })
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgBase64ExtractPlugin()],
})
