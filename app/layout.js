import "./globals.css";

export const metadata = {
  title: "AlightPro — Aktivasi Alight Motion",
  description: "Aktivasi premium Alight Motion lebih cepat",
  themeColor: "#dce8f7",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="https://i.imgur.com/jzNGlRj.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
