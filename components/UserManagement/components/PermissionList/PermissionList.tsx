"use client";

import { Permission } from "@/types/permissions";
import { Checkbox, Label, Tooltip } from "flowbite-react";
import { useTranslations } from "next-intl";
import { FC } from "react";
import { Control, Controller } from "react-hook-form";
import { AddUserFormData, EditUserFormData, SRTOption } from "../../types";
import Select from "react-select";
import classNames from "classnames";

interface PermissionListProps {
  control: Control<AddUserFormData> | Control<EditUserFormData>;
  srts: SRTOption[];
}

export const PermissionList: FC<PermissionListProps> = ({ control, srts }) => {
  const t = useTranslations("userMgmtForm");
  const tCommon = useTranslations("common");

  return (
    <div className="col-span-2 flex flex-col gap-4">
      {Object.values(Permission)
        .filter((item) => item !== Permission.CanCreateEmployee)
        .map((item) => (
          <Tooltip key={item} content={t(`${item}_tooltip`)}>
            <div className="flex items-center gap-2">
              <Controller
                control={control as Control<AddUserFormData>}
                name={item}
                render={({ field: { value, ...field } }) => (
                  <Checkbox color="yellow" id={item} {...field} checked={value?.allowed || false} />
                )}
              />

              <Label htmlFor={item}>{t(`${item}_label`)}</Label>
            </div>
          </Tooltip>
        ))}

      <Tooltip content={t(`${Permission.CanCreateEmployee}_tooltip`)}>
        <div className="flex items-center gap-2">
          <Controller
            control={control as Control<AddUserFormData>}
            name={Permission.CanCreateEmployee}
            render={({ field: { value, ...field } }) => (
              <Checkbox color="yellow" id={Permission.CanCreateEmployee} {...field} checked={value?.allowed || false} />
            )}
          />

          <Label htmlFor={Permission.CanCreateEmployee}>{t(`${Permission.CanCreateEmployee}_label`)}</Label>
        </div>
      </Tooltip>
      <Controller
        control={control as Control<AddUserFormData>}
        name="srts"
        render={({ field }) => (
          <Select
            {...field}
            className="ml-6 max-w-[300px] text-sm sm:min-w-[300px]"
            classNames={{
              control: () => "dark:bg-gray-800",
              option: (props) => classNames("!text-sm", props.isFocused ? "dark:bg-gray-600" : "dark:bg-gray-700"),
              menu: () => "dark:!bg-gray-700",
            }}
            options={srts}
            getOptionLabel={(opt) => opt.name}
            getOptionValue={(opt) => opt.id}
            isMulti
            placeholder=""
            noOptionsMessage={() => tCommon("noData")}
            menuPortalTarget={document.body}
            closeMenuOnSelect={false}
          />
        )}
      />
    </div>
  );
};
