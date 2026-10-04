import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { cn } from "../../lib/utils";

const options = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

export default function ThemeToggle({ className }) {
  const { theme, setTheme } = useTheme();
  return (
    <div role="radiogroup" aria-label="Theme" className={cn("inline-flex rounded-lg border border-border p-0.5", className)}>
      {options.map(({ value, icon: Icon, label }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={label}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            "rounded-md p-1.5 transition-colors",
            theme === value ? "bg-surface-3 text-fg" : "text-muted hover:text-fg",
          )}>
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
