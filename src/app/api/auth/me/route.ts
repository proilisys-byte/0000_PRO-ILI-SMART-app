import { NextRequest, NextResponse } from "next/server";
import { handleRouteError, AppError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get("mock-user");
    if (!cookie?.value) {
      throw new AppError("AUTH_401_UNAUTHORIZED_ACCESS", "로그인이 필요합니다.", 401);
    }
    const user = JSON.parse(cookie.value);
    return NextResponse.json({ success: true, data: { user } });
  } catch (error) {
    return handleRouteError(error);
  }
}
