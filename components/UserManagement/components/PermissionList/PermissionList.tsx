import { Permission } from "@/types/permissions";
import { Checkbox, Label } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { AddUserFormData, EditUserFormData } from "../../types";

interface PermissionListProps {
  control: Control<AddUserFormData> | Control<EditUserFormData>;
}

export const PermissionList: FC<PermissionListProps> = ({ control }) => {
  const t = useTranslations("userMgmtForm");

  return (
    <div className="col-span-2 flex flex-wrap gap-4">
      {Object.values(Permission).map((item) => (
        <div key={item} className="flex items-center gap-2">
          <Controller
            control={control as Control<AddUserFormData>}
            name={item}
            render={({ field: { value, ...field } }) => (
              <Checkbox color="yellow" id={item} {...field} checked={value} />
            )}
          />

          <Label htmlFor={item}>{t(`${item}_label`)}</Label>
        </div>
      ))}
    </div>
  );
};
