// Button is used via declared props only; no style overrides permitted.

import { Button } from './button-component';

type CardIntent = 'default' | 'featured' | 'muted';

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

interface CardProps {
  intent: CardIntent;
  header: CardHeaderProps;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
}

const intentStyles: Record<CardIntent, string> = {
  default: 'bg-white border border-gray-200',
  featured: 'bg-blue-50 border border-blue-300 shadow-md',
  muted: 'bg-gray-50 border border-gray-100',
};

function CardHeader({ title, subtitle }: CardHeaderProps) {
  return (
    <div className="px-5 pt-5 pb-3">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );
}

function CardBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 pb-4 text-sm text-gray-700 leading-relaxed">
      {children}
    </div>
  );
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 pb-5 pt-2 border-t border-gray-100">
      {children}
    </div>
  );
}

export function Card({ intent, header, body, actionLabel, onAction }: CardProps) {
  return (
    <div className={`rounded-xl overflow-hidden ${intentStyles[intent]}`}>
      <CardHeader title={header.title} subtitle={header.subtitle} />
      <CardBody>{body}</CardBody>
      {actionLabel && onAction && (
        <CardFooter>
          <Button
            variant={intent === 'featured' ? 'primary' : 'secondary'}
            size="sm"
            label={actionLabel}
            onClick={onAction}
          />
        </CardFooter>
      )}
    </div>
  );
}
