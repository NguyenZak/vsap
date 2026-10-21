import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured } from "@/lib/cms/auth";

export default function LoginPage() {
  return <LoginForm configured={adminConfigured()} />;
}
