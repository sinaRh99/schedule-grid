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
        dsdsd
      </Modal>
    </div>
  );
}
