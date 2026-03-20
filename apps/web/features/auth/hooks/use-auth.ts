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
    } catch {
      setError("Mauvais identifiants");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRegister(data: RegisterFormData) {
    setIsLoading(true);
    setError(null);

    try {
      await register(data);
    } catch {
      setError("Le formulaire n'est pas correctement rempli");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleLogout() {
    setIsLoading(true);
    setError(null);

    try {
      await logout();
    } catch {
      setError("Impossible de se déconnecter");
    } finally {
      setIsLoading(false);
    }
  }

  return { handleLogin, handleRegister, handleLogout, isLoading, error };
}
