import Link from "next/link";
import {
  ArrowRight,
  Building2,
  FileUp,
  Layers,
  Search,
  Sparkles,
} from "lucide-react";

import { LogoWordmark } from "@/components/brand/logo";
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
import { cn } from "@/lib/utils";

const integrations = [
  { name: "Claude", status: "available" as const },
  { name: "ChatGPT", status: "coming_soon" as const },
  { name: "Gemini", status: "coming_soon" as const },
  { name: "DeepSeek", status: "coming_soon" as const },
  { name: "More", status: "coming_soon" as const, detail: "assistants on the roadmap" },
] as const;

const features = [
  {
    icon: Search,
    title: "Semantic search",
    description:
      "Ask questions in natural language and retrieve the right moments from long AI chat threads—not just keyword hits.",
  },
  {
    icon: FileUp,
    title: "Bulk imports",
    description:
      "Upload conversation exports from the assistants your team uses. Track import jobs and know when history is ready to query.",
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
    body: "Upload AI chat exports for the people you support. Imports run in the background with clear status.",
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
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="transition-opacity hover:opacity-80">
            <LogoWordmark />
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
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-20 sm:pb-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-14 xl:gap-16">
            <div className="max-w-xl lg:max-w-none">
              <Badge
                variant="secondary"
                className="mb-6 gap-1.5 border border-border bg-accent/50 px-3 py-1 text-sm text-accent-foreground"
              >
                <Sparkles className="size-3.5 text-brand" aria-hidden />
                Semantic retrieval for AI chat history
              </Badge>
              <h1 className="font-heading text-4xl font-bold tracking-tight text-balance sm:text-5xl">
                Your team&apos;s decisions,{" "}
                <span className="text-brand">searchable from day one</span>
              </h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground text-pretty">
                Human Context imports your organization&apos;s AI chat history
                and turns it into a shared brain. When someone new joins, they
                ask what shipped, why, and who owns it—instead of chasing dev,
                sales, or PMs across Slack.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="h-12 min-h-touch px-6 text-base"
                  render={<Link href="/register" />}
                >
                  Create workspace account
                  <ArrowRight className="size-4" aria-hidden />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 min-h-touch px-6 text-base"
                  render={<Link href="/login" />}
                >
                  Sign in to your workspace
                </Button>
              </div>
            </div>

            <Card
              className="border-l-4 border-l-brand shadow-md ring-1 ring-foreground/10"
              aria-labelledby="example-heading"
            >
              <CardHeader className="gap-3 px-6 pt-6 pb-4 sm:px-8 sm:pt-8">
                <p className="text-sm font-medium text-brand">See it in action</p>
                <CardTitle
                  id="example-heading"
                  className="font-heading text-xl font-semibold tracking-tight text-balance sm:text-2xl"
                >
                  New intern, first week
                </CardTitle>
                <CardDescription className="text-base leading-relaxed text-pretty">
                  Maya joins Product. She searches the PM&apos;s imported chat
                  history—not Slack threads or intro calls.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 border-t border-border px-6 pt-5 pb-6 sm:px-8 sm:pb-8">
                <div
                  className="rounded-2xl bg-muted/50 p-5 sm:p-6"
                  aria-label="Example conversation with organization context"
                >
                  <p className="mb-4 text-sm font-medium text-muted-foreground">
                    Maya asks
                  </p>
                  <div className="flex justify-end">
                    <p className="max-w-[92%] rounded-2xl bg-muted px-5 py-3.5 text-base leading-relaxed text-foreground">
                      Why did we ship usage-based billing instead of flat
                      pricing?
                    </p>
                  </div>
                  <p className="mt-5 text-sm font-medium text-muted-foreground">
                    Human Context answers from imported history
                  </p>
                  <p className="mt-2 text-base leading-relaxed text-foreground">
                    The team switched in March. Sales flagged that flat pricing
                    blocked enterprise deals, and product documented the
                    tradeoff in planning threads that quarter.
                  </p>
                  <p className="mt-4 rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm text-muted-foreground">
                    Source · Product lead · Mar 14 thread
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Answers stay inside your workspace—grounded in real
                  conversations, scoped to members you manage.
                </p>
              </CardContent>
            </Card>
          </div>
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
          className="border-y border-border bg-accent/30 py-16 sm:py-20"
          aria-labelledby="integrations-heading"
        >
          <div className="mx-auto max-w-6xl px-4">
            <div className="mx-auto max-w-2xl text-center">
              <Badge
                variant="secondary"
                className="mb-5 gap-1.5 border border-border bg-background/80 px-3 py-1 text-sm text-accent-foreground"
              >
                <Layers className="size-3.5 text-brand" aria-hidden />
                Platform integrations
              </Badge>
              <h2
                id="integrations-heading"
                className="font-heading text-2xl font-semibold tracking-tight text-balance sm:text-3xl"
              >
                Every AI assistant,{" "}
                <span className="text-brand">one searchable brain</span>
              </h2>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground text-pretty">
                Start with Claude today. ChatGPT, Gemini, DeepSeek, and more
                integrations are on the way—so your team can search every
                conversation, no matter which model they used.
              </p>
            </div>

            <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {integrations.map((integration) => {
                const isAvailable = integration.status === "available";

                return (
                  <li key={integration.name}>
                    <div
                      className={cn(
                        "flex h-full flex-col items-center gap-3 rounded-xl border px-4 py-6 text-center transition-colors",
                        isAvailable
                          ? "border-brand bg-card shadow-sm ring-1 ring-brand/15"
                          : "border-dashed border-border/80 bg-card/70",
                      )}
                    >
                      <span className="font-heading text-lg font-semibold tracking-tight">
                        {integration.name}
                      </span>
                      {"detail" in integration && integration.detail ? (
                        <span className="text-xs leading-snug text-muted-foreground">
                          {integration.detail}
                        </span>
                      ) : null}
                      <Badge
                        variant={isAvailable ? "secondary" : "outline"}
                        className={cn(
                          "mt-auto",
                          isAvailable &&
                            "border-brand/25 bg-brand/10 text-brand",
                        )}
                      >
                        {isAvailable ? "Available now" : "Coming soon"}
                      </Badge>
                    </div>
                  </li>
                );
              })}
            </ul>

            <p className="mx-auto mt-10 max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
              One workspace for your organization&apos;s AI memory—import once,
              query with meaning, and keep growing as new assistants ship.
            </p>
          </div>
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
                  Ready to search your team&apos;s AI chat history?
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
          <LogoWordmark logoClassName="size-6" />
          <p className="text-xs text-muted-foreground">
            Semantic search over imported AI chat conversations.
          </p>
        </div>
      </footer>
    </div>
  );
}
