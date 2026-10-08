import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const root = process.cwd();
const startPort = Number(process.env.PORT || 4173);
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml" };

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${server.address()?.port || startPort}`);
    const pathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const file = normalize(join(root, pathname));
    if (!file.startsWith(root)) throw new Error("Invalid path");
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
});

function listen(port) {
  server.once("error", error => {
    if (error.code === "EADDRINUSE") listen(port + 1);
    else throw error;
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`DS總控台 Demo running at http://127.0.0.1:${port}`);
  });
}

listen(startPort);
