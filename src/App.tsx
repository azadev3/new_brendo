import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// ❗ Devtools’u koşullu import edeceğiz
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import axios from "axios";
import { Toaster } from "react-hot-toast";

import Loading from "./components/Loading";
import Header from "./components/Header";
import { useCollectionModal } from "./contexts/CollectionModalProvider";
import { CollectionProvider } from "./pages/influencer_dashboard/CollectionProvider";

/** ---- LAZY ROUTES ---- **/
const importHome = () => import("./pages/Home");
const Home = lazy(importHome);

const importProducts = () => import("./pages/Products");
const Products = lazy(importProducts);

const importProductId = () => import("./pages/Products/Id");
const ProductId = lazy(importProductId);

const Aboutus = lazy(() => import("./pages/Aboutus"));
const Liked = lazy(() => import("./pages/Liked"));
const Brends = lazy(() => import("./pages/Brends"));
const Contact = lazy(() => import("./pages/Contact"));
const UserRules = lazy(() => import("./pages/UserRules"));
const DeliveryRules = lazy(() => import("./pages/DeliveryRules"));
const RefundRules = lazy(() => import("./pages/RefundRules"));
const Login = lazy(() => import("./pages/userIn/login"));
const Register = lazy(() => import("./pages/userIn/register"));
const UserSettings = lazy(() => import("./pages/userIn"));
const UserLiked = lazy(() => import("./pages/userIn/Liked"));
const Order = lazy(() => import("./pages/userIn/Order"));
const BaskedConfirm = lazy(() => import("./pages/userIn/BaskedConfirm"));
const Basked = lazy(() => import("./pages/userIn/Basked"));
const Password = lazy(() => import("./pages/userIn/Pasword"));
const Notification = lazy(() => import("./pages/userIn/Nptifications"));
const ReturnPage = lazy(() => import("./pages/userIn/ReturnPage"));
const OrderItemsDetail = lazy(() => import("./pages/userIn/OrderItemsDetail"));
const ChangeAddress = lazy(() => import("./pages/userIn/ChangeAddress"));
const PageByLang = lazy(() => import("./pages/Maincontrollers/PageByLang"));
const InnerPageByLang = lazy(() => import("./pages/Maincontrollers/InnerPagebyLang"));
const Sucses = lazy(() => import("./pages/Sucses"));
const FailPage = lazy(() => import("./pages/FailPage"));
const DynamicPage = lazy(() => import("./featurePages/DynamicPage"));
const RulesPage = lazy(() => import("./featurePages/RulesPage"));
const CollectionPage = lazy(() => import("./CollectionPage"));
const MainDashboard = lazy(() => import("./pages/influencer_dashboard/MainDashboard"));

// ❗ Modalları sadece açılınca yükleyelim
const importCreateCollectionModal = () => import("./pages/influencer_dashboard/ui/CreateCollectionModal");
const importAddProductCollection = () => import("./pages/influencer_dashboard/ui/AddProductCollection");
const CreateCollectionModal = lazy(importCreateCollectionModal);
const AddProductCollection = lazy(importAddProductCollection);

/** ---- REACT QUERY ---- **/
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const GOOGLE_CLIENT_ID = "676362303569-egd9urrld33gs13hbpo2mks4i73jr19n.apps.googleusercontent.com";

