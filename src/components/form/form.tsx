// /* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from "classnames";
import { ReactNode, useCallback } from "react";
import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  SubmitHandler,
  useForm,
  UseFormRegisterReturn,
  UseFormReturn,
} from "react-hook-form";
import { formatError } from "~/utils/form";
import superjson from "superjson";
import toast from "react-hot-toast";

export interface FormBlockProps {
  label?: string;
  description?: string;
  withAsterisk?: boolean;
  className?: string;
  name?: string;
  error?: string;
  children?: ReactNode;
}
export const FormBlock = ({
  label,
  description,
  withAsterisk,
  name,
  error,
  className,
  children,
}: FormBlockProps) => {
  return (
    <div className={classNames(className)}>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      {children}
      {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
    </div>
  );
};

export const formBlockPropsRemover = <T,>(
  props: T & Partial<FormBlockProps>
) => {
  const {
    label: _label,
    description: _description,
    withAsterisk: _withAsterisk,
    className: _className,
    name: _name,
    error: _error,
    children: _children,
    ...otherProps
  } = props;
  return otherProps;
};

type UseFormRegisterOption<
  TFieldValues extends FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = RegisterOptions<TFieldValues, TFieldName> &
  Partial<{
    customClass: string;
  }>;

export declare type UseFormRegister<TFieldValues extends FieldValues> = <
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(
  name: TFieldName,
  options?: UseFormRegisterOption<TFieldValues, TFieldName>
) => UseFormRegisterReturn<TFieldName> & {
  error: string;
  withAsterisk: boolean;
};

type FormProps<TFormValues extends FieldValues> = {
  onSubmit?: SubmitHandler<TFormValues>;
  children: (
    methods: UseFormReturn<TFormValues> & {
      registerForm: UseFormRegister<TFormValues>;
    }
  ) => React.ReactNode;
  url?: string;
  method?: string;
  onSuccess?: () => void;
};

export const Form = <TFormValues extends FieldValues>({
  onSubmit,
  children,
  method = "POST",
  url,
  onSuccess,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({ mode: "onChange" });

  const { errors } = methods.formState;
  const registerFormValue = useCallback(
    (name: string, options: UseFormRegisterOption<TFormValues, any>) => {
      return {
        error: formatError(errors, name as any, options.customClass),
        withAsterisk: !!options.required,
      };
    },
    [errors]
  );

  const registerForm: UseFormRegister<TFormValues> = (name, options) => {
    return {
      ...methods.register(name, options),
      ...registerFormValue(name, options as any),
    };
  };

  const onSubmitRequest = async (data: TFormValues) => {
    try {
      if (typeof onSuccess !== "function")
        toast.loading("요청을 전송 중입니다");
      await fetch(url!, {
        headers: {
          "Content-Type": "application/json",
        },
        ...(data ? { body: superjson.stringify(data) } : {}),
        method,
      });
      if (typeof onSuccess === "function") onSuccess();
      else {
        toast.success("성공적으로 전송되었습니다.");
      }
      methods.reset({ ...data });
    } catch (e) {
      toast.error("요청중 에러가 발생하였습니다.");
      console.error(e);
    }
  };

  if (!url && !onSubmit) {
    throw new Error("onSubmit or url should be provided");
  }

  return (
    <form
      onSubmit={
        url
          ? methods.handleSubmit(onSubmitRequest)
          : methods.handleSubmit(onSubmit!)
      }
    >
      {children({ ...methods, registerForm })}
    </form>
  );
};
