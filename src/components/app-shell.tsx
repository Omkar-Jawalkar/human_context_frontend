"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

const tenantNavItems = [
  { href: "/users", label: "Users" },
  { href: "/chats", label: "Chats" },
  { href: "/imports", label: "Imports" },
];

const adminNavItems = [{ href: "/organizations", label: "Organizations" }];

function isNavActive(pathname: string, href: string): boolean {
  if (pathname === href) {
    return true;
  }

  if (href === "/users" && pathname.endsWith("/query")) {
    return true;
  }

  if (href === "/chats" && pathname.startsWith("/chats")) {
    return true;
  }

  return false;
}

function isChatRoute(pathname: string): boolean {
  return pathname === "/chats" || pathname.startsWith("/chats/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const hasOrganization = Boolean(user?.organization_id);
  const isSuperAdmin = Boolean(user?.super_admin);
  const chatRoute = isChatRoute(pathname);

  const navItems = isSuperAdmin
    ? adminNavItems
    : hasOrganization
      ? tenantNavItems
      : [];

  if (chatRoute) {
    return <div className="h-dvh overflow-hidden">{children}</div>;
  }

  return (
    <div className="flex min-h-full flex-col bg-background">
      <header className="shrink-0 border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="font-heading text-base font-bold tracking-tight"
            >
              Human Context
            </Link>
            {navItems.length > 0 ? (
              <nav className="flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted",
                      isNavActive(pathname, item.href) && "bg-muted font-medium",
                    )}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Separator orientation="vertical" className="hidden h-8 sm:block" />
              <Button variant="outline" size="sm" onClick={logout}>
                Sign out
              </Button>
            </div>
          ) : null}
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">
        {children}
      </main>
    </div>
  );
}
