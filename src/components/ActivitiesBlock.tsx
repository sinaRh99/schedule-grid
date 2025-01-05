import { useMemo, useState } from 'react';
import { Activity } from '../types';
import Modal from './Modal';

interface PropTypes {
  activities: Activity[];
}

export default function ActivitiesBlock({ activities }: PropTypes) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activityTitle = useMemo(() => {
    // Check if the string is longer than 15 characters
    const title = activities[0].title;
    if (title.length > 15) {
      return title.slice(0, 12) + '...';
    }
    return title;
  }, [activities]);

  const dateTimeFormatter = new Intl.DateTimeFormat('fa-IR', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    calendar: 'persian',
  });

  return (
    <div
      className="w-full h-full bg-sky-600 hover:bg-sky-800 text-black font-medium flex items-center justify-center cursor-pointer relative"
      onClick={() => setIsModalOpen(true)}
    >
      {activityTitle}
      {activities.length > 1 && (
        <div className="absolute bottom-0 left-0 text-xs text-slate-950 p-2">
          + {activities.length - 1}
        </div>
      )}
      <Modal onClose={() => setIsModalOpen(false)} isOpen={isModalOpen}>
        <div className="text-sky-600 text-4xl">
          {dateTimeFormatter.format(activities[0].date)}
        </div>
        {activities.map(activity => (
          <div
            key={activity.id}
            className="p-4 mt-8 border-t border-dashed border-slate-500"
          >
            <div className="font-bold text-lg mb-2">{activity.title}</div>
            <div>{activity.body}</div>
          </div>
        ))}
      </Modal>
    </div>
  );
}
