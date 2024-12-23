import { UserApiModel } from "@/types/models";
import { resetPassword } from "@/utils/api";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Label, Modal, TextInput } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";

const FORM_ID = "reset-password-form";

type ResetPasswordFormData = {
  password: string;
};

interface ResetPasswordFormProps {
  userToResetPassword?: UserApiModel;
  onClose: () => void;
}

export const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ userToResetPassword, onClose }) => {
  const t = useTranslations("userMgmtForm");
  const tCommon = useTranslations("common");

  const schema = useMemo(
    () =>
      yup.object().shape({
        password: yup.string().required(tCommon("requiredMessage")),
      }),
    [tCommon],
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    defaultValues: {
      password: "",
    },
    resolver: yupResolver(schema),
  });

  const closeForm = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const submitHandler: SubmitHandler<ResetPasswordFormData> = useCallback(
    async (formData) => {
      if (!userToResetPassword) return;

      try {
        await resetPassword(userToResetPassword.id, formData.password);
        closeForm();
      } catch {
        toast.error(tCommon("unknownErrorMessage"));
      }
    },
    [closeForm, tCommon, userToResetPassword],
  );

  return (
    <Modal show={!!userToResetPassword} onClose={closeForm}>
      <Modal.Header>
        {t("resetPasswordConfirmationHeader", { user: userToResetPassword?.name || userToResetPassword?.login })}
      </Modal.Header>
      <Modal.Body>
        <form noValidate id={FORM_ID} onSubmit={handleSubmit(submitHandler)}>
          <div className="flex flex-wrap items-start gap-4">
            <Label className="mt-2.5 block opacity-60">{t("password")}</Label>
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <div>
                  <TextInput
                    {...field}
                    type="password"
                    value={field.value ?? ""}
                    color={errors.password?.message ? "failure" : undefined}
                    helperText={errors.password?.message}
                  />
                </div>
              )}
            />
          </div>
        </form>
      </Modal.Body>

      <Modal.Footer className="justify-end">
        <Button type="button" gradientDuoTone="redToYellow" outline onClick={closeForm}>
          {tCommon("cancelButton")}
        </Button>
        <Button type="submit" gradientDuoTone="redToYellow" disabled={isSubmitting} form={FORM_ID}>
          {t("saveButton")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
