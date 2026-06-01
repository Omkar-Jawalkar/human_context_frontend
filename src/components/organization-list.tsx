"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { ApiError } from "@/lib/api/client";
import {
  deleteOrganization,
  updateOrganization,
} from "@/lib/api/organizations";
import type { OrganizationResponse } from "@/lib/types/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const editSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

type EditFormValues = z.infer<typeof editSchema>;

type OrganizationListProps = {
  organizations: OrganizationResponse[];
  token: string;
  onChanged: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function OrganizationRow({
  organization,
  token,
  onChanged,
}: {
  organization: OrganizationResponse;
  token: string;
  onChanged: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFormValues>({
    resolver: zodResolver(editSchema),
    defaultValues: { name: organization.name },
  });

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(organization.id);
      toast.success("Organization ID copied");
    } catch {
      toast.error("Unable to copy to clipboard");
    }
  };

  const onSave = handleSubmit(async (values) => {
    try {
      await updateOrganization(token, organization.id, { name: values.name });
      toast.success("Organization updated");
      setIsEditing(false);
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to update organization",
      );
    }
  });

  const onDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteOrganization(token, organization.id);
      toast.success("Organization deleted");
      setDeleteOpen(false);
      onChanged();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to delete organization",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card size="sm">
        <CardHeader>
          {isEditing ? (
            <form onSubmit={onSave} className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor={`name-${organization.id}`}>Name</Label>
                <Input
                  id={`name-${organization.id}`}
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="text-sm text-destructive">{errors.name.message}</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? "Saving…" : "Save"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    reset({ name: organization.name });
                    setIsEditing(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <>
              <CardTitle>{organization.name}</CardTitle>
              <CardDescription>
                Created {formatDate(organization.created_at)}
              </CardDescription>
            </>
          )}
        </CardHeader>
        {!isEditing ? (
          <CardContent className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <code className="rounded bg-muted px-2 py-1 text-xs">
                {organization.id}
              </code>
              <Button variant="outline" size="sm" onClick={() => void copyId()}>
                Copy ID
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  reset({ name: organization.name });
                  setIsEditing(true);
                }}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        ) : null}
      </Card>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete organization?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete &ldquo;{organization.name}&rdquo;. This
              cannot be undone. Organizations with users or import jobs cannot be
              deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isDeleting}
              onClick={() => void onDelete()}
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export function OrganizationList({
  organizations,
  token,
  onChanged,
}: OrganizationListProps) {
  if (organizations.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No organizations yet. Create one in the Create tab.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {organizations.map((organization) => (
        <OrganizationRow
          key={organization.id}
          organization={organization}
          token={token}
          onChanged={onChanged}
        />
      ))}
    </div>
  );
}
