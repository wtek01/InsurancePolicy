import { ReactNode } from "react";

interface AlertProps {
  type: "error" | "success" | "info";
  children: ReactNode;
}

const Alert = ({ type, children }: AlertProps) => {
  const className =
    type === "error" ? "error" : type === "success" ? "success" : "info";

  return <div className={className}>{children}</div>;
};

export default Alert;
