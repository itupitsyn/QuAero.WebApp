"use client";

import { UpdateUserRequest, UserApiModel } from "@/types/models";
import { Permission } from "@/types/permissions";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { PermissionList } from "../PermissionList";
import { EditUserFormData, SRTOption } from "../../types";
import { toast } from "react-toastify";
import { updateUser } from "@/utils/api";
import axios from "axios";

const getDefaultValues = (user: UserApiModel) => {
  const formData: EditUserFormData = {
    name: user?.name ?? "",
    login: user?.login ?? "",
  };

  Object.entries(user.permissions).forEach(([k, v]) => {
    if (v) formData[k as Permission] = { allowed: false };
  });

  return formData;
};

interface EditUserFormProps {
  user: UserApiModel;
  srts: SRTOption[];
  onCancelClick: (userId: string) => void;
  onAfterSubmit?: (userId: string) => void;
}

export const EditUserForm: FC<EditUserFormProps> = ({ user, srts, onCancelClick, onAfterSubmit }) => {
  const t = useTranslations("userMgmtForm");
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
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: yupResolver(schema),
    defaultValues: getDefaultValues(user),
  });

  const submitHandler: SubmitHandler<EditUserFormData> = useCallback(
    async (formData) => {
      const permissions: Permission[] = [];
      if (formData[Permission.CanCreateAdmins]) permissions.push(Permission.CanCreateAdmins);
      if (formData[Permission.CanCreateEmployee]) permissions.push(Permission.CanCreateEmployee);
      if (formData[Permission.CanCreateSRT]) permissions.push(Permission.CanCreateSRT);
      if (formData[Permission.CanCreateSRTManager]) permissions.push(Permission.CanCreateSRTManager);

      const params: UpdateUserRequest = {
        login: formData.login,
        name: formData.name ?? undefined,
        permissions,
        srts: formData.srts?.map((item) => item.id),
      };

      try {
        await updateUser(user.id, params);

        reset();
        onAfterSubmit?.(user.id);
      } catch (e) {
        if (axios.isAxiosError(e) && e.response?.data.key === "lastSa") {
          toast.error(t("lastSaError"));
          return;
        }
        toast.error(tCommon("unknownErrorMessage"));
      }
    },
    [onAfterSubmit, reset, t, tCommon, user.id],
  );

  return (
    <form noValidate onSubmit={handleSubmit(submitHandler)} className="flex flex-col items-start gap-6">
      <div className="flex flex-col items-start gap-x-8 gap-y-6 md:flex-row">
        <div className="grid grid-cols-[1fr_5fr] items-start gap-4">
          <Label className="mt-2.5 block opacity-60">{t("login")}</Label>
          <div>
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
          </div>

          <Label className="mt-2.5 block opacity-60">{t("name")}</Label>
          <div>
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
        </div>

        <PermissionList control={control} srts={srts} />
      </div>

      <div className="flex gap-4 sm:self-end">
        <Button type="button" gradientDuoTone="redToYellow" outline onClick={() => onCancelClick(user?.id)}>
          {tCommon("cancelButton")}
        </Button>
        <Button type="submit" gradientDuoTone="redToYellow" disabled={isSubmitting}>
          {tCommon("saveButton")}
        </Button>
      </div>
    </form>
  );
};
