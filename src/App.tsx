import { useQuery } from '@tanstack/react-query';
import axios, { AxiosResponse } from 'axios';
import { Activity, ActivityResponse } from './types';
import ActivitiesTable from './components/ActivitiesTable';

const now = new Date();
const today = now.getDay();
const comingSaturday = new Date(now);
comingSaturday.setDate(now.getDate() + ((6 - today + 7) % 7));
comingSaturday.setHours(8, 0, 0, 0); // Start time: 8:00 AM

// Calculate the date for the next Friday
const nextFriday = new Date(comingSaturday);
nextFriday.setDate(comingSaturday.getDate() + 6);
nextFriday.setHours(17, 0, 0, 0); // End time: 5:00 PM

function getRandomDate(start: Date, end: Date) {
  const randomTime =
    start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);
  randomDate.setHours(8 + Math.floor(Math.random() * 16)); // Random hour between 8 and 23
  randomDate.setMinutes(0); // Random minutes
  randomDate.setSeconds(0, 0);
  return randomDate;
}

function App() {
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ['activities'],
    queryFn: () =>
      axios
        .get('https://jsonplaceholder.typicode.com/posts')
        .then((res: AxiosResponse<ActivityResponse[]>) => res.data),
    select: (activities): Activity[] =>
      activities.map(activity => {
        const date = new Date(getRandomDate(comingSaturday, nextFriday));

        return {
          ...activity,
          date,
        };
      }),
  });

  if (isLoading || isFetching)
    return (
      <div className="w-screen h-screen flex items-center justify-center text-lg font-bold">
        درحال دریافت اطلاعات ...
      </div>
    );

  if (error)
    return (
      <div className="w-screen h-screen bg-red-500 flex items-center justify-center text-lg font-bold text-white">
        خطا در دریافت اطالاعات
      </div>
    );

  return (
    <div className="w-screen overflow-x-auto bg-slate-950 h-screen min-h-[800px]">
      {data && <ActivitiesTable startDate={comingSaturday} activities={data} />}
    </div>
  );
}

export default App;
