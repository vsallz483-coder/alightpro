import { jakyVerify } from "../../../lib/jaky";

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const email = String(body.email || "").trim();
    const link = String(body.link || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json(
        { status: false, msg: "Email tidak valid" },
        { status: 400 }
      );
    }
    if (!/^https?:\/\//i.test(link)) {
      return Response.json(
        { status: false, msg: "Link verifikasi tidak valid" },
        { status: 400 }
      );
    }
    const data = await jakyVerify(email, link);
    const code = data?.httpStatus && data.httpStatus >= 400 ? data.httpStatus : 200;
    return Response.json(data, { status: code >= 400 && code < 600 ? code : 200 });
  } catch (e) {
    return Response.json({ status: false, msg: e.message }, { status: 500 });
  }
}
