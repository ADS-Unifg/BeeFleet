import React from "react";
import Icon from "./Icon";

const InputText = ({ placeholder, className, name, type, variant, icon, value, onChange, autoComplete, strokeWidth }) => {
   return (
      <div className="relative">
         {variant === "withIcon" && icon && (
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
               <Icon name={icon} strokeWidth={strokeWidth} className="w-4 h-4 text-gray-900 dark:text-white " />
            </span>
         )}
         <input
            type={type}
            placeholder={placeholder}
            className={`bg-white border rounded-lg outline-0 font-normal border-bee-dark-300 text-bee-dark-600 text-md block w-full p-2.5 dark:bg-gray-800 dark:border-gray-500 dark:placeholder:text-gray-400 dark:text-white dark:focus:ring-bee-purple-400 dark:focus:border-bee-purple-400 autofill:bg-white dark:autofill:bg-bee-dark-800 dark:autofill:text-white ${
               variant === "withIcon" ? "pl-10" : ""
            } ${className}`}
            name={name}
            value={value}
            onChange={onChange}
            autoComplete={autoComplete}
         />
      </div>
   );
};

export default InputText;
