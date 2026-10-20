import type { Metadata, Viewport } from "next";
import { Manrope, Newsreader } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { personal } from "@/data/personal";
import { siteUrl } from "@/data/site";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Muhammad Zaidaan Ardiyansyah | Portfolio",
    template: "%s | Muhammad Zaidaan Ardiyansyah",
  },
  description:
    "Personal portfolio of Muhammad Zaidaan Ardiyansyah — showcasing projects, skills, and contact information.",
  creator: "Muhammad Zaidaan Ardiyansyah",
  alternates: {
    canonical: "/",
  },
  keywords: ["portfolio", "frontend developer", "React", "Next.js"],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Muhammad Zaidaan Ardiyansyah | Portfolio",
    description:
      "Personal portfolio of Muhammad Zaidaan Ardiyansyah — showcasing projects, skills, and contact information.",
    url: "/",
    siteName: "Muhammad Zaidaan Ardiyansyah — Portfolio",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Muhammad Zaidaan Ardiyansyah — Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Muhammad Zaidaan Ardiyansyah | Portfolio",
    description:
      "Personal portfolio of Muhammad Zaidaan Ardiyansyah — showcasing projects, skills, and contact information.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f5f3ee" },
    { media: "(prefers-color-scheme: dark)", color: "#12151c" },
  ],
};

const themeScript = `
(function () {
  document.documentElement.classList.add("js");
  try {
    var stored = localStorage.getItem("theme");
    var dark = stored
      ? stored === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    var root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  } catch (error) {}
})();
`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  url: siteUrl.toString(),
  email: `mailto:${personal.email}`,
  jobTitle: personal.role,
  sameAs: [personal.github, personal.linkedin, `https://instagram.com/${personal.instagram.replace("@", "")}`],
  knowsAbout: ["Frontend development", "React", "Next.js", "TypeScript", "Web accessibility"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${manrope.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas text-ink">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-full bg-solid px-4 py-2 text-sm font-semibold text-on-solid transition-transform focus:translate-y-0"
        >
          Skip to main content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1 px-2 sm:px-4" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <ScrollReveal />
      </body>
    </html>
  );
}
