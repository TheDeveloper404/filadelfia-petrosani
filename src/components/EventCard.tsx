import { formatEventDateRange } from '@/utils/date';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  endDate: string | null;
  time: string | null;
  description: string;
  isLive?: boolean;
  isToday?: boolean;
}

export default function EventCard({ title, date, endDate, time, description, isLive, isToday }: EventCardProps) {
  const dateDisplay = formatEventDateRange(date, endDate);

  return (
    <div className={`px-3 py-4 ${isToday ? 'rounded-2xl bg-secondary/10' : ''}`}>
      <div className="space-y-2">
        <p className="text-[0.65rem] font-bold uppercase tracking-[0.18em] text-secondary">
          {dateDisplay}
        </p>
        {time && (
          <p className="text-xs font-semibold text-slate-400">{time}</p>
        )}
        {isLive && isToday && (
          <p className="flex items-center gap-1.5 text-[0.65rem] font-bold uppercase tracking-widest text-secondary">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shrink-0" />
            live
          </p>
        )}
        <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );
}
