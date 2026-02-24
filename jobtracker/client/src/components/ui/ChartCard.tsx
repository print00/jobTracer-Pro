import type { ReactNode } from 'react';
import { Card } from './Card';

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export const ChartCard = ({ title, subtitle, children }: Props) => (
  <Card className="h-[23rem]">
    <div className="mb-4">
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      {subtitle ? <p className="text-sm text-textMuted">{subtitle}</p> : null}
    </div>
    <div className="h-[17rem]">{children}</div>
  </Card>
);
