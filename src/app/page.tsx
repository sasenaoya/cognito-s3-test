"use client"

import { redirect } from "next/navigation";
import HomeContent from "./HomeContent";
import { useTokenStore } from "@/stores/useTokenStore";

export default function Home() {
  const token = useTokenStore((state) => state.token);

  if (token) {
    return <HomeContent />;
  } else {
    redirect("/login");
  }
}
