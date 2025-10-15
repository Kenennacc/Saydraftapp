export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "SayDraft",
  description: "The Future of Contracts Isn't Written — It's Spoken. Create, negotiate, and sign contracts with your voice.",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "How It Works",
      href: "#how-it-works",
    },
    {
      label: "Pricing",
      href: "#pricing",
    },
    {
      label: "About",
      href: "/about",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Admin",
      href: "/admin",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/saydraft/saydraft",
    twitter: "https://twitter.com/saydraft",
    docs: "https://docs.saydraft.com",
    discord: "https://discord.gg/saydraft",
    sponsor: "https://patreon.com/saydraft",
  },
};
