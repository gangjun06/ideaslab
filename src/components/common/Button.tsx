import classNames from "classnames";
import Link from "next/link";
import { forwardRef, ReactNode } from "react";
import { Overwrite } from "types/utils";

interface ButtonBase {
  children: ReactNode;
  color?: "primary" | "default" | "success" | "danger";
  variant?: "filled" | "subtle";
  className?: string;
  primary?: boolean;
  size?: "sm" | "full";
}

const buttonProps = ({ className, color, variant }: Partial<ButtonBase>) => {
  return {
    className: classNames(className, "btn", {
      "bg-primary-500 text-white hover:bg-primary-600 border-transparent":
        color === "primary",
      "bg-emerald-400": color === "success",
      "bg-pink-400": color === "danger",
      "bg-white text-gray-700 border-gray-300 hover:bg-gray-50":
        color === "default",
      //       subtle: variant === "subtle",
    }),
  };
};

type ButtonProps = Overwrite<
  React.PropsWithoutRef<JSX.IntrinsicElements["button"]>,
  ButtonBase
>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = "default",
      primary,
      size,
      variant = "filled",
      className,
      children,
      ...props
    },
    ref
  ) => {
    if (primary) color = "primary";

    return (
      <span>
        <button
          ref={ref}
          {...props}
          {...buttonProps({ size, variant, className, color })}
        >
          {children}
        </button>
      </span>
    );
  }
);

Button.displayName = "components/Common/Button";

interface ButtonLinkProps
  extends Overwrite<
    React.PropsWithoutRef<JSX.IntrinsicElements["a"]>,
    ButtonBase
  > {
  href: string;
}

export const ButtonLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      color = "default",
      primary,
      size,
      variant = "filled",
      className,
      children,
      href,
      ...props
    },
    ref
  ) => {
    if (primary) {
      color = "primary";
    }

    return (
      <Link href={href} passHref>
        <a
          ref={ref}
          {...props}
          {...buttonProps({ size, variant, className, color })}
        >
          {children}
        </a>
      </Link>
    );
  }
);

ButtonLink.displayName = "components/Common/ButtonLink";
