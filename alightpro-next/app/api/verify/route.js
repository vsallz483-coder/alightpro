import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = "https://anita-studio.netlify.app/.netlify/functions/amprem";

async function post(action, body) {
  const { data } = await axios.post(
    API_URL,
    { action, ...body },
    { headers: { "Content-Type": "application/json" }, timeout: 60000 }
  );
  return data;
}

export async function POST(request) {
  try {
    const { email, link } = await request.json();
    if (!email || !link) {
      return NextResponse.json(
        { success: false, msg: "Email and link are required" },
        { status: 400 }
      );
    }

    const verification = await post("verify-account", { email, rawLink: link });
    if (!verification.success) {
      return NextResponse.json(
        { success: false, msg: verification.message || "Verification failed" },
        { status: 400 }
      );
    }

    const idToken = verification.idToken || verification.profile?.idToken;
    if (!idToken) {
      return NextResponse.json(
        { success: false, msg: "idToken not found from verification result" },
        { status: 400 }
      );
    }

    const premium = await post("apply-premium", { email, idToken });
    if (!premium.success) {
      return NextResponse.json(
        { success: false, msg: premium.message || "Failed to apply premium" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      msg: premium.message || "Pro activation successful!",
      data: premium,
    });
  } catch (err) {
    const msg =
      err.response?.data?.message ||
      err.response?.data?.msg ||
      err.message ||
      "Something went wrong";
    return NextResponse.json({ success: false, msg }, { status: 500 });
  }
}
