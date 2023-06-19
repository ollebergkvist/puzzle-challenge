// libs
import { route } from "preact-router";
import { useState } from "preact/hooks";

type LoginFunction = (email: string, password: string) => Promise<void>;

export const useLogin = (login: LoginFunction) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      setError("");
      setLoading(true);

      await login(email, password);

      setLoading(false);

      route("/", true);
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

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
