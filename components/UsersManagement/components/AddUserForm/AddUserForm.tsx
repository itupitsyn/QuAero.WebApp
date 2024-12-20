"use client";

import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

interface AddUserFormProps {
  show: boolean;
  onClose: () => void;
}

type AddUserFormData = {
  name?: string | null;
  login: string;
  password: string;
};

export const AddUserForm: FC<AddUserFormProps> = ({ show, onClose }) => {
  const t = useTranslations("usersMgmtForm");
  const tCommon = useTranslations("common");

  const schema = useMemo(
    () =>
      yup.object().shape({
        login: yup.string().nullable().required(tCommon("requiredMessage")),
        password: yup.string().nullable().required(tCommon("requiredMessage")),
        name: yup.string().nullable(),
      }),
    [tCommon],
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      login: "",
      password: "",
    },
  });

  const submitHandler: SubmitHandler<AddUserFormData> = useCallback(async (formData) => {}, []);

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{t("addUserFormHeader")}</Modal.Header>
      <Modal.Body>
        <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col items-start gap-4">
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

            <Label className="opacity-60">{t("password")}</Label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value ?? ""}
                  color={errors.password?.message ? "failure" : undefined}
                  helperText={errors.password?.message}
                />
              )}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button type="button" gradientDuoTone="redToYellow" outline onClick={onClose}>
          {tCommon("cancelButton")}
        </Button>
        <Button type="submit" gradientDuoTone="redToYellow" disabled={isSubmitting}>
          {t("addButton")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
