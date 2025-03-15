import { useState, useEffect } from "react";

export function useMarketingFeature() {
  const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);

  useEffect(() => {
    setIsFeatureEnabled(
      process.env.NEXT_PUBLIC_MARKETING_FEATURE_ENABLED === "true",
    );
  }, []);

  return isFeatureEnabled;
}
