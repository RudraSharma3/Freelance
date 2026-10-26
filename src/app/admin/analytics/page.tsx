import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/auth";
import LoginForm from "@/components/admin/LoginForm";
import Dashboard from "@/components/admin/Dashboard";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Analytics",
};

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const authed = await isAdminAuthenticated();
  return authed ? <Dashboard /> : <LoginForm />;
}
