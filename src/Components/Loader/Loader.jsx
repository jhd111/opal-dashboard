// src/components/Spinner.jsx
import React from 'react'

export default function Spinner() {
    return (
        <div className=" flex flex-col justify-center items-center h-full">
        <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
          <div
            className="animate-spin inline-block h-14 w-14 border-4 border-current border-t-transparent text-gray-600 rounded-full "
            // role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
      )
}
