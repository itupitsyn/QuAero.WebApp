"use client";

import { CreateUserRequest } from "@/types/models";
import { Permission } from "@/types/permissions";
import { createUser } from "@/utils/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { PermissionList } from "../PermissionList";
import { AddUserFormData } from "../../types";

const FORM_ID = "add-user-form";

interface AddUserFormProps {
  show: boolean;
  onClose: () => void;
  onAfterSubmit?: () => void;
}

export const AddUserForm: FC<AddUserFormProps> = ({ show, onClose, onAfterSubmit }) => {
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddUserFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      login: "",
      password: "",
    },
  });

  const submitHandler: SubmitHandler<AddUserFormData> = useCallback(
    async (formData) => {
      const permissions: Permission[] = [];
      if (formData[Permission.CanCreateAdmins]) permissions.push(Permission.CanCreateAdmins);
      if (formData[Permission.CanCreateEmployee]) permissions.push(Permission.CanCreateEmployee);
      if (formData[Permission.CanCreateSRT]) permissions.push(Permission.CanCreateSRT);
      if (formData[Permission.CanCreateSRTManager]) permissions.push(Permission.CanCreateSRTManager);

      try {
        const params: CreateUserRequest = {
          login: formData.login,
          password: formData.password,
          name: formData.name ?? undefined,
          permissions,
        };
        await createUser(params);
        reset();
        onAfterSubmit?.();
        onClose();
      } catch {
        toast.error(tCommon("unknownErrorMessage"));
      }
    },
    [onClose, onAfterSubmit, reset, tCommon],
  );

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>{t("addUserFormHeader")}</Modal.Header>
      <Modal.Body>
        <form
          noValidate
          onSubmit={handleSubmit(submitHandler)}
          className="grid grid-cols-[1fr_5fr] items-center gap-4"
          id={FORM_ID}
        >
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
                type="password"
                value={field.value ?? ""}
                color={errors.password?.message ? "failure" : undefined}
                helperText={errors.password?.message}
              />
            )}
          />

          <PermissionList control={control} />
        </form>
      </Modal.Body>
      <Modal.Footer className="justify-end">
        <Button type="button" gradientDuoTone="redToYellow" outline onClick={onClose}>
          {tCommon("cancelButton")}
        </Button>
        <Button type="submit" gradientDuoTone="redToYellow" disabled={isSubmitting} form={FORM_ID}>
          {t("addButton")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
