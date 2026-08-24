import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Innovative IQ | Technology Business Consultancy",
  description: "Innovative IQ helps ambitious businesses use technology, cloud, AI, automation, data and digital solutions to solve problems, scale smarter and drive growth.",
  openGraph: { title: "Innovative IQ | Technology Business Consultancy", description: "Technology, cloud, AI, automation, data and digital solutions for ambitious businesses.", type: "website" },
  twitter: { card: "summary_large_image", title: "Innovative IQ | Technology Business Consultancy" }
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}