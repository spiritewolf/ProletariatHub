import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { dashboardTheme } from '../dashboardTheme';

type DashboardInlineRouterLinkProps = {
  to: string;
  fontSize: string;
  children: ReactNode;
};

export function DashboardInlineRouterLink({
  to,
  fontSize,
  children,
}: DashboardInlineRouterLinkProps) {
  return (
    <Link
      to={to}
      style={{
        fontSize,
        color: dashboardTheme.title,
        textDecoration: 'none',
      }}
      onMouseEnter={(event) => {
        event.currentTarget.style.textDecoration = 'underline';
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.textDecoration = 'none';
      }}
    >
      {children}
    </Link>
  );
}
