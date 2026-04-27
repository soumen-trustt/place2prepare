"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthShell } from "@/components/auth/auth-shell";
import { PageLoader } from "@/components/ui/page-loader";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { confirmPasswordReset } from "@/lib/api/auth";
import { extractErrorMessage } from "@/lib/api/client";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations/auth";

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [missingToken, setMissingToken] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
  });

  useEffect(() => {
    if (!token) {
      setMissingToken(true);
    }
  }, [token]);

  const onSubmit = async (values: ResetPasswordFormValues) => {
    setApiError("");
    setSuccessMessage("");
    if (!token) {
      setApiError("This reset link is missing its token.");
      return;
    }
    try {
      await confirmPasswordReset({
        token,
        newPassword: values.newPassword,
      });
      setSuccessMessage(
        "Your password has been updated. Redirecting you to sign in..."
      );
      setTimeout(() => router.push("/login"), 1800);
    } catch (error) {
      setApiError(
        extractErrorMessage(
          error,
          "This reset link is invalid or has expired. Request a new one."
        )
      );
    }
  };

  return (
    <AuthShell
      title="Choose a new password"
      subtitle="Pick something strong — at least 8 characters."
      footerText="Back to"
      footerLinkText="Sign in"
      footerHref="/login"
    >
      {missingToken ? (
        <div className="space-y-3">
          <p className="rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
            This reset link is missing its token. Please request a new one.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-gradient px-4 py-3 text-sm font-bold text-white shadow-glow-sm transition hover:brightness-110"
          >
            Request a new link
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {apiError ? (
            <p className="rounded-2xl border border-red-200/80 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm">
              {apiError}
            </p>
          ) : null}
          {successMessage ? (
            <p className="rounded-2xl border border-emerald-200/80 bg-emerald-50/90 px-4 py-3 text-sm font-medium text-emerald-900 shadow-sm">
              {successMessage}
            </p>
          ) : null}

          <PasswordInput
            id="newPassword"
            label="New password"
            placeholder="At least 8 characters"
            autoComplete="new-password"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordInput
            id="confirmPassword"
            label="Confirm new password"
            placeholder="Re-type your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />

          <Button type="submit" className="w-full" loading={isSubmitting}>
            Update password
          </Button>
        </form>
      )}
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageLoader message="Loading reset form…" />}>
      <ResetPasswordInner />
    </Suspense>
  );
}
