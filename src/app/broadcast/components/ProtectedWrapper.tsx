"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedWrapper({ children }: Props) {
  const router = useRouter();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("newsLoggedIn");
    if (!isLoggedIn) {
      router.replace("/broadcast"); // redirect to login page
    }
  }, [router]);

  return <>{children}</>;
}
