import "./globals.css";

export const metadata = {
  title: "AlightPro — Alight Motion Verifier",
  description: "Activate Alight Motion Pro with a clean Liquid Glass interface.",
  themeColor: "#9dcaff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
