import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileUp,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const features = [
  {
    icon: Search,
    title: "Semantic search",
    description:
      "Ask questions in natural language and retrieve the right moments from long Claude threads—not just keyword hits.",
  },
  {
    icon: FileUp,
    title: "Bulk imports",
    description:
      "Upload conversation exports for your organization. Track import jobs and know when history is ready to query.",
  },
  {
    icon: Building2,
    title: "Team workspaces",
    description:
      "Admins manage organizations; members search across imported conversations within their workspace.",
  },
] as const;

const steps = [
  {
    step: "01",
    title: "Import history",
    body: "Upload Claude exports for the people you support. Imports run in the background with clear status.",
  },
  {
    step: "02",
    title: "Pick a member",
    body: "Browse your organization’s users and open semantic search for the conversations you’ve imported.",
  },
  {
    step: "03",
    title: "Query in context",
    body: "Ask follow-up questions and review source excerpts so answers stay grounded in real chat history.",
  },
] as const;

export function HomeLanding() {
  return (
    <div className="flex min-h-full flex-col bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link
            href="/"
            className="font-heading text-base font-bold tracking-tight"
          >
            Human Context
          </Link>
          <nav
            className="flex items-center gap-2 sm:gap-3"
            aria-label="Account"
          >
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Sign in
            </Button>
            <Button size="sm" className="h-9" render={<Link href="/register" />}>
              Get started
              <ArrowRight className="size-4" aria-hidden />
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 pt-16 pb-20 sm:pt-20 sm:pb-24">
          <div className="max-w-2xl">
            <Badge
              variant="secondary"
              className="mb-6 gap-1.5 border border-border bg-accent/50 text-accent-foreground"
            >
              <Sparkles className="size-3.5 text-brand" aria-hidden />
              Semantic retrieval for Claude
            </Badge>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Find the right conversation{" "}
              <span className="text-brand">without scrolling forever</span>
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground text-pretty">
              Human Context imports your team&apos;s Claude chat history and
              lets you search it with meaning—not just exact phrases. Built for
              support, research, and compliance teams who need answers fast.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button size="lg" className="h-11 min-h-touch px-5" render={<Link href="/register" />}>
                Create workspace account
                <ArrowRight className="size-4" aria-hidden />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="h-11 min-h-touch px-5"
                render={<Link href="/login" />}
              >
                Sign in to your workspace
              </Button>
            </div>
          </div>

          <Card className="mt-14 border-l-2 border-l-brand shadow-sm ring-1 ring-foreground/8 sm:mt-16">
            <CardHeader className="gap-3 pb-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="size-4 shrink-0 text-brand" aria-hidden />
                <span>Workspace-first access</span>
              </div>
              <CardTitle className="font-heading text-lg font-semibold tracking-tight">
                Your data stays in your organization
              </CardTitle>
              <CardDescription className="max-w-2xl text-pretty leading-relaxed">
                Accounts belong to a workspace. Imports and queries are scoped
                to members you manage—no public indexes, no shared pools across
                customers.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="font-mono text-xs text-muted-foreground">
                org-scoped · import jobs · member-level query
              </p>
            </CardContent>
          </Card>
        </section>

        <Separator />

        <section
          className="mx-auto max-w-5xl px-4 py-16 sm:py-20"
          aria-labelledby="features-heading"
        >
          <div className="mb-10 max-w-xl">
            <h2
              id="features-heading"
              className="font-heading text-xl font-semibold tracking-tight"
            >
              Everything you need to search chat history
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              A focused toolkit—import, organize, and query—without extra noise.
            </p>
          </div>
          <ul className="grid gap-6 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <Card className="h-full ring-1 ring-foreground/10">
                  <CardHeader>
                    <div
                      className="mb-1 flex size-10 items-center justify-center rounded-lg bg-muted text-brand"
                      aria-hidden
                    >
                      <Icon className="size-5" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription className="leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="bg-muted/30 py-16 sm:py-20"
          aria-labelledby="how-heading"
        >
          <div className="mx-auto max-w-5xl px-4">
            <h2
              id="how-heading"
              className="font-heading text-xl font-semibold tracking-tight"
            >
              How it works
            </h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Three steps from export files to grounded answers.
            </p>
            <ol className="mt-10 grid gap-8 sm:grid-cols-3 sm:gap-6">
              {steps.map(({ step, title, body }) => (
                <li key={step} className="space-y-3">
                  <span className="font-mono text-sm font-bold text-brand">
                    {step}
                  </span>
                  <h3 className="font-heading text-base font-medium">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 sm:py-20">
          <Card className="bg-accent/40 ring-1 ring-foreground/10">
            <CardContent className="flex flex-col items-start gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
              <div className="max-w-md space-y-2">
                <h2 className="font-heading text-lg font-semibold tracking-tight">
                  Ready to search your team&apos;s Claude history?
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Create an account, join or set up your organization, and start
                  importing conversations.
                </p>
              </div>
              <Button size="lg" className="h-11 shrink-0" render={<Link href="/register" />}>
                Get started
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>

      <footer className="mt-auto border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-heading text-sm font-medium">Human Context</p>
          <p className="text-xs text-muted-foreground">
            Semantic search over imported Claude conversations.
          </p>
        </div>
      </footer>
    </div>
  );
}
