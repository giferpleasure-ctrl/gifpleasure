import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Проверяем, идёт ли запрос к админке
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute) {
    // Получаем заголовок авторизации
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      // Запрашиваем логин и пароль
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Admin Area"' },
      });
    }

    // Декодируем base64 логин:пароль
    const base64 = authHeader.split(" ")[1];
    const [user, pass] = Buffer.from(base64, "base64").toString().split(":");

    // Проверяем логин и пароль
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPass = process.env.ADMIN_PASSWORD;

    if (user !== adminUser || pass !== adminPass) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
  }

  return NextResponse.next();
}

// Указываем, для каких путей запускать middleware (только для админки)
export const config = {
  matcher: "/admin/:path*",
};
