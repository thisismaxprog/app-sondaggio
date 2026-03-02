export const dynamic = "force-dynamic";

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#b8c4b8" }}>
      {children}
    </div>
  );
}
