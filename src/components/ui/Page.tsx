import React from "react";

interface PageProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({ title, subtitle, children }) => {
  return (
    <div className="page">
      <div className="page-header">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children}
    </div>
  );
};
