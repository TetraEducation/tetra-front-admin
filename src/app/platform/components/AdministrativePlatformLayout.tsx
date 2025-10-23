
export function AdministrativePlatformLayout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
