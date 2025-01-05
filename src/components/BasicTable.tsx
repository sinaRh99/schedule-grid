import { useMemo } from 'react';
import { ActivitiesMap, Activity } from '../types';
import ActivitiesBlock from './ActivitiesBlock';

interface PropTypes {
  startDate: Date;
  activities: Activity[];
}

export default function BasicTable({ startDate, activities }: PropTypes) {
  // console.log('🚀 ~ BasicTable ~ activities:', activities);
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

    return hours;
  }, [weekdays, activitiesMap]);

  return (
    <div className="relative overflow-x-auto h-full">
      <table className="w-full h-full text-sm text-right text-slate-700">
        <thead className="text-xs text-slate-50 bg-slate-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 border-l border-l-slate-950 w-5"
            >
              ساعت
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
