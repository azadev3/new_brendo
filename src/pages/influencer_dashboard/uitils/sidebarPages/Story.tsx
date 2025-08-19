import React from 'react';
import TopTitle from './TopTitle';
import { useParams } from 'react-router-dom';
import GETRequest from '../../../../setting/Request';
import { TranslationsKeys } from '../../../../setting/Types';

const Story: React.FC = () => {
  const { lang = 'ru' } = useParams<{ lang: string }>();
  const { data: translation } = GETRequest<TranslationsKeys>(`/translates`, 'translates', [
    lang,
  ]);

  const userStr = localStorage.getItem('user-info');
  const parsedUser = userStr ? JSON.parse(userStr) : null;
  const token = parsedUser?.token || '';

  return (
    <div className="story-wrapper">
      <TopTitle>
        <div className="left">
          <h3>{translation?.story_keys_keys ?? ''}</h3>
        </div>
        <button type="button" className="download-all-button">
          <img src="/button.svg" role="button" alt="download-all-button" />
        </button>
      </TopTitle>
      <div className="container-stories">
        <div className="images">
          <p className="title-mini">Şəkillər</p>
          <div className="grid-items">
            <div className="item">
              <div className="image-container">
                <img className="main-image" src="" alt="" />
              </div>
              <button type="button" className="download">
                <img src="/dddd.svg" alt="download-image" role="button" />
              </button>
            </div>
          </div>
        </div>
        <div className="videos">
          <p className="title-mini">Videolar</p>
          <div className="grid-items">
            <div className="item">
              <div className="video-container">
                <video src="" controls={false} autoPlay={false} loop={false} muted />
                <img
                  role="button"
                  className="play-btn"
                  src="/Play button.svg"
                  alt="Play button"
                />
              </div>
              <button type="button" className="download">
                <img src="/dddd.svg" alt="download-image" role="button" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Story;
