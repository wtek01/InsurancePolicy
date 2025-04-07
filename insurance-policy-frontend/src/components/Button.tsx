import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "edit" | "delete";
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  ...props
}: ButtonProps) => {
  const baseClass = "button";

  const variantClass =
    variant === "primary"
      ? ""
      : variant === "secondary"
      ? "bg-gray-500"
      : variant === "edit"
      ? "btn-edit"
      : variant === "delete"
      ? "btn-delete"
      : "";

  return (
    <button
      className={`${baseClass} ${variantClass} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
};

export default Button;
