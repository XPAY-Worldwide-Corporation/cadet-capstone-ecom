import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../state/authStore";

interface RouteProps {
  children: React.ReactNode;
  isProtected: boolean;
}

export default function RouteHandler({ children, isProtected }: RouteProps) {
  const router = useRouter();
  const { accessToken, user } = useAuthStore();

  useEffect(() => {
    if (isProtected && !accessToken) {
      router.push("/login");
      return;
    }

    if (user && user.role.roleName === "Merchant") {
      if (!isProtected) {
        router.push("/dashboard/merchant");
      }
    }

    if (user && user.role.roleName === "Customer") {
      if (!isProtected) {
        router.push("/dashboard/customer");
      }
    }
  }, [accessToken, user, router, isProtected]);

  if (isProtected && !accessToken) {
    return null;
  }

  return <>{children}</>;
}
