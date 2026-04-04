import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "./globals.css";
import ThemeToggle from "./theme-toggle";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DiyaVerse - Portfolio & Study Space of Tasfia Rashid Diya",
  description:
    "A modern portfolio and student planning hub for Tasfia Rashid Diya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${manrope.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="sky-scene" aria-hidden="true">
          <span className="sky-galaxy sky-galaxy-a" />
          <span className="sky-galaxy sky-galaxy-b" />

          <span className="sky-sun" />
          <span className="sky-cloud sky-cloud-a" />
          <span className="sky-cloud sky-cloud-b" />
          <span className="sky-cloud sky-cloud-c" />

          <span className="sky-moon" />
          <span className="sky-star sky-star-a" />
          <span className="sky-star sky-star-b" />
          <span className="sky-star sky-star-c" />
          <span className="sky-star sky-star-d" />
          <span className="sky-star sky-star-e" />
          <span className="sky-star sky-star-f" />
          <span className="sky-star sky-star-g" />
          <span className="sky-star sky-star-h" />
        </div>

        <div className="relative z-10 flex min-h-full flex-col">
          {children}
          <ThemeToggle />
        </div>
      </body>
    </html>
  );
}
