/**
 * Wraps all authenticated routes.
 */

"use client"

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { useUserContext } from "@/context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";

export default function UserLayout(props: { children: React.ReactNode }) {
  const { isLoggedIn } = useUserContext();
  const router = useRouter();
  if (isLoggedIn === null) {
    return (
      <div className="flex justify-center items-center my-20">
        <ClipLoader color="#33495f" />
      </div>
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