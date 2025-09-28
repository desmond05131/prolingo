import "../styles/LoadingIndicator.css";

const sizeToClass = (size) => {
  // Accept numbers or short tokens
  const token = String(size);
  switch (token) {
    case "4":
    case "sm":
      return "h-4 w-4";
    case "5":
    case "md":
      return "h-5 w-5";
    case "8":
    case "lg":
      return "h-8 w-8";
    case "12":
    case "xl":
      return "h-12 w-12";
    case "16":
    case "2xl":
      return "h-16 w-16";
    default:
      return "h-5 w-5";
  }
};

const LoadingIndicator = ({ size = "5", className = "" }) => {
  const sz = sizeToClass(size);
  return (
    <span className={`inline-flex items-center justify-center ${sz} ${className}`}>
      <svg
        className={`${sz} animate-spin opacity-80`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        ></path>
      </svg>
    </span>
  );
};

export default LoadingIndicator;