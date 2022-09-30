import { FieldValues, FieldErrorsImpl } from "react-hook-form";

export const formatError = <FormValues extends FieldValues>(
  error: FieldErrorsImpl<FormValues>,
  name: keyof FormValues,
  customName?: string
): string => {
  const err = error[name];
  if (!err) return "";
  const label = customName ?? (name as string);
  switch (err.type) {
    case "required":
      return `${label}은 필수입니다.`;
    default:
      return err.type as string;
  }
};
