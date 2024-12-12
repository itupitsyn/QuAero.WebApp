"use client";

import { Button, Card, Label, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "@/i18n/routing";
import { signIn } from "@/utils/api";
import axios from "axios";
import { useAuth } from "@/contexts/AuthContext";

type LoginData = {
  login: string;
  password: string;
};

export const LoginForm: FC = () => {
  const t = useTranslations("loginForm");
  const tCommon = useTranslations("common");
  const { push } = useRouter();
  const { updateAuth } = useAuth();

  const schema = useMemo(
    () =>
      yup.object().shape({
        login: yup.string().required(tCommon("requiredMessage")),
        password: yup.string().required(tCommon("requiredMessage")),
      }),
    [tCommon],
  );

  const {
    control,
    formState: { isSubmitting, errors },
    handleSubmit,
  } = useForm<LoginData>({
    resolver: yupResolver(schema),
    defaultValues: {
      login: "",
      password: "",
    },
  });

  const submitHandler: SubmitHandler<LoginData> = useCallback(
    async (formData) => {
      try {
        await signIn(formData);
        updateAuth();
        push({ pathname: "/" });
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          toast.error(t("wrongCredentialsErrorMessage"));
        } else {
          toast.error(tCommon("unknownErrorMessage"));
        }
      }
    },
    [updateAuth, push, t, tCommon],
  );

  return (
    <form noValidate className="flex flex-col gap-6" onSubmit={handleSubmit(submitHandler)}>
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <div>
        <div className="mb-2">
          <Label htmlFor="login" value={t("login")} />
        </div>
        <Controller
          control={control}
          name="login"
          render={({ field }) => (
            <TextInput
              id={field.name}
              {...field}
              type="email"
              color={errors.login?.message ? "failure" : undefined}
              helperText={errors.login?.message}
            />
          )}
        />
      </div>
      <div>
        <div className="mb-2">
          <Label htmlFor="password" value={t("password")} />
        </div>
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <TextInput
              id={field.name}
              {...field}
              type="password"
              color={errors.password?.message ? "failure" : undefined}
              helperText={errors.password?.message}
            />
          )}
        />
      </div>
      <Button type="submit" gradientDuoTone="redToYellow" outline disabled={isSubmitting} className="sm:self-end">
        {t("submitButton")}
      </Button>
    </form>
  );
};
