import type { ReactNode } from "react";

export type errorPropsType = {
  statusCode: "404" | "500";
  title?: string;
  description?: string;
  children?: ReactNode;
  buttonText?: string;
  onButtonClick?: () => void;
  showReportButton?: boolean;
  reportButtonText?: string;
  onReportClick?: () => void;
};
