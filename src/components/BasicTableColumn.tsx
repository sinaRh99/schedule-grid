import { ReactNode } from 'react';

export default function BasicTableColumn({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <td
      scope="col"
      className={`px-6 py-3 border-l border-b border-slate-600 ${className}`}
    >
      {children}
    </td>
  );
}
