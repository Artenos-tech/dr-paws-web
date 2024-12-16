/**
 * Wraps all authenticated routes.
 */

"use client"

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUserContext } from "@/context/UserContext";
import Loader from "@/components/ui/Loader";

export default function UserLayout(props: { children: React.ReactNode }) {
  const { isLoggedIn } = useUserContext();
  const router = useRouter();
  if (isLoggedIn === null) {
    return (
      <>
        <Loader/>
        <span>Logging you in...</span>
      </>
    )
  }
  if (isLoggedIn === false) {
    toast.error("You've been logged out automatically. Please login to continue", {
      duration: 5000,
    });
    router.push("/");
    return
  }
  return props.children
}