function InputFields({
    label,
    placeholder,
    type,
    isSelect = false,
    options = [],
    error,
    touched,
    ...props
  }) {
    return (
      <div className="relative mb-3 w-full">
        {isSelect ? (
          <div className="relative">
            <select
              className={`w-full px-3 py-3 border rounded-md appearance-none focus:outline-none ${
                touched && error
                  ? "border-red-500 "
                  : "border-[#A4A5AB33] "
              }`}
              {...props}
            >
              {placeholder && <option value="">{placeholder}</option>}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center">
              <svg
                className="w-4 h-4 text-gray-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        ) : (
          <input
            type={type}
            className={`w-full px-3 py-3 border rounded-md peer focus:outline-none text-md ${
              touched && error
                ? "border-red-500 "
                : "border-[#A4A5AB33] "
            }`}
            placeholder={placeholder || " "}
            style={{ fontSize: '0.87rem' }} // Tailwind's text-xs
            {...props}
          />
        )}
        <label
          className={`absolute left-3 -top-2.5 px-1 text-sm lexend font-light bg-white transition-all duration-200 ${
            touched && error
              ? "text-red-500"
              : "text-[#A4A5AB] peer-focus:-top-2.5"
          }`}
        >
          {label}
        </label>
        {touched && error && (
          <p className="text-red-500 text-xs mt-1 ">{error}</p>
        )}
      </div>
    );
  }
  
  export default InputFields;
  