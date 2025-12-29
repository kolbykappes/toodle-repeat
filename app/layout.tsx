export const metadata = {
  title: 'Toodledo Recurring Tasks',
  description: 'Manage recurring tasks for Toodledo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
