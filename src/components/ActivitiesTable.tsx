import { useMemo, useState } from 'react';
import { ActivitiesMap, Activity } from '../types';
import ActivitiesBlock from './ActivitiesBlock';

interface PropTypes {
  startDate: Date;
  activities: Activity[];
}

export default function ActivitiesTable({ startDate, activities }: PropTypes) {
  const [sortOption, setSortOption] = useState<'ASC' | 'DESC'>('ASC');

  const weekdays = useMemo(() => {
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(
        new Intl.DateTimeFormat('fa-IR', {
          weekday: 'long',
          day: '2-digit',
          month: 'short',
          calendar: 'persian',
        }).format(currentDate)
      );
    }

    return days;
  }, [startDate]);

  const activitiesMap = useMemo<ActivitiesMap>(() => {
    const activitiesMap: ActivitiesMap = {};

    for (let i = 0; i < activities.length; i++) {
      const { date } = activities[i];
      const hour = date.getHours();
      let day = date.getDay(); // day of the week index, sunday is 0 and saturday is 6
      day = day === 6 ? 0 : day + 1; // adjust so Saturday starts with 0

      if (activitiesMap[hour]) {
        if (activitiesMap[hour][day]) {
          activitiesMap[hour][day].push(activities[i]);
        } else {
          activitiesMap[hour][day] = [activities[i]];
        }
      } else {
        activitiesMap[hour] = { [day]: [activities[i]] };
      }
    }
    return activitiesMap;
  }, [activities]);

  const tableItems = useMemo(() => {
    const hours: { time: number; activities: Activity[][] }[] = [];
    for (let i = 8; i < 24; i++) {
      hours.push({
        time: i,
        activities: weekdays.map((_, j) => activitiesMap[i]?.[j] || []),
      });
    }

    return [...hours].sort((a, b) =>
      sortOption === 'ASC' ? a.time - b.time : b.time - a.time
    );
  }, [weekdays, activitiesMap, sortOption]);

  return (
    <div className="relative overflow-x-auto h-full w-full min-w-[1000px]">
      <table className="w-full h-full text-sm text-right text-slate-700">
        <thead className="text-xs text-slate-50 bg-slate-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 border-l border-l-slate-950 w-5  hover:bg-slate-800 cursor-pointer "
              onClick={() =>
                setSortOption(perv => (perv === 'ASC' ? 'DESC' : 'ASC'))
              }
            >
              <div className="flex gap-4 items-center">
                ساعت
                <SortIcon></SortIcon>
              </div>
            </th>
            {weekdays.map(day => (
              <th key={day} className="px-6 py-3 border-l border-l-slate-950">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-slate-400">
          {tableItems.map((h, i) => (
            <tr key={h.time} className="h-[calc(100%/16)]">
              <td className="text-center">
                {i % 3 === 0 && `${h.time}:00`.padStart(5, '0')}
              </td>
              {h.activities.map((items, j) => (
                <td
                  key={j}
                  scope="col"
                  className={`p-0 border-l border-b border-slate-600`}
                >
                  {items.length > 0 && <ActivitiesBlock activities={items} />}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon() {
  return (
    <svg
      className="w-3 h-3 ms-1.5"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 0 24 24"
      color="#fff"
    >
      <path d="M8.574 11.024h6.852a2.075 2.075 0 0 0 1.847-1.086 1.9 1.9 0 0 0-.11-1.986L13.736 2.9a2.122 2.122 0 0 0-3.472 0L6.837 7.952a1.9 1.9 0 0 0-.11 1.986 2.074 2.074 0 0 0 1.847 1.086Zm6.852 1.952H8.574a2.072 2.072 0 0 0-1.847 1.087 1.9 1.9 0 0 0 .11 1.985l3.426 5.05a2.123 2.123 0 0 0 3.472 0l3.427-5.05a1.9 1.9 0 0 0 .11-1.985 2.074 2.074 0 0 0-1.846-1.087Z" />
    </svg>
  );
}
