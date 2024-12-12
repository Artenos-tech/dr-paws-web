import { useState, useEffect } from "react";

export function useCheckVetportDemo() {
  const [isVetportDemo, setIsvetportDemo] = useState<boolean>(false);

  useEffect(() => {
    setIsvetportDemo(process.env.NEXT_PUBLIC_VETPORT_DEMO_DOMAIN === "true");
  }, []);

  return isVetportDemo;
}
