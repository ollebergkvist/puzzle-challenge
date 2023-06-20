// hooks
import { useAuthContext } from "../context";

// libs
import { route } from "preact-router";
import { useState } from "preact/hooks";
import { useEffect } from "react";

type LoginFunction = (email: string, password: string) => Promise<void>;

export const useLogin = (login: LoginFunction) => {
  const { isAuthenticated } = useAuthContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (
    event: JSX.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const { value } = event?.target as HTMLInputElement;
    setEmail(value);
  };

  const handlePasswordChange = (
    event: JSX.TargetedEvent<HTMLInputElement, Event>
  ) => {
    const { value } = event?.target as HTMLInputElement;
    setPassword(value);
  };

  const handleSubmit = async (
    event: JSX.TargetedEvent<HTMLFormElement, Event>
  ) => {
    event.preventDefault();

    try {
      setSuccess(false);
      setError("");
      setLoading(true);

      await login(email, password);

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      setSuccess(false);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      route("/", true);
    }
  }, [isAuthenticated, setSuccess]);

  return {
    email,
    password,
    error,
    loading,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
  };
};
