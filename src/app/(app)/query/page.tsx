"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import { askQuery } from "@/lib/api/query";
import { QuerySources } from "@/components/query-sources";
import { useRequireAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { QueryResponse } from "@/lib/types/api";

const querySchema = z.object({
  query: z.string().min(1, "Enter a question"),
});

type QueryFormValues = z.infer<typeof querySchema>;

export default function QueryPage() {
  const { user, token, isLoading } = useRequireAuth();
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<QueryFormValues>({
    resolver: zodResolver(querySchema),
    defaultValues: {
      query: "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    if (!token || !user) {
      return;
    }

    setErrorMessage(null);
    setResult(null);

    try {
      const response = await askQuery(token, {
        query: values.query,
        user_id: user.id,
      });
      setResult(response);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : "Unable to run query. Please try again.";
      setErrorMessage(message);
      toast.error(message);
    }
  });

  if (isLoading || !user) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Query</h1>
        <p className="text-sm text-muted-foreground">
          Ask natural-language questions over your imported Claude conversations.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
          <CardDescription>
            Search is scoped to your embedded messages ({user.email}).
          </CardDescription>
        </CardHeader>
        <form onSubmit={onSubmit}>
          <CardContent className="space-y-4">
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="query">Question</Label>
              <Textarea
                id="query"
                rows={4}
                placeholder="What did we discuss about project planning?"
                {...register("query")}
              />
              {errors.query ? (
                <p className="text-sm text-destructive">{errors.query.message}</p>
              ) : null}
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Searching…" : "Ask"}
            </Button>
          </CardContent>
        </form>
      </Card>

      {result ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Answer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-relaxed">
                {result.answer}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <h2 className="text-lg font-medium">Sources</h2>
            <QuerySources sources={result.sources} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
