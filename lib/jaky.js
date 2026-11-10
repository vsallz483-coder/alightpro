const BASE = "https://api.jaky.dev/v1/alight-motion";

function getKey() {
  const key = process.env.JAKY_API_KEY || process.env.JAKY_KEY || "";
  if (!key) throw new Error("JAKY_API_KEY belum di-set di environment");
  return key;
}

export async function jakySend(email) {
  const res = await fetch(`${BASE}/send`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-jaky-key": getKey(),
      accept: "application/json",
    },
    body: JSON.stringify({ email }),
    cache: "no-store",
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { status: false, msg: text.slice(0, 300) };
  }
  if (!res.ok && typeof data === "object") data.httpStatus = res.status;
  return data;
}

export async function jakyVerify(email, link) {
  const res = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-jaky-key": getKey(),
      accept: "application/json",
    },
    body: JSON.stringify({ email, link }),
    cache: "no-store",
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { status: false, msg: text.slice(0, 300) };
  }
  if (!res.ok && typeof data === "object") data.httpStatus = res.status;
  return data;
}
