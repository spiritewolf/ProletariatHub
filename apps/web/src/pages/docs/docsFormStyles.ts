import { dashboardTheme } from '../../dashboard/dashboardTheme';

export const docsFieldLabelProps = {
  fontSize: '8px',
  color: dashboardTheme.meta,
  fontWeight: 'semibold' as const,
  mb: 0.5,
};

export const docsInputStyles = {
  bg: 'white',
  borderColor: dashboardTheme.cardBorder,
  color: dashboardTheme.text,
  fontSize: 'sm',
  _focusVisible: { borderColor: dashboardTheme.title },
};
