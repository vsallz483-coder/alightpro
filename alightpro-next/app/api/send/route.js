import axios from "axios";
import { NextResponse } from "next/server";

const API_URL = "https://anita-studio.netlify.app/.netlify/functions/amprem";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json(
        { success: false, msg: "Email is required" },
        { status: 400 }
      );
    }

    const { data } = await axios.post(
      API_URL,
      { action: "send-magiclink", email },
      { headers: { "Content-Type": "application/json" }, timeout: 60000 }
    );

    if (!data.success) {
      return NextResponse.json(
        { success: false, msg: data.message || "Failed to send magic link" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      msg: data.data?.message || data.message || "Login link sent to your email.",
      quota: data.quota || null,
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
