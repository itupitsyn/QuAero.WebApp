"use client";

import { Button, Label, TextInput, useThemeMode } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { createSuperAdmin } from "@/utils/api";
import { useRouter } from "@/i18n/routing";

type SuperAdminFormData = {
  login: string;
  password: string;
};

export const CreateSuperAdminForm: FC = () => {
  const t = useTranslations("createSuperAdminForm");
  const tCommon = useTranslations("common");
  const { push } = useRouter();

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
  } = useForm<SuperAdminFormData>({
    resolver: yupResolver(schema),
  });

  const submitHandler: SubmitHandler<SuperAdminFormData> = useCallback(
    async (formData) => {
      try {
        await createSuperAdmin(formData);
        push({ pathname: "/" });
      } catch {
        toast.error(tCommon("unknownErrorMessage"));
      }
    },
    [push, tCommon],
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
