// function InputFields({
//   label,
//   placeholder,
//   type,
//   isSelect = false,
//   isMultiSelect = false,
//   options = [],
//   error,
//   touched,
//   value,
//   onChange,
//   ...props
// }) {
//   const handleMultiSelectChange = (selectedValue) => {
//     if (!isMultiSelect) return;
    
//     const currentValues = Array.isArray(value) ? value : [];
//     const optionLabel = options.find(opt => opt.value === selectedValue)?.label;
    
//     if (currentValues.includes(optionLabel)) {
//       // Remove if already selected
//       const updatedValues = currentValues.filter(val => val !== optionLabel);
//       onChange({ target: { name: props.name, value: updatedValues } });
//     } else {
//       // Add if not selected
//       const updatedValues = [...currentValues, optionLabel];
//       onChange({ target: { name: props.name, value: updatedValues } });
//     }
//   };

//   return (
//     <div className="relative mb-3 w-full">
//       {isSelect ? (
//         <div className="relative">
//           <select
//             className={`w-full px-3 py-3 border rounded-md appearance-none focus:outline-none ${
//               touched && error
//                 ? "border-red-500 "
//                 : "border-[#A4A5AB33] "
//             }`}
//             value={isMultiSelect ? "" : value}
//             onChange={isMultiSelect ? 
//               (e) => handleMultiSelectChange(e.target.value) : 
//               onChange
//             }
//             {...(isMultiSelect ? {} : props)}
//           >
//             {placeholder && <option value="">{placeholder}</option>}
//             {options.map((option) => (
//               <option key={option.value} value={option.value}>
//                 {option.label}
//               </option>
//             ))}
//           </select>
//           <div className="absolute inset-y-0 right-3 flex items-center">
//             <svg
//               className="w-4 h-4 text-gray-700"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M19 9l-7 7-7-7"
//               />
//             </svg>
//           </div>
//         </div>
//       ) : (
//         <input
//           type={type}
//           className={`w-full px-3 py-3 border rounded-md peer focus:outline-none text-md ${
//             touched && error
//               ? "border-red-500 "
//               : "border-[#A4A5AB33] "
//           }`}
//           placeholder={placeholder || " "}
//           style={{ fontSize: '0.87rem' }}
//           {...props}
//         />
//       )}
//       <label
//         className={`absolute left-3 -top-2.5 px-1 text-sm lexend font-light bg-white transition-all duration-200 ${
//           touched && error
//             ? "text-red-500"
//             : "text-[#A4A5AB] peer-focus:-top-2.5"
//         }`}
//       >
//         {label}
//       </label>
//       {touched && error && (
//         <p className="text-red-500 text-xs mt-1 ">{error}</p>
//       )}
//     </div>
//   );
// }

// export default InputFields;



function InputFields({
  label,
  placeholder,
  type,
  isSelect = false,
  isMultiSelect = false,
  options = [],
  error,
  touched,
  value,
  onChange,
  textarea = false,   // <-- NEW
  rows = 4, 
  ...props
}) {
  const handleMultiSelectChange = (selectedValue) => {
    if (!isMultiSelect) return;
    
    const currentValues = Array.isArray(value) ? value : [];
    const optionLabel = options.find(opt => opt.value === selectedValue)?.label;
    
    if (currentValues.includes(optionLabel)) {
      const updatedValues = currentValues.filter(val => val !== optionLabel);
      onChange({ target: { name: props.name, value: updatedValues } });
    } else {
      const updatedValues = [...currentValues, optionLabel];
      onChange({ target: { name: props.name, value: updatedValues } });
    }
  };

  const handleInputChange = (e) => {
    const { value } = e.target;
    // Convert to number for number type inputs, otherwise keep as string
    const newValue = type === "number" ? (value === "" ? "" : Number(value)) : value;
    onChange({
      target: {
        name: props.name,
        value: newValue,
      },
    });
  };

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
            value={isMultiSelect ? "" : value}
            onChange={isMultiSelect ? 
              (e) => handleMultiSelectChange(e.target.value) : 
              handleInputChange
            }
            {...(isMultiSelect ? {} : props)}
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
      ) : textarea ? (
        <textarea
          rows={rows}
          className={`w-full px-3 py-3 border rounded-md peer focus:outline-none text-md ${
            touched && error ? "border-red-500" : "border-[#A4A5AB33]"
          }`}
          placeholder={placeholder || " "}
          value={value}
          onChange={handleInputChange}
          {...props}
        />
      )
      :
      (
        <input
          type={type}
          className={`w-full px-3 py-3 border rounded-md peer focus:outline-none text-md ${
            touched && error
              ? "border-red-500 "
              : "border-[#A4A5AB33] "
          }`}
          placeholder={placeholder || " "}
          style={{ fontSize: '0.87rem' }}
          value={value}
          onChange={handleInputChange}
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