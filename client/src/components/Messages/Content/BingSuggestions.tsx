export const BingSuggestionCard = ({ suggestion, onClick }) => (
  <div
    className="no-wrap flex flex-1 transform cursor-pointer items-center rounded-md border border-gray-200 bg-gray-100 px-4 py-2 text-xs shadow-sm transition duration-500 ease-in-out hover:scale-105 hover:bg-gray-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
    onClick={onClick}
  >
    {suggestion}
  </div>
);
