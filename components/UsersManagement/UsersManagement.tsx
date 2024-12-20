"use client";

import { UserApiModel } from "@/types/models";
import { FC, useCallback, useState } from "react";
import { AddUserForm } from "./components/AddUserForm";
import { Button, Card, Modal } from "flowbite-react";
import { ViewUser } from "./components/ViewUser";
import { EditUserForm } from "./components/EditUserForm";
import { useTranslations } from "next-intl";

interface UsersManagementProps {
  users: UserApiModel[];
}

export const UsersManagement: FC<UsersManagementProps> = ({ users }) => {
  const t = useTranslations("usersMgmtForm");

  const [addUserFormOpen, setAddUserFormOpen] = useState(false);

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

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex justify-end">
          <Button type="button" gradientDuoTone="redToYellow" onClick={() => setAddUserFormOpen(true)}>
            {t("addButton")}
          </Button>
        </div>

        {users.map((item) => (
          <Card key={item.id} className="flex flex-wrap justify-between gap-6">
            {modes[item.id] === "edit" ? (
              <EditUserForm user={item} onCancelClick={onCancelClick} />
            ) : (
              <ViewUser user={item} onClick={onEditUserClick} />
            )}
          </Card>
        ))}
      </div>

      <AddUserForm show={addUserFormOpen} onClose={() => setAddUserFormOpen(false)} />
    </>
  );
};
