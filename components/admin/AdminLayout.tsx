import Link from "next/link";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { UsersIcon } from "lucide-react";
import { Inter as FontInter } from "next/font/google";

const inter = FontInter({ subsets: ["latin"], variable: "--font-inter" });

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className={cn(inter.className, "flex min-h-screen bg-neutral-900 text-white")}>
      <aside className="w-56 flex-shrink-0 border-r border-neutral-800 bg-neutral-950 p-4 space-y-2">
        <h2 className="px-2 text-lg font-bold mb-4">BallersPak Admin</h2>
        <NavItem href="/admin" icon={<UsersIcon className="h-4 w-4" />}>Members</NavItem>
        {/* future nav items */}
      </aside>
      <main className="flex-1 overflow-auto bg-neutral-900">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-800 bg-neutral-950/80 px-6 py-3 backdrop-blur-lg">
          <div className="font-semibold">Registered Members</div>
          {/* Placeholder for actions or user menu */}
        </header>
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

interface NavItemProps {
  href: string;
  icon: ReactNode;
  children: ReactNode;
}

function NavItem({ href, icon, children }: NavItemProps) {
  return (
    <Link
      className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-neutral-800"
      href={href}
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
} 