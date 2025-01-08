"use client";

import { PrismaTypes } from "@/prisma/types";
import { Button, Card, Modal } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC, useCallback, useState } from "react";
import { AddEditSRTForm } from "./components/AddEditSRTForm";
import { SRT_FORM_ID } from "./constants";
import { useRouter } from "next/navigation";
import { ViewSRT } from "./components/ViewSRT";
import { toast } from "react-toastify";
import { deleteSRT } from "@/utils/api";

interface SRTManagementProps {
  teams: PrismaTypes.SearchRescueTeam[];
}

export const SRTManagement: FC<SRTManagementProps> = ({ teams }) => {
  const t = useTranslations("teamMgmtForm");
  const tCommon = useTranslations("common");
  const [addSRTFormOpened, setAddSRTFormOpened] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [teamToDelete, setTeamToDelete] = useState<PrismaTypes.SearchRescueTeam>();
  const { refresh } = useRouter();

  const [modes, setModes] = useState<Record<string, "view" | "edit">>(
    Object.fromEntries(teams.map((item) => [item.id, "view"])),
  );

  const onEditClick = useCallback((teamId: string) => {
    setModes((prev) => ({ ...prev, [teamId]: "edit" }));
  }, []);

  const onCancelClick = useCallback((teamId?: string) => {
    if (teamId !== undefined) {
      setModes((prev) => ({ ...prev, [teamId]: "view" }));
    }
  }, []);

  const onDelete = useCallback(async () => {
    if (!teamToDelete) return;

    try {
      await deleteSRT(teamToDelete.id);
      setTeamToDelete(undefined);
      refresh();
    } catch (e: unknown) {
      toast.error(tCommon("unknownErrorMessage"));
    }
  }, [refresh, tCommon, teamToDelete]);

  const closeAddSRTForm = useCallback(() => setAddSRTFormOpened(false), []);

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-start justify-between gap-6 pb-6">
          <h1 className="text-4xl font-bold">{t("title")}</h1>
          <Button type="button" gradientDuoTone="redToYellow" onClick={() => setAddSRTFormOpened(true)}>
            {tCommon("addButton")}
          </Button>
        </div>

        {teams.map((item) => (
          <Card key={item.id}>
            <div className="max-w-full truncate font-bold">{t("id", { id: item.id })}</div>
            {modes[item.id] === "edit" ? (
              <></>
            ) : (
              <ViewSRT srt={item} onDeleteClick={setTeamToDelete} onEditClick={onEditClick} />
            )}
          </Card>
        ))}
      </div>

      <Modal show={!!teamToDelete} onClose={() => setTeamToDelete(undefined)}>
        <Modal.Header>{t("deleteTeamConfirmationHeader")}</Modal.Header>
        <Modal.Body>{t("deleteTeamConfirmationText", { srt: teamToDelete?.name })}</Modal.Body>

        <Modal.Footer className="justify-end">
          <Button type="button" gradientDuoTone="redToYellow" outline onClick={() => setTeamToDelete(undefined)}>
            {tCommon("cancelButton")}
          </Button>
          <Button type="button" gradientDuoTone="redToYellow" onClick={onDelete}>
            {tCommon("deleteButton")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={addSRTFormOpened} onClose={closeAddSRTForm}>
        <Modal.Header>{t("addSRTFormHeader")}</Modal.Header>

        <Modal.Body>
          <AddEditSRTForm
            onIsSubmitting={setIsAdding}
            onSubmit={() => {
              closeAddSRTForm();
              refresh();
            }}
          />
        </Modal.Body>

        <Modal.Footer className="justify-end">
          <Button type="button" gradientDuoTone="redToYellow" outline onClick={closeAddSRTForm}>
            {tCommon("cancelButton")}
          </Button>
          <Button type="submit" gradientDuoTone="redToYellow" disabled={isAdding} form={SRT_FORM_ID}>
            {tCommon("addButton")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
