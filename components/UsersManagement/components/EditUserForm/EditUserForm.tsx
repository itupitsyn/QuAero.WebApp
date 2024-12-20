"use client";

import { UserApiModel } from "@/types/models";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface EditUserFormProps {
  user: UserApiModel;
  onCancelClick: (userId: string) => void;
}

type EditUserFormData = {
  name?: string | null;
  login: string;
};

export const EditUserForm: FC<EditUserFormProps> = ({ user, onCancelClick }) => {
  const t = useTranslations("usersMgmtForm");
  const tCommon = useTranslations("common");

  const schema = useMemo(
    () =>
      yup.object().shape({
        login: yup.string().nullable().required(tCommon("requiredMessage")),
        name: yup.string().nullable(),
      }),
    [tCommon],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      login: user?.login ?? "",
    },
  });

  const submitHandler: SubmitHandler<EditUserFormData> = useCallback(async (formData) => {}, []);

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col items-start gap-4">
      {user && <div className="font-bold">#{user.id}</div>}

      <div className="grid grid-cols-[1fr_5fr] items-center gap-4">
        <Label className="opacity-60">{t("login")}</Label>
        <Controller
          control={control}
          name="login"
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value ?? ""}
              color={errors.login?.message ? "failure" : undefined}
              helperText={errors.login?.message}
            />
          )}
        />

        <Label className="opacity-60">{t("name")}</Label>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextInput
              {...field}
              value={field.value ?? ""}
              color={errors.name?.message ? "failure" : undefined}
              helperText={errors.name?.message}
            />
          )}
        />
      </div>

      <div className="flex gap-4 sm:self-end">
        <Button type="button" gradientDuoTone="redToYellow" outline onClick={() => onCancelClick(user?.id)}>
          {tCommon("cancelButton")}
        </Button>
        <Button type="submit" gradientDuoTone="redToYellow" disabled={isSubmitting}>
          {t("saveButton")}
        </Button>
      </div>
    </form>
  );
};
