// 認証チェックは middleware で行うため、ここでは不要
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

