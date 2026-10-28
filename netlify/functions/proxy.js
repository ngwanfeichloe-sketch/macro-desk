// netlify/functions/proxy.js
// Fetches a whitelisted URL server-side and returns it with permissive CORS
// headers, so the dashboard can read sources that block browsers directly.

const ALLOW = [
  "stooq.com",
  "query1.finance.yahoo.com",        // Brent, gold, DXY, FX, equities, VIX
  "query2.finance.yahoo.com",
  "eservices.mas.gov.sg",            // MAS SORA / SGS
  "secure.mas.gov.sg",
  "fred.stlouisfed.org",             // HY credit spread
  "api.fiscaldata.treasury.gov",     // US Treasury yields
  "markets.newyorkfed.org",          // SOFR / EFFR
  "api.frankfurter.app",             // FX
  "publicreporting.cftc.gov",        // CFTC positioning
  "news.google.com",                 // headlines (RSS)
  "nfs.faireconomy.media",           // economic calendar (Forex Factory feed)
  "cdn-nfs.faireconomy.media"
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
    const ua = host.endsWith("yahoo.com")
      ? "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
      : "Mozilla/5.0 (macro-desk)";
    const r = await fetch(target, { headers: { "User-Agent": ua, "Accept": "application/json,text/plain,*/*" } });
    const body = await r.text();
    return {
      statusCode: r.status,
      headers: {
        ...CORS,
        "Content-Type": r.headers.get("content-type") || "text/plain",
        "Cache-Control": host.endsWith("faireconomy.media") ? "public, max-age=1800" : "public, max-age=300"   // calendar feed is rate-limited
      },
      body
    };
  } catch (e) {
    return { statusCode: 502, headers: CORS, body: "fetch failed: " + e.message };
  }
};
