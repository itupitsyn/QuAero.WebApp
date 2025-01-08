"use client";

import { UserApiModel } from "@/types/models";
import { FC, useCallback, useState } from "react";
import { AddUserForm } from "./components/AddUserForm";
import { Button, Card, Modal } from "flowbite-react";
import { ViewUser } from "./components/ViewUser";
import { EditUserForm } from "./components/EditUserForm";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { deleteUser } from "@/utils/api";
import { toast } from "react-toastify";
import axios from "axios";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { useAuth } from "@/contexts/AuthContext";

interface UserManagementProps {
  users: UserApiModel[];
}

export const UserManagement: FC<UserManagementProps> = ({ users }) => {
  const t = useTranslations("userMgmtForm");
  const tCommon = useTranslations("common");
  const { refresh } = useRouter();
  const { user, updateAuth } = useAuth();

  const [addUserFormOpen, setAddUserFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserApiModel>();
  const [userToResetPassword, setUserToResetPassword] = useState<UserApiModel>();

  const [modes, setModes] = useState<Record<string, "view" | "edit">>(
    Object.fromEntries(users.map((item) => [item.id, "view"])),
  );

  const onEditUserClick = useCallback((userId: string) => {
    setModes((prev) => ({ ...prev, [userId]: "edit" }));
  }, []);

  const onCancelClick = useCallback((userId?: string) => {
    if (userId !== undefined) {
      setModes((prev) => ({ ...prev, [userId]: "view" }));
    }
  }, []);

  const onDeleteUser = useCallback(async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      setUserToDelete(undefined);
      refresh();
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response?.data.key === "lastSa") {
        toast.error(t("lastSaError"));
        return;
      }

      toast.error(tCommon("unknownErrorMessage"));
    }
  }, [refresh, t, tCommon, userToDelete]);

  const onAfterEdit = useCallback(
    (userId: string) => {
      setModes((prev) => ({ ...prev, [userId]: "view" }));
      if (userId === user?.id) {
        updateAuth();
      }
      refresh();
    },
    [refresh, updateAuth, user?.id],
  );

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <Button type="button" gradientDuoTone="redToYellow" onClick={() => setAddUserFormOpen(true)}>
            {tCommon("addButton")}
          </Button>
        </div>

        {users.map((item) => (
          <Card
            key={item.id}
            className="flex flex-wrap justify-between gap-6 overflow-hidden [&>div]:max-w-full [&>div]:overflow-hidden"
          >
            <div className="max-w-full truncate font-bold">{t("id", { id: item.id })}</div>
            {modes[item.id] === "edit" ? (
              <EditUserForm user={item} onCancelClick={onCancelClick} onAfterSubmit={onAfterEdit} />
            ) : (
              <ViewUser
                user={item}
                onEditClick={onEditUserClick}
                onDeleteUserClick={setUserToDelete}
                onResetPasswordClick={setUserToResetPassword}
              />
            )}
          </Card>
        ))}
      </div>

      <AddUserForm show={addUserFormOpen} onClose={() => setAddUserFormOpen(false)} onAfterSubmit={refresh} />

      <Modal show={!!userToDelete} onClose={() => setUserToDelete(undefined)}>
        <Modal.Header>{t("deleteUserConfirmationHeader")}</Modal.Header>
        <Modal.Body>{t("deleteUserConfirmationText", { user: userToDelete?.name || userToDelete?.login })}</Modal.Body>

        <Modal.Footer className="justify-end">
          <Button type="button" gradientDuoTone="redToYellow" outline onClick={() => setUserToDelete(undefined)}>
            {tCommon("cancelButton")}
          </Button>
          <Button type="button" gradientDuoTone="redToYellow" onClick={onDeleteUser}>
            {tCommon("deleteButton")}
          </Button>
        </Modal.Footer>
      </Modal>

      <ResetPasswordForm userToResetPassword={userToResetPassword} onClose={() => setUserToResetPassword(undefined)} />
    </>
  );
};
