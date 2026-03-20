import { useState } from "react";
import { login, register, logout } from "../actions/auth.actions";
import { LoginFormData, RegisterFormData } from "../types";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(data: LoginFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await login(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mauvais identifiants");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(data: RegisterFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await register(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Message par défaut");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de se déconnecter",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return { handleLogin, handleRegister, handleLogout, isLoading, error };
}
