import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useCampaignAuth must be used within an AuthProvider");
  }
  return context;
};
