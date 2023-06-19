// libs
import { useState } from "preact/hooks";

// types
import type { JSX } from "preact/jsx-runtime";

interface FilterProps {
  buttonTitle: string;
  filterTitle: string;
  values: string[];
  selectedValues: string[];
  handleFilterChange: (selectedValues: string[]) => void;
}

export const Filter = ({
  buttonTitle,
  filterTitle,
  values,
  selectedValues,
  handleFilterChange,
}: FilterProps): JSX.Element => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative">
      <button
        className={`text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800`}
        type="button"
        onClick={toggleDropdown}
      >
        {buttonTitle}
        <svg
          className="w-4 h-4 ml-2"
          aria-hidden="true"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          ></path>
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-56 p-3 bg-white rounded-lg shadow dark:bg-gray-700">
          <h6 className="mb-3 text-sm font-medium text-gray-900 dark:text-white">
            {filterTitle}
          </h6>

          <ul className="space-y-2 text-sm" aria-labelledby="dropdownDefault">
            {values.map((value) => (
              <li className="flex items-center" key={value}>
                <input
                  id={value}
                  type="checkbox"
                  value={value}
                  className="w-4 h-4 bg-gray-100 border-gray-300 rounded text-primary-600 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                  onChange={(e) => {
                    const tempValue = e.target.checked
                      ? [...selectedValues, value]
                      : selectedValues.filter((item) => item !== value);
                    handleFilterChange(tempValue);
                  }}
                />

                <label
                  htmlFor={value}
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-100"
                >
                  {value}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
