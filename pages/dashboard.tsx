import { useEffect, useState } from 'react';
import axios from 'axios';
import { StarIcon as StarSolid } from '@heroicons/react/solid';
import { StarIcon as StarOutline } from '@heroicons/react/outline';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import { API_URL } from '@/utils/constants';

type Content = {
  id: number;
  title: string;
  description: string;
  scores_stat: {
    mean_scores: number | null;
    sum_scores: number | null;
  };
  user_score: number | null;
};

const Dashboard = () => {
  const token = useSelector((state: RootState) => state.user.access);
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/content/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContents(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleStarClick = async (content: number, score: number) => {
    try {
      await axios.post(
        `${API_URL}/content/score/`,
        { content, score },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Update the local state to reflect the new rating
      setContents(contents.map((item) => (item.id === content ? { ...item, user_score: score } : item)));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Dashboard</h1>
      {loading ? (
        <div className='animate-pulse flex space-x-4'>
          <div className='bg-gray-400 rounded-lg h-12 w-12'></div>
          <div className='flex-1 space-y-4 py-1'>
            <div className='h-4 bg-gray-400 rounded w-3/4'></div>
            <div className='space-y-2'>
              <div className='h-4 bg-gray-400 rounded'></div>
              <div className='h-4 bg-gray-400 rounded w-5/6'></div>
            </div>
          </div>
        </div>
      ) : (
        contents.map((content, index) => {
          const roundedMeanScores = content.scores_stat.mean_scores ? Math.round(content.scores_stat.mean_scores) : 0;
          return (
            <div key={index} className='border p-4 rounded-lg mb-4'>
              <h2 className='text-xl font-bold'>{content.title}</h2>
              <p>{content.description}</p>
              <div className='flex mt-1'>
                <span className='text-gray-700'>Average Score: </span>
                {[...Array(5)].map((_, i) => (
                  <StarSolid
                    key={i}
                    className={i < roundedMeanScores ? 'h-5 w-5 text-blue-500' : 'h-5 w-5 text-gray-500'}
                  />
                ))}
              </div>
              <div className='flex mt-1'>
                <span className='text-gray-700'>Your Score: </span>
                {[...Array(5)].map((_, i) => (
                  <button key={i} onClick={() => handleStarClick(content.id, i + 1)}>
                    {i < (content.user_score || 0) ? (
                      <StarSolid className='h-5 w-5 text-yellow-500' />
                    ) : (
                      <StarOutline className='h-5 w-5 text-gray-500' />
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Dashboard;
