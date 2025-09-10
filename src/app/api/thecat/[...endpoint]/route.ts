// src/app/api/thecat/[...endpoint]/route.ts
import { NextRequest } from "next/server";

const API_KEY = process.env.CAT_API_KEY;
const API_URL = process.env.CAT_API_URL;

async function proxyRequest(req: NextRequest, method: string, endpoint: string[]) {
  try {
    const endpointPath = endpoint.join("/");
    const targetUrl = `${API_URL}/${endpointPath}${req.nextUrl.search}`;

    const init: RequestInit = {
      method,
      headers: {
        "x-api-key": API_KEY || "",
        "Content-Type": req.headers.get("content-type") || "application/json",
      },
      cache: "no-store",
    };

    if (method !== "GET" && method !== "HEAD") {
      init.body = await req.text();
    }

    const res = await fetch(targetUrl, init);

    let body: unknown;
    let isJson = true;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
      isJson = false;
    }

    const headers: HeadersInit = {
      "Content-Type": isJson ? "application/json" : "text/plain",
    };

    const paginationCount = res.headers.get("pagination-count");
    if (paginationCount) {
      headers["pagination-count"] = paginationCount;
    }

    return new Response(isJson ? JSON.stringify(body) : (body as string), {
      status: res.status,
      headers,
    });
  } catch (err) {
    console.error(`❌ Proxy error [${method}]`, err);
    return new Response(
      JSON.stringify({ error: "Proxy request failed", details: (err as Error).message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET(req: NextRequest, context: { params: Promise<{ endpoint: string[] }> }) {
  const { endpoint } = await context.params;
  return proxyRequest(req, "GET", endpoint);
}

export async function POST(req: NextRequest, context: { params: Promise<{ endpoint: string[] }> }) {
  const { endpoint } = await context.params;
  return proxyRequest(req, "POST", endpoint);
}

export async function DELETE(req: NextRequest, context: { params: Promise<{ endpoint: string[] }> }) {
  const { endpoint } = await context.params;
  return proxyRequest(req, "DELETE", endpoint);
}

export async function PUT(req: NextRequest, context: { params: Promise<{ endpoint: string[] }> }) {
  const { endpoint } = await context.params;
  return proxyRequest(req, "PUT", endpoint);
}
