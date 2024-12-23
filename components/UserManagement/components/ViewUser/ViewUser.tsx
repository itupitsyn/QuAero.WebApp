"use client";

import { UserApiModel } from "@/types/models";
import { Button, Tooltip } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { TbEdit, TbRestore, TbTrash } from "react-icons/tb";

interface ViewUserProps {
  user: UserApiModel;
  onClick: (userId: string) => void;
  onDeleteUserClick: (user: UserApiModel) => void;
  onResetPasswordClick: (user: UserApiModel) => void;
}

export const ViewUser: FC<ViewUserProps> = ({ user, onClick, onDeleteUserClick, onResetPasswordClick }) => {
  const t = useTranslations("userMgmtForm");

  return (
    <div className="flex grow flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-end opacity-60">{t("login")}</div>
          <div>{user.login}</div>
          <div className="text-end opacity-60">{t("name")}</div>
          <div>{user.name || "—"}</div>
        </div>
        <div className="flex gap-2">
          <Button gradientDuoTone="redToYellow" outline size="xs" onClick={() => onClick(user.id)}>
            <TbEdit />
          </Button>
          <Button gradientDuoTone="redToYellow" outline size="xs" onClick={() => onDeleteUserClick(user)}>
            <TbTrash />
          </Button>
          <Button gradientDuoTone="redToYellow" outline size="xs" onClick={() => onResetPasswordClick(user)}>
            <TbRestore />
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-x-2">
        {Object.entries(user.permissions)
          .filter(([_, allowed]) => allowed)
          .map(([permission]) => (
            <Tooltip key={permission} content={t(`${permission}_tooltip`)}>
              <span className="text-xs text-lime-500">{t(`${permission}_label`)}</span>
            </Tooltip>
          ))}
      </div>
    </div>
  );
};
