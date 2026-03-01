import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 5173);
const UPSTREAM_ORIGIN =
  process.env.UPSTREAM_ORIGIN ||
  "http://apptorney-prod-service-alb-1628366448.eu-west-2.elb.amazonaws.com";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function send(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

async function readBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function proxyRequest(req, res, pathname, search) {
  const upstreamUrl = `${UPSTREAM_ORIGIN}${pathname}${search || ""}`;
  const body = ["GET", "HEAD"].includes(req.method || "GET")
    ? undefined
    : await readBody(req);

  const headers = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) {
      continue;
    }
    if (
      key.toLowerCase() === "host" ||
      key.toLowerCase() === "origin" ||
      key.toLowerCase() === "referer" ||
      key.toLowerCase() === "content-length"
    ) {
      continue;
    }
    headers[key] = value;
  }

  try {
    const upstream = await fetch(upstreamUrl, {
      method: req.method,
      headers,
      body,
      redirect: "manual"
    });

    const responseHeaders = {};
    upstream.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower === "content-encoding" || lower === "transfer-encoding" || lower === "connection") {
        return;
      }
      responseHeaders[key] = value;
    });

    res.writeHead(upstream.status, responseHeaders);

    if (!upstream.body) {
      res.end();
      return;
    }

    Readable.fromWeb(upstream.body).pipe(res);
  } catch (error) {
    send(
      res,
      502,
      JSON.stringify({
        error: "proxy_error",
        message: error?.message || "Failed to reach upstream API"
      }),
      { "Content-Type": "application/json; charset=utf-8" }
    );
  }
}

async function serveStatic(req, res, pathname) {
  let safePath = pathname === "/" ? "/index.html" : pathname;
  safePath = safePath.replace(/\.\./g, "");
  const filePath = path.join(__dirname, safePath);

  try {
    const stat = await fs.stat(filePath);
    if (stat.isDirectory()) {
      send(res, 404, "Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const content = await fs.readFile(filePath);
    send(res, 200, content, { "Content-Type": contentType });
  } catch {
    send(res, 404, "Not Found");
  }
}

async function requestHandler(req, res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/health") {
    send(res, 200, "ok", { "Content-Type": "text/plain; charset=utf-8" });
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    await proxyRequest(req, res, url.pathname, url.search);
    return;
  }

  await serveStatic(req, res, url.pathname);
}

function createServer() {
  return http.createServer((req, res) => {
    requestHandler(req, res).catch((error) => {
      send(
        res,
        500,
        JSON.stringify({
          error: "server_error",
          message: error?.message || "Unexpected server error"
        }),
        { "Content-Type": "application/json; charset=utf-8" }
      );
    });
  });
}

function startServer(port, attemptsRemaining = 20) {
  const server = createServer();

  server.on("error", (error) => {
    if (error?.code === "EADDRINUSE" && !process.env.PORT && attemptsRemaining > 0) {
      const fallbackPort = port + 1;
      console.warn(`Port ${port} is busy. Trying http://localhost:${fallbackPort} ...`);
      startServer(fallbackPort, attemptsRemaining - 1);
      return;
    }
    console.error(error);
    process.exit(1);
  });

  server.listen(port, () => {
    const activePort = server.address()?.port || port;
    console.log(`Web app running on http://localhost:${activePort}`);
    console.log(`Proxying API requests to ${UPSTREAM_ORIGIN}`);
  });
}

startServer(PORT, 20);
