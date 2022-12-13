import { Listbox, Transition } from "@headlessui/react";
import classNames from "classnames";
import { forwardRef, Fragment, useCallback, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  FormBlock,
  FormBlockProps,
  formBlockPropsRemover,
  FormFieldBuilder,
} from "./form";
import { Overwrite } from "~/types/utils";

type Value = string | number | null;
type OptionType = { label: string; value: Value };

export interface SelectProps
  extends Overwrite<
    React.PropsWithoutRef<JSX.IntrinsicElements["div"]>,
    FormBlockProps
  > {
  options: OptionType[];
  value?: Value;
  disabled?: boolean;
}

export const Select = forwardRef<HTMLDivElement, SelectProps>(
  ({ name, options, onChange, ...props }, ref) => {
    const otherProps = formBlockPropsRemover(props);

    const [selected, setSelected] = useState<string | number | null>(
      options[0].value
    );

    const onSelect = useCallback(
      (value: any) => {
        setSelected(value);
        if (typeof onChange === "function") onChange(value);
      },
      [onChange]
    );

    return (
      <Listbox
        as="div"
        value={props.value ?? selected}
        name={name}
        onChange={onSelect}
        {...otherProps}
      >
        {({ open }) => (
          <FormBlock {...props} customLabel={Listbox.Label}>
            <div ref={ref} className="relative">
              <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white border border-gray-300 shadow-sm py-2 pl-3 pr-10 text-left sm:text-sm">
                <span className="block truncate">
                  {
                    options.find((o) => o.value === (props.value ?? selected))
                      ?.label
                  }
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronDownIcon
                    className={classNames(
                      "h-5 w-5 text-gray-400 transition-all duration-300",
                      open && "rotate-180"
                    )}
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="default-border absolute z-[99] mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((option) => (
                    <Listbox.Option
                      key={option.value}
                      className={({ active }) =>
                        classNames(
                          "relative cursor-default select-none py-2 pl-10 pr-4 text-gray-700 hover:text-white transition-colors",
                          active && "bg-primary-500 text-white"
                        )
                      }
                      value={option.value}
                    >
                      {({ selected }) => (
                        <>
                          <span
                            className={classNames(
                              "block truncate",
                              selected ? "font-medium" : "font-normal"
                            )}
                          >
                            {option.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </FormBlock>
        )}
      </Listbox>
    );
  }
);

Select.displayName = "components/Form/Select";

export const SelectField = ({
  name,
  ...props
}: Overwrite<SelectProps, { name: string }>) => {
  return (
    <>
      <FormFieldBuilder name={name}>
        {({ field, error }) => <Select {...props} {...field} error={error} />}
      </FormFieldBuilder>
    </>
  );
};
