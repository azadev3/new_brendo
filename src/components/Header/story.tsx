import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import axios from 'axios';
import StoryModal from '../StoriesSwipper/StoriesModal';
import 'swiper/css';
import { useParams } from 'react-router-dom';
import GETRequest from '../../setting/Request';
import { TranslationsKeys } from '../../setting/Types';

export interface StoryProductsInterface {
  id: number;
  title: string;
  is_new: boolean;
  is_season: boolean;
  slug: { en: string; ru: string };
  price: string;
  discount: string | null;
  discounted_price: string;
  image: string;
}

export interface StoriesInterface {
  id: number;
  title: string;
  image: string; // gif
  products: StoryProductsInterface[];
}

const StoryThumb: React.FC<{
  src: string;
  alt: string;
  title?: string;
  onClick?: () => void;
}> = ({ src, alt, title, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="story-thumb"
      title={title}
      role="button"
      aria-label={title}
    >
      <img
        src={src}
        alt={alt}
        loading="eager" // brauzerə şəkili dərhal yükləməsini deyir
        decoding="sync" // renderi gecikdirmədən dekod etsin
        className="story-img"
        draggable={false}
      />
    </div>
  );
};

const Story: React.FC = () => {
  const { lang = 'ru' } = useParams<{ lang: string }>();

  const [activeStory, setActiveStory] = useState<number | null>(null);
  const [stories, setStories] = useState<StoriesInterface[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://admin.brendoo.com/api/instagrams', {
        headers: { 'Accept-Language': lang },
      });
      setStories(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [lang]);

  const isActiveStory = stories?.find(s => activeStory === s?.id);
  const allStories = stories.length > 0 ? stories : [];

  const { data: translation } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [
    lang,
  ]);

  return (
    <div className="provider-story-main">
      {isActiveStory && (
        <StoryModal
          isActiveStory={isActiveStory}
          setActiveStory={setActiveStory}
          allStories={allStories}
        />
      )}

      <div className="story-container">
        {loading && <>{translation?.loading_main_key ?? ''}</>}

        {!loading && (
          <Swiper spaceBetween={12} slidesPerView="auto" loop={false}>
            {stories.map(story => (
              <SwiperSlide key={story.id}>
                <StoryThumb
                  src={story.image}
                  alt={`${story.title || 'story'}-gif`}
                  title={story.title}
                  onClick={() => setActiveStory(story.id)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default Story;
