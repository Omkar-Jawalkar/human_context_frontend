"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Lock, Mail } from "lucide-react";
import { z } from "zod";

import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setErrorMessage(null);

    try {
      await login(values);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to sign in. Please try again.";
      setErrorMessage(message);
    }
  });

  return (
    <Card className="border-l-2 border-l-brand shadow-sm ring-foreground/8">
      <CardHeader className="gap-2 pb-2">
        <h1 className="font-heading text-xl font-semibold tracking-tight">
          Sign in
        </h1>
        <CardDescription className="text-pretty leading-relaxed">
          Use the email and password for your workspace account.
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent className="space-y-6">
          {errorMessage ? (
            <Alert variant="destructive" role="alert">
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                className="h-10 pl-9"
                autoFocus
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                {...register("email")}
              />
            </div>
            {errors.email ? (
              <p id="email-error" className="text-sm text-destructive">
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden
              />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Your password"
                className="h-10 pl-9"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password ? "password-error" : undefined
                }
                {...register("password")}
              />
            </div>
            {errors.password ? (
              <p id="password-error" className="text-sm text-destructive">
                {errors.password.message}
              </p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent px-4 pt-2 pb-4">
          <Button
            type="submit"
            className="h-10 w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
          <Separator />
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline-offset-4 transition-colors hover:text-foreground/80 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
