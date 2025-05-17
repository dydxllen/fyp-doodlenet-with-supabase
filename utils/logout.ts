import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();
  return () => {
    localStorage.removeItem("student");
    router.replace("/sign-in");
  };
}
