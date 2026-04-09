"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { apiFetch } from "@/shared/lib/api";

const schema = z.object({
  password: z.string().min(8, "8 caractères minimum"),
});

type FormData = z.infer<typeof schema>;

const ResetPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { password: "" },
  });

  async function onSubmit(data: FormData) {
    if (!token) {
      setError("Lien invalide ou expiré.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await apiFetch("/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password: data.password }),
      });
      router.push("/login");
    } catch {
      setError("Lien invalide ou expiré. Faites une nouvelle demande.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h2>Nouveau mot de passe</h2>
      <Field>
        <FieldLabel htmlFor="password">Mot de passe</FieldLabel>
        <Input {...form.register("password")} type="password" id="password" />
        <FieldError errors={[form.formState.errors.password]} />
      </Field>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center mt-5">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Enregistrement..." : "Réinitialiser le mot de passe"}
        </Button>
      </div>
    </form>
  );
};

export default ResetPasswordForm;