const App = () => {
  const location = useLocation();
  const {
    createCollectionModal,
    setCreateCollectionModal,
    setAddProductCollection,
    addProductCollection,
  } = useCollectionModal();

  const type = localStorage.getItem("user_type");

  /** ---- Favicon: localStorage cache + TTL ---- **/
  const [favicon, setFavicon] = useState<{ image: string }>({ image: "" });
  const [faviconLoading, setFaviconLoading] = useState(false);

  useEffect(() => {
    // preconnect & dns-prefetch (ilk API latency’ini azaltır)
    const addLink = (rel: string, href: string) => {
      if (document.head.querySelector(`link[rel="${rel}"][href="${href}"]`)) return;
      const l = document.createElement("link");
      l.rel = rel;
      l.href = href;
      document.head.appendChild(l);
    };
    addLink("preconnect", "https://admin.brendoo.com");
    addLink("dns-prefetch", "//admin.brendoo.com");
  }, []);

  useEffect(() => {
    let mounted = true;
    const KEY = "favicon_cache_v1";
    const TTL = 7 * 24 * 60 * 60 * 1000; // 7 gün

    const cached = localStorage.getItem(KEY);
    if (cached) {
      try {
        const obj = JSON.parse(cached) as { url: string; ts: number };
        if (Date.now() - obj.ts < TTL) {
          setFavicon({ image: obj.url });
        }
      } catch {}
    }

    const getFavicon = async () => {
      setFaviconLoading(true);
      try {
        const res = await axios.get("https://admin.brendoo.com/api/favicon", { timeout: 5000 });
        const url = res.data?.image;
        if (mounted && url) {
          setFavicon({ image: url });
          localStorage.setItem(KEY, JSON.stringify({ url, ts: Date.now() }));
        }
      } catch (e) {
        // sessiz geç
      } finally {
        if (mounted) setFaviconLoading(false);
      }
    };

    // cache yoksa ya da süresi dolduysa çek
    if (!favicon.image) getFavicon();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (favicon?.image) {
      let link = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = favicon.image;
    }
  }, [favicon.image]);

  // Scroll to top
  useEffect(() => {
    if (!location.pathname.includes("онас#faq") && !location.pathname.includes("about#faq")) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  /** ---- 🧠 Idle prefetch: anasayfadayken olası sayfaları indir ---- **/
  useEffect(() => {
    if (location.pathname === "/") {
      const idle = (cb: () => void) =>
        ("requestIdleCallback" in window)
          ? (window as any).requestIdleCallback(cb, { timeout: 2000 })
          : setTimeout(cb, 500);

      idle(() => {
        import(/* webpackPrefetch: true */ "./pages/Products");
        import(/* webpackPrefetch: true */ "./pages/Brends");
        import(/* webpackPrefetch: true */ "./pages/Products/Id");
      });
    }
  }, [location.pathname]);

  // favicon loading timeout => render içinde setTimeout kurma!
  useEffect(() => {
    if (!faviconLoading) return;
    const t = setTimeout(() => setFaviconLoading(false), 3000);
    return () => clearTimeout(t);
  }, [faviconLoading]);

  if (faviconLoading) {
    return <Loading />;
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <HelmetProvider>
        <CollectionProvider>
          <RecoilRoot>
            <QueryClientProvider client={queryClient}>
              {/* Devtools’u sadece geliştirmede yükle */}
              {process.env.NODE_ENV !== "production" && (
                <React.Suspense fallback={null}>
                  {/** @ts-ignore dinamik import */}
                  {React.createElement(lazy(() => import("@tanstack/react-query-devtools").then(m => ({ default: m.ReactQueryDevtools }))), { initialIsOpen: false })}
                </React.Suspense>
              )}

              {/* Influencer modallar: sadece açıkken chunk indir */}
              {type === "influencer" && createCollectionModal && (
                <Suspense fallback={<Loading />}>
                  <CreateCollectionModal
                    opener={createCollectionModal}
                    onClose={() => setCreateCollectionModal(false)}
                  />
                </Suspense>
              )}
              {type === "influencer" && addProductCollection && (
                <Suspense fallback={<Loading />}>
                  <AddProductCollection
                    opener={addProductCollection}
                    onClose={() => setAddProductCollection(false)}
                  />
                </Suspense>
              )}

              {/* Routing */}
              <Suspense fallback={<Loading />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  {!location.pathname?.includes("influencer") && (
                    <Route path="/:lang/:page" element={<PageByLang />} />
                  )}
                  <Route path="/:lang/:page/:slug" element={<InnerPageByLang />} />
                  <Route path="/poducts" element={<Products />} />
                  <Route path="/products/:id" element={<ProductId />} />
                  <Route path="/aboutus" element={<Aboutus />} />
                  <Route path="/liked" element={<Liked />} />
                  <Route path="/brends" element={<Brends />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/userrules" element={<UserRules />} />
                  <Route path="/deliveryrules" element={<DeliveryRules />} />
                  <Route path="/refund" element={<RefundRules />} />

                  {/* User */}
                  <Route path="/user/login" element={<Login />} />
                  <Route path="/user/register" element={<Register />} />
                  <Route path="/user/newPassword" element={<Password />} />
                  <Route path="/user" element={<UserSettings />} />
                  <Route path="/user/liked" element={<UserLiked />} />
                  <Route path="/user/notifications" element={<Notification />} />
                  <Route path="/user/return" element={<ReturnPage />} />
                  <Route path="/user/address" element={<ChangeAddress />} />
                  <Route path="/user/orders" element={<Order />} />
                  <Route path="/user/orders/:id" element={<OrderItemsDetail />} />
                  <Route path="/user/basked/confirm" element={<BaskedConfirm />} />
                  <Route path="/basked/sifarislerim" element={<Basked />} />

                  {/* General */}
                  <Route path="/success" element={<Sucses />} />
                  <Route path="/fail" element={<FailPage />} />
                  <Route path="/i/:lang/:slug" element={<DynamicPage />} />
                  <Route path="/:lang/collections/:slug" element={<CollectionPage />} />
                  <Route path="/условия-и-положения/:lang/:slug" element={<RulesPage />} />

                  {/* Influencer */}
                  {type === "influencer" && (
                    <Route
                      path="/:lang/influencer/*"
                      element={
                        <div style={{ paddingTop: "40px" }}>
                          <Header />
                          <MainDashboard />
                        </div>
                      }
                    />
                  )}
                </Routes>
              </Suspense>

              <Toaster containerStyle={{ zIndex: 100000000 }} />
            </QueryClientProvider>
          </RecoilRoot>
        </CollectionProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
};

export default React.memo(App);
