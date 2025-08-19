import React from 'react';
import { useParams } from 'react-router-dom';
import Home from '../Home';
import ROUTES from '../../setting/routes';
import Aboutus from '../Aboutus';
import Products from '../Products';
import UserRules from '../UserRules';
import DeliveryRules from '../DeliveryRules';
import Contact from '../Contact';
import Brends from '../Brends';
import Login from '../userIn/login';
import UserSettings from '../userIn';
import Notification from '../userIn/Nptifications';
import Basked from '../userIn/Basked';
import Liked from '../Liked';
import UserLiked from '../userIn/Liked';
import BaskedConfirm from '../userIn/BaskedConfirm';
import ORder from '../userIn/Order';
import Register from '../userIn/register';
import Password from '../userIn/Pasword';
import SucsesPassword from '../userIn/sucsesPasword';
import Sucses from '../Sucses';
import { Helmet } from 'react-helmet-async';
import GETRequest from '../../setting/Request';
import { Seo } from '../../setting/Types';
import RefundRules from '../RefundRules';
import ReturnPage from '../userIn/ReturnPage';
import ChangeAddress from '../userIn/ChangeAddress';

const PageByLang: React.FC = () => {
  const { lang, page } = useParams<{ lang: string; page: string }>();

  const { data: Metas } = GETRequest<Seo[]>(`/seo_pages`, 'seo_pages', [lang]);

  const { data: favicon } = GETRequest<{
    image: string;
  }>(`/favicon`, 'favicon', [lang]);

  if (page === ROUTES.home.en || page === ROUTES.home.ru || page === '/' || page === '/en' || page === '/az') {
    return (
      <div>
       

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'home_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'home_page')?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'home_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Home />
      </div>
    );
  }
  if (page === ROUTES.about.en || page === ROUTES.about.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'about_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'about_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'about_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Aboutus />
      </div>
    );
  }
  if (page === ROUTES.product.en || page === ROUTES.product.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'product_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'product_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'product_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Products />
      </div>
    );
  }
  if (page === ROUTES.rules.en || page === ROUTES.rules.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {
              Metas?.find((meta) => meta.type === 'using_rules_page')
                ?.meta_title
            }
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'using_rules_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'using_rules_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <UserRules />
      </div>
    );
  }
  if (page === ROUTES.deliveryRules.en || page === ROUTES.deliveryRules.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {
              Metas?.find((meta) => meta.type === 'delivery_rules_page')
                ?.meta_title
            }
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'delivery_rules_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'delivery_rules_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <DeliveryRules />
      </div>
    );
  }
  if (page === ROUTES.refundRules.en || page === ROUTES.refundRules.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {
              Metas?.find((meta) => meta.type === 'delivery_rules_page')
                ?.meta_title
            }
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'delivery_rules_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'delivery_rules_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <RefundRules />
      </div>
    );
  }
  if (page === ROUTES.contact.en || page === ROUTES.contact.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'contact_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'contact_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'contact_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Contact />
      </div>
    );
  }
  if (page === ROUTES.brends.en || page === ROUTES.brends.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'brends_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'brends_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'brends_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Brends />
      </div>
    );
  }
  if (page === ROUTES.login.en || page === ROUTES.login.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'login_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'login_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'login_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Login />
      </div>
    );
  }
  if (page === ROUTES.userSettings.en || page === ROUTES.userSettings.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'settings_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'settings_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'settings_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <UserSettings />
      </div>
    );
  }
  if (page === ROUTES.orders.en || page === ROUTES.orders.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'order_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'order_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'order_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <ORder />
      </div>
    );
  }
  if (page === ROUTES.liked.en || page === ROUTES.liked.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'Liked_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'Liked_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'Liked_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Liked />
      </div>
    );
  }
  if (page === ROUTES.notification.en || page === ROUTES.notification.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {
              Metas?.find((meta) => meta.type === 'Notification_page')
                ?.meta_title
            }
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'Notification_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'Notification_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Notification />
      </div>
    );
  }
  if (page === ROUTES.order.en || page === ROUTES.order.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'Basked_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'Basked_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'Basked_page')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Basked />
      </div>
    );
  }
  if (page === ROUTES.return.en || page === ROUTES.return.ru) {
    return (
      <div>

        <Helmet>
          <title>{Metas?.find((meta) => meta.type === '')?.meta_title}</title>
          <meta
            name="description"
            content={Metas?.find((meta) => meta.type === '')?.meta_description}
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={Metas?.find((meta) => meta.type === '')?.meta_keywords}
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <ReturnPage />
      </div>
    );
  }
  if (page === ROUTES.likedUser.en || page === ROUTES.likedUser.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'User_liked_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'User_liked_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'User_liked_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <UserLiked />
      </div>
    );
  }
  if (page === ROUTES.ordersConfirm.en || page === ROUTES.ordersConfirm.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {
              Metas?.find((meta) => meta.type === 'Basked_confrim_page')
                ?.meta_title
            }
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'Basked_confrim_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'Basked_confrim_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <BaskedConfirm />
      </div>
    );
  }
  if (page === ROUTES.register.en || page === ROUTES.register.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'register_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'register_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'register_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Register />
      </div>
    );
  }
  if (page === ROUTES.resetPasword.en || page === ROUTES.resetPasword.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'password_page')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'password_page')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'password_page')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Password />
      </div>
    );
  }
  if (
    page === ROUTES.resetPaswordSucses.en ||
    page === ROUTES.resetPaswordSucses.ru
  ) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'sucses_password')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'sucses_password')
                ?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'sucses_password')
                ?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <SucsesPassword />
      </div>
    );
  }
  if (page === ROUTES.BaskedSucses.en || page === ROUTES.BaskedSucses.ru) {
    return (
      <div>

        <Helmet>
          <title>
            {Metas?.find((meta) => meta.type === 'sucses')?.meta_title}
          </title>
          <meta
            name="description"
            content={
              Metas?.find((meta) => meta.type === 'sucses')?.meta_description
            }
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={
              Metas?.find((meta) => meta.type === 'sucses')?.meta_keywords
            }
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <Sucses />
      </div>
    );
  }

  if (page === ROUTES.address.en || page === ROUTES.address.ru) {
    return (
      <div>

        <Helmet>
          <title>{Metas?.find((meta) => meta.type === '')?.meta_title}</title>
          <meta
            name="description"
            content={Metas?.find((meta) => meta.type === '')?.meta_description}
            data-next-head=""></meta>
          <meta
            name="keywords"
            content={Metas?.find((meta) => meta.type === '')?.meta_keywords}
            data-next-head=""></meta>
          <link rel="icon" href={favicon?.image} type="image/svg+xml" />
        </Helmet>
        <ChangeAddress />
      </div>
    );
  }

    return (
      <div>
        <h1>Language: {lang}</h1>
        <h1>Page: {page}</h1>
      </div>
    );
};

export default PageByLang;
