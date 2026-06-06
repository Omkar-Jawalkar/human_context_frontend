"use client";

import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileUp,
  MessageSquare,
  Search,
  Shield,
  Users,
} from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

type QuickLink = {
  href: string;
  title: string;
  description: string;
  icon: typeof Users;
  badge?: string;
};

function getQuickLinks(
  isSuperAdmin: boolean,
  hasOrganization: boolean,
): QuickLink[] {
  if (isSuperAdmin) {
    return [
      {
        href: "/organizations",
        title: "Organizations",
        description:
          "Create and manage customer workspaces, members, and access.",
        icon: Building2,
        badge: "Admin",
      },
    ];
  }

  if (!hasOrganization) {
    return [
      {
        href: "/join-organization",
        title: "Join a workspace",
        description:
          "Accept an invite or pick an organization before you can import or query.",
        icon: Building2,
      },
    ];
  }

  return [
    {
      href: "/users",
      title: "Users",
      description:
        "Browse members and choose query (one-shot) or chat (persistent thread) for each member's context.",
      icon: Users,
    },
    {
      href: "/chats",
      title: "Chats",
      description:
        "Continue ongoing conversations grounded in imported Claude history.",
      icon: MessageSquare,
    },
    {
      href: "/imports",
      title: "Imports",
      description:
        "Upload Claude exports and monitor import jobs until history is searchable.",
      icon: FileUp,
    },
  ];
}

export function HomeDashboard() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const isSuperAdmin = Boolean(user.super_admin);
  const hasOrganization = Boolean(user.organization_id);
  const quickLinks = getQuickLinks(isSuperAdmin, hasOrganization);

  const primaryHref = isSuperAdmin
    ? "/organizations"
    : hasOrganization
      ? "/users"
      : "/join-organization";

  const primaryLabel = isSuperAdmin
    ? "Open organizations"
    : hasOrganization
      ? "Search conversations"
      : "Join workspace";

  return (
    <AppShell>
      <div className="space-y-10">
        <header className="space-y-3">
          <Badge variant="secondary" className="w-fit">
            {isSuperAdmin ? "Super admin" : hasOrganization ? "Workspace" : "Setup"}
          </Badge>
          <div className="space-y-1">
            <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {isSuperAdmin
                ? "Manage organizations and help teams get their Claude history searchable."
                : hasOrganization
                  ? "Pick a member to query or chat against imported conversations, or upload new exports."
                  : "Complete workspace setup to start importing and searching chat history."}
            </p>
            <p className="flex max-w-xl items-start gap-2 text-sm leading-relaxed text-muted-foreground">
              <Shield
                className="mt-0.5 size-4 shrink-0 text-brand"
                aria-hidden
              />
              <span>
                <span className="font-medium text-foreground">
                  We value your privacy.
                </span>{" "}
                Your imported conversations stay in your workspace—we never
                sell your data or share it with advertisers.
              </span>
            </p>
          </div>
          <Button className="h-10 gap-1.5" render={<Link href={primaryHref} />}>
            {primaryLabel}
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </header>

        <section className="space-y-4" aria-labelledby="quick-links-heading">
          <h2
            id="quick-links-heading"
            className="font-heading text-base font-semibold tracking-tight"
          >
            Quick links
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {quickLinks.map(
              ({ href, title, description, icon: Icon, badge }) => (
                <li key={href}>
                  <Card className="flex h-full flex-col border-l-2 border-l-brand/60 ring-1 ring-foreground/10 transition-colors hover:bg-muted/20">
                    <CardHeader className="gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-brand"
                          aria-hidden
                        >
                          <Icon className="size-5" />
                        </div>
                        {badge ? (
                          <Badge variant="outline" className="shrink-0">
                            {badge}
                          </Badge>
                        ) : null}
                      </div>
                      <CardTitle className="text-base">{title}</CardTitle>
                      <CardDescription className="leading-relaxed">
                        {description}
                      </CardDescription>
                    </CardHeader>
                    <CardFooter className="mt-auto border-t-0 bg-transparent pt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5"
                        render={<Link href={href} />}
                      >
                        Open
                        <ArrowRight className="size-4" aria-hidden />
                      </Button>
                    </CardFooter>
                  </Card>
                </li>
              ),
            )}
          </ul>
        </section>

        {hasOrganization && !isSuperAdmin ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="ring-1 ring-foreground/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Search className="size-4 text-brand" aria-hidden />
                  <CardTitle className="text-base">Query</CardTitle>
                </div>
                <CardDescription className="leading-relaxed">
                  One-shot answers from a member&apos;s imported history. Pick a
                  user, ask a question, review sources.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-mono text-xs text-muted-foreground">
                  /users → member → query
                </p>
              </CardContent>
            </Card>
            <Card className="ring-1 ring-foreground/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-brand" aria-hidden />
                  <CardTitle className="text-base">Chat</CardTitle>
                </div>
                <CardDescription className="leading-relaxed">
                  Persistent threads with optional conversation memory. Context
                  is fixed when you start a chat.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-mono text-xs text-muted-foreground">
                  /users → member → chat · /chats
                </p>
              </CardContent>
            </Card>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
