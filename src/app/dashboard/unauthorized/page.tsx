import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-semibold">접근 권한 없음</h1>
      <p className="text-muted-foreground">
        이 페이지는 관리자(Admin) 권한을 가진 사용자만 접근할 수 있습니다.
      </p>
      <Link
        href="/dashboard"
        className="rounded-md border border-foreground/20 px-4 py-2 transition hover:bg-foreground/5"
      >
        대시보드로 돌아가기
      </Link>
    </div>
  );
}
