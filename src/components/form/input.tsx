import React, { forwardRef } from "react";
import { Overwrite } from "~/types/utils";
import { FormBlock, FormBlockProps, formBlockPropsRemover } from "./form";

export interface TextFieldProps
  extends Overwrite<
    React.PropsWithoutRef<JSX.IntrinsicElements["input"]>,
    FormBlockProps
  > {
  type?: "text" | "password" | "email" | "number";
}

export const Input = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, type = "text", ...props }, _ref) => {
    const inputProps = formBlockPropsRemover(props);

    return (
      <FormBlock {...props} name={name}>
        <input type={type} className={props.className} {...inputProps} />
      </FormBlock>
    );
  }
);

Input.displayName = "components/Form/Input";
