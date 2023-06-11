import React from "react";
function SearchInput({
  id,
  onChange = () => {},
  value,
  placeholder,
  ...props
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {placeholder}
      </label>
      <input
        className="appearance-none border rounded-xl w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-opacity-100 focus:ring-blue-500"
        id={id}
        onChange={onChange}
        type="text"
        value={value}
        placeholder={placeholder}
        aria-describedby={`${id}-description`}
        {...props}
      />
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 hidden sm:inline-block absolute text-black  right-3 top-2 z-10"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      </svg>

      <span id={`${id}-description`} className="sr-only">
        {`Enter ${placeholder} here`}
      </span>
    </div>
  );
}

export default SearchInput;
