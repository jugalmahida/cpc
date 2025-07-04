import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Layout from "./componets/Layout";
import Loading from "./componets/Loading";
import ReactGA from 'react-ga4';

// Lazy-loaded pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Academics = lazy(() => import("./pages/Academics"));
const Placements = lazy(() => import("./pages/Placement"));
const Faculty = lazy(() => import("./pages/Faculty"));
const FacultyDetail = lazy(() => import("./pages/FacultyDetail"));
const StudentActivities = lazy(() => import("./pages/StudentActivities"));
const MediaCoverage = lazy(() => import("./pages/MediaCoverage"));
const Committees = lazy(() => import("./pages/Committees"));
const Announcements = lazy(() => import("./pages/Announcements"));
const Careers = lazy(() => import("./pages/Careers"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const Results = lazy(() => import("./pages/Results"));

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const element = document.getElementById(hash.replace("#", ""));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]); // Add hash to the dependency array

  return null;
};

function Tracking() {
  const location = useLocation();

  useEffect(() => {

    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location]);

  return null;
}

function App() {

  useEffect(() => {
    if (window.devtoolsOpen) {
      // Perform actions if devtools were likely open.
      console.log("Devtools were likely open.");
      // Example:
      // alert("Devtools were likely open.");
    }
  }, []);

  useEffect(() => {
    ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
  }, []);

  useEffect(() => {
    // Disable right-click
    function handleContextMenu(e) {
      e.preventDefault();
    }
    document.addEventListener('contextmenu', handleContextMenu);

    // Disable developer tool shortcuts
    function handleKeyDown(e) {
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.key === 'F12') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.shiftKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault();
      }
    }
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listeners
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <BrowserRouter>
      <Tracking />
      <ScrollToTop />
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/academics" element={<Academics />} />
          <Route path="/placements" element={<Placements />} />
          <Route path="/faculty" element={<Faculty />} />
          <Route path="/faculty/:id" element={<FacultyDetail />} />
          <Route path="/activities" element={<StudentActivities />} />
          <Route path="/mediacoverage" element={<MediaCoverage />} />
          <Route path="/committees" element={<Committees />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;