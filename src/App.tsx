import { lazy, Suspense, useEffect } from "react";
import "./App.css";

const CharacterModel = lazy(() => import("./components/Character"));
const MainContainer = lazy(() => import("./components/MainContainer"));
import { LoadingProvider } from "./context/LoadingProvider";

const App = () => {
  // Visitor analytics. Dynamically imported so it never enters the entry
  // bundle, and it self-defers to idle time — the hero paints first.
  useEffect(() => {
    import("./utils/analytics")
      .then((m) => m.initAnalytics())
      .catch(() => {});
  }, []);

  return (
    <>
      <LoadingProvider>
        <Suspense>
          <MainContainer>
            <Suspense>
              <CharacterModel />
            </Suspense>
          </MainContainer>
        </Suspense>
      </LoadingProvider>
    </>
  );
};

export default App;
