export default function ChildMenu({ children }: { children: React.ReactNode }) {
  return (
    <nav>
      <ul className="font-header-setting flex flex-row items-center justify-center gap-x-6 text-sm tracking-tight">
        {children}
      </ul>
    </nav>
  );
}
