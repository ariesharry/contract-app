"use client";

import React, { use, useEffect, useState } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import Select from "react-select";

export type SelectValue = {
  value: string;
  label?: string;
};

interface SelectProps {
  id: string;
  label: string;
  value?: SelectValue;
  register: UseFormRegister<FieldValues>;
  onChange: (value: string) => void;
  errors: FieldErrors;
}

const CountrySelect: React.FC<SelectProps> = ({
  id,
  label,
  register,
  value,
  onChange,
  errors,
}) => {
  const [options, setOptions] = useState<SelectValue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/getUserByRole"); // Update with your actual API path
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();

        // Map the response data to Select options
        const mappedOptions = data.map((user: { id: object; email: string; name: string }) => ({
          id: user.id,
          value: user.email,
          label: user.name,
        }));

        setOptions(mappedOptions);
      } catch (error) {
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }
  return (
    <div className="relative flex flex-col w-full gap-y-2.5">
      <label
        className={`
            text-xs font-medium leading-4 text-[#7E88C3] dark:text-[#DFE3FA]
            ${errors[id] && "text-[#EC5757] dark:text-[#EC5757]"}
        `}
      >
        {label}
      </label>
      <Select
        instanceId={id}
        {...register(id, {
          required: {
            value: true,
            message: "can't be empty",
          },
        })}
        placeholder="Select"
        isClearable
        options={options}
        value={value}
        onChange={(value) => onChange(value as string)}
        formatOptionLabel={(option: any) => <span>{option.label}</span>}
        className={`${errors[id] && "react-select-error"}`}
        classNamePrefix="react-select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            borderRadius: "4px",
            borderWidth: "1px",
            primary: "#7C5DFA",
            primary25: "transparent",
          },
        })}
      />
      {errors[id] && (
        <span className="absolute top-0 right-0 text-[7px] font-medium text-[#EC5757] lowercase max-w-[40px]">
          {errors[id]?.message as string}
        </span>
      )}
    </div>
  );
};

export default CountrySelect;
