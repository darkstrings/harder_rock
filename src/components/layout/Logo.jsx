import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

export default function Logo({ className }) {
  const { isDark } = useTheme();
  return (
    <img
      src={isDark ? "/logo-dark.webp" : "/logo-light.webp"}
      alt="Harder Rock Hotel"
      width="600"
      height="281"
      className={cn("h-auto w-40", className)}
    />
  );
}
