import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { MagnifierProvider } from "./hooks/useShowMagnify";
import { CollectionModalProvider } from "./contexts/CollectionModalProvider";

import PortalComponent from "./PortalComponent";
import PortalComponentTwo from "./PortalComponentTwo";
import ScrollToTopButton from "./ScrollToTopButton";
import TopHeader from "./TopHeader";

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
    <BrowserRouter>
        <MagnifierProvider>
            <CollectionModalProvider>
                {/* Portallar */}
                <PortalComponent>
                    <ScrollToTopButton />
                </PortalComponent>
                <PortalComponentTwo>
                    <TopHeader />
                </PortalComponentTwo>

                {/* Əsas app */}
                <App />
            </CollectionModalProvider>
        </MagnifierProvider>
    </BrowserRouter>
);
