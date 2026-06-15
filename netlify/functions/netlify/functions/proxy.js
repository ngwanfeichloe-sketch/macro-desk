// netlify/functions/proxy.js
const ALLOW = [
  "stooq.com",
  "eservices.mas.gov.sg",
  "secure.mas.gov.sg",
  "fred.stlouisfed.org",
  "api.fiscaldata.treasury.gov",
  "markets.newyorkfed.org",
  "api.frankfurter.app",
  "publicreporting.cftc.gov",
  "news.google.com"
];

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "*"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: CORS, body: "" };

  const target = event.queryStringParameters && event.queryStringParameters.url;
  if (!target) return { statusCode: 400, headers: CORS, body: "missing ?url=" };

  let host;
  try { host = new URL(target).hostname; }
  catch (e) { return { statusCode: 400, headers: CORS, body: "bad url" }; }

  const ok = ALLOW.some(d => host === d || host.endsWith("." + d));
  if (!ok) return { statusCode: 403, headers: CORS, body: "domain not allowed: " + host };

  try {
    const r = await fetch(target, { headers: { "User-Agent": "Mozilla/5.0 (macro-desk)" } });
    const body = await r.text();
    return {
      statusCode: r.status,
      headers: {
        ...CORS,
        "Content-Type": r.headers.get("content-type") || "text/plain",
        "Cache-Control": "public, max-age=300"
      },
      body
    };
  } catch (e) {
    return { statusCode: 502, headers: CORS, body: "fetch failed: " + e.message };
  }
};
