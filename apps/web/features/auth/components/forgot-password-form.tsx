"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Field, FieldLabel, FieldError } from "@/shared/components/ui/field";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { forgotPassword } from "../actions/auth.actions";

const schema = z.object({
  email: z.string().email("Email invalide"),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  async function onSubmit(data: FormData) {
    setIsLoading(true);
    setError(null);
    try {
      await forgotPassword(data.email);
      setSent(true);
    } catch {
      setError("Une erreur est survenue, veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }

  if (sent) {
    return (
      <p className="text-sm text-muted-foreground">
        Si cet email existe, un lien de réinitialisation vous a été envoyé.
      </p>
    );
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <h2>Réinitialiser le mot de passe</h2>
      <Field>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input {...form.register("email")} type="email" id="email" />
        <FieldError errors={[form.formState.errors.email]} />
      </Field>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex items-center mt-5">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Envoi..." : "Envoyer le lien"}
        </Button>
      </div>
    </form>
  );
};

export default ForgotPasswordForm;
