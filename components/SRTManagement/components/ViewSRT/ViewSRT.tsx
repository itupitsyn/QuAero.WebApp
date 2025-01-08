import { PrismaTypes } from "@/prisma/types";
import { Button } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { TbEdit, TbTrash } from "react-icons/tb";

interface ViewSRTProps {
  srt: PrismaTypes.SearchRescueTeam;
  onEditClick: (userId: string) => void;
  onDeleteClick: (user: PrismaTypes.SearchRescueTeam) => void;
}

export const ViewSRT: FC<ViewSRTProps> = ({ srt, onEditClick, onDeleteClick }) => {
  return (
    <div className="flex flex-wrap justify-between gap-6">
      <span>{srt.name}</span>
      <div className="flex gap-2">
        <Button gradientDuoTone="redToYellow" outline size="xs" onClick={() => onEditClick(srt.id)}>
          <TbEdit />
        </Button>
        <Button gradientDuoTone="redToYellow" outline size="xs" onClick={() => onDeleteClick(srt)}>
          <TbTrash />
        </Button>
      </div>
    </div>
  );
};
