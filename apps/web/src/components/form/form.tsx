// /* eslint-disable @typescript-eslint/no-explicit-any */
import classNames from 'classnames'
import {
  ComponentProps,
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  Ref,
  useCallback,
  useEffect,
} from 'react'
import {
  Controller,
  FieldPath,
  FieldValues,
  FormProvider,
  RegisterOptions,
  SubmitHandler,
  useForm,
  useFormContext,
  UseFormRegisterReturn,
  UseFormReturn,
} from 'react-hook-form'
// import { formatError } from "~/utils/form";
import superjson from 'superjson'
import toast from 'react-hot-toast'
import { z } from 'zod'
import useSWR, { mutate } from 'swr'
import { fetcher } from '~/utils/api'
import { zodResolver } from '@hookform/resolvers/zod'

export interface FormBlockProps {
  label?: string
  description?: string
  withAsterisk?: boolean
  className?: string
  name?: string
  error?: string
  children?: ReactNode
  customLabel?: any
}
// export const FormBlock = ({
//   label,
//   customLabel: CustomLabel,
//   description,
//   withAsterisk,
//   name,
//   error,
//   className,
//   children,
// }: FormBlockProps) => {
//   return (
//     <div className={classNames("w-56", className)}>
//       {label &&
//         (CustomLabel ? (
//           <CustomLabel
//             htmlFor={name}
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {label}
//           </CustomLabel>
//         ) : (
//           <label
//             htmlFor={name}
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {label}
//           </label>
//         ))}
//       {children}
//       {error && <div className="text-red-500 text-sm mt-1">{error}</div>}
//     </div>
//   );
// };

// export const formBlockPropsRemover = <T,>(
//   props: T & Partial<FormBlockProps>
// ) => {
//   const {
//     label: _label,
//     description: _description,
//     withAsterisk: _withAsterisk,
//     className: _className,
//     name: _name,
//     error: _error,
//     children: _children,
//     ...otherProps
//   } = props;
//   return otherProps;
// };

// type UseFormRegisterOption<
//   TFieldValues extends FieldValues,
//   TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// > = RegisterOptions<TFieldValues, TFieldName> &
//   Partial<{
//     customLabel: string;
//   }>;

// export declare type UseFormRegister<TFieldValues extends FieldValues> = <
//   TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
// >(
//   name: TFieldName,
//   options?: UseFormRegisterOption<TFieldValues, TFieldName>
// ) => UseFormRegisterReturn<TFieldName> & {
//   error: string;
//   withAsterisk: boolean;
// };

// type FormProps<TSchema extends z.ZodType<any, any>> = {
//   onSubmit?: SubmitHandler<z.infer<TSchema>>;
//   children: (
//     methods: UseFormReturn<z.infer<TSchema>> & {
//       registerForm: UseFormRegister<z.infer<TSchema>>;
//     }
//   ) => React.ReactNode;
//   url?: string;
//   method?: string;
//   onSuccess?: () => void;
//   schema?: TSchema;
//   getInitialValues?: boolean;
// };

// export const Form = <TSchema extends z.ZodType<any, any, any>>({
//   onSubmit,
//   children,
//   method = "POST",
//   url,
//   onSuccess,
//   schema,
//   getInitialValues = false,
// }: FormProps<TSchema>) => {
//   const resultURL = getInitialValues ? url : null;

//   const { data, error } = useSWR(resultURL, fetcher);
//   const methods = useForm<z.infer<TSchema>>({
//     mode: "onChange",
//     resolver: schema ? zodResolver(schema) : undefined,
//     defaultValues: data,
//   });

//   useEffect(() => {
//     if (!error && data) {
//       methods.reset(data);
//     }
//   }, [error, data, methods]);

//   const { errors } = methods.formState;
//   const registerFormValue = useCallback(
//     (name: string, options: UseFormRegisterOption<z.infer<TSchema>, any>) => {
//       return {
//         error: formatError(errors, name as any, options.customLabel),
//         withAsterisk: !!options.required,
//       };
//     },
//     [errors]
//   );

//   const registerForm: UseFormRegister<z.infer<TSchema>> = (name, options) => {
//     return {
//       ...methods.register(name, options),
//       ...registerFormValue(name, options as any),
//     };
//   };

//   const onSubmitRequest = async (data: z.infer<TSchema>) => {
//     let toastId;
//     if (typeof onSuccess !== "function")
//       toastId = toast.loading("요청을 전송 중입니다");
//     try {
//       const res = await fetch(url!, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         ...(data ? { body: superjson.stringify(data) } : {}),
//         method,
//       });
//       if (res.status > 210) throw new Error("Error");

//       if (typeof onSuccess === "function") onSuccess();
//       else {
//         toast.success("성공적으로 전송되었습니다.", { id: toastId });
//       }
//       methods.reset({ ...data });
//       mutate({ ...data });
//     } catch (e) {
//       toast.error("요청중 에러가 발생하였습니다.", { id: toastId });
//       console.error(e);
//     }
//   };

//   if (!url && !onSubmit) {
//     throw new Error("onSubmit or url should be provided");
//   }

//   return (
//     <FormProvider {...methods}>
//       <form
//         onSubmit={
//           url
//             ? methods.handleSubmit(onSubmitRequest)
//             : methods.handleSubmit(onSubmit!)
//         }
//         className="flex flex-col gap-y-3"
//       >
//         {!resultURL || data || error
//           ? children({ ...methods, registerForm })
//           : "Loading"}
//       </form>
//     </FormProvider>
//   );
// };

// export type ControllerRender = Parameters<
//   ComponentProps<typeof Controller>["render"]
// >[0];

// export type FormFieldProps<
//   T extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>
// > = ComponentProps<T> & {
//   name: string;
// };

// interface FormFieldBuilderProps {
//   name: string;
//   children: (data: ControllerRender & { error?: string }) => ReactElement;
// }

// export const FormFieldBuilder = ({ name, children }: FormFieldBuilderProps) => {
//   const {
//     control,
//     formState: { errors },
//   } = useFormContext();

//   const error = formatError(errors, name);

//   return (
//     <Controller
//       name={name}
//       control={control}
//       render={(props) => <>{children({ ...props, error })}</>}
//     />
//   );
// };
