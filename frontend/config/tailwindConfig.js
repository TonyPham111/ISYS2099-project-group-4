/*------------config color using tailwindcss ------------*/
export const colorConfig = {
  custom: {
    blue: {
      DEFAULT: "#07A2A5",
    },
    dark: {
      100: "#F4F4F4",
      200: "7E7E7E",
      DEFAULT: "##262626",
    },
  },
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  secondary: {
    DEFAULT: "hsl(var(--secondary))",
    foreground: "hsl(var(--secondary-foreground))",
  },
  destructive: {
    DEFAULT: "hsl(var(--destructive))",
    foreground: "hsl(var(--destructive-foreground))",
  },
  muted: {
    DEFAULT: "hsl(var(--muted))",
    foreground: "hsl(var(--muted-foreground))",
  },
  accent: {
    DEFAULT: "hsl(var(--accent))",
    foreground: "hsl(var(--accent-foreground))",
  },
  popover: {
    DEFAULT: "hsl(var(--popover))",
    foreground: "hsl(var(--popover-foreground))",
  },
  card: {
    DEFAULT: "hsl(var(--card))",
    foreground: "hsl(var(--card-foreground))",
  },
};
/*------------config screen size using tailwindcss ------------*/
export const screenConfig = {
  lg: "1280px",
  // => @media (min-width: 1440px) { ... }
};

/*------------config font using tailwindcss ------------*/
export const fontFamilyConfig = {
  sans: ["Montserrat", "sans-serif"],
};
