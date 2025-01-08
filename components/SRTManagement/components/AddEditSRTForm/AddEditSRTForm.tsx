import { PrismaTypes } from "@/prisma/types";
import { yupResolver } from "@hookform/resolvers/yup";
import { Label, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useEffect, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";
import { SRT_FORM_ID } from "../../constants";
import { toast } from "react-toastify";
import { createSRT } from "@/utils/api";

type SRTFormData = {
  name: string;
};

interface AddEditSRTFormProps {
  srt?: PrismaTypes.SearchRescueTeam;
  onSubmit: () => void;
  onIsSubmitting: (isSubmitting: boolean) => void;
}

export const AddEditSRTForm: FC<AddEditSRTFormProps> = ({ srt, onIsSubmitting, onSubmit }) => {
  const t = useTranslations("teamMgmtForm");
  const tCommon = useTranslations("common");

  const schema = useMemo(
    () =>
      yup.object().shape({
        name: yup.string().required(tCommon("requiredMessage")),
      }),
    [tCommon],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SRTFormData>({
    defaultValues: { name: srt?.name || "" },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    onIsSubmitting(isSubmitting);
  }, [isSubmitting, onIsSubmitting]);

  const submitHandler: SubmitHandler<SRTFormData> = useCallback(
    async (formData) => {
      try {
        await createSRT(formData);
        reset();
        onSubmit();
      } catch {
        toast.error(tCommon("unknownErrorMessage"));
      }
    },
    [onSubmit, reset, tCommon],
  );

  useEffect(() => {
    reset(srt);
  }, [reset, srt]);

  return (
    <form noValidate id={SRT_FORM_ID} onSubmit={handleSubmit(submitHandler)}>
      <div className="grid grid-cols-[1fr_5fr] items-start gap-4">
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
    </form>
  );
};
