import { Routes, Route } from "react-router-dom"
import './App.css'
import "@cdssnc/gcds-components-react/gcds.css";
import Layout from "./layout/Layout";
import LandingPage from "./pages/landingPage/LandingPage";
import Accessibility from "./pages/accessibility/Accessibility";
import AccessibilitySummary from "./pages/accessibility/AccessibilitySummary";
import SBOM from "./pages/SBOM/SBOM";
import TestCoverage from "./pages/testCoverage/TestCoverage";
import Vulnerabilities from "./pages/vulnerabilities/Vulnerabilities";
import ContactUs from "./pages/contactUs/ContactUs";
import NoPage from "./pages/NoPage";
import "./i18n";

function App() {
	return (
	  <Routes>
		<Route path="/" element={<Layout />}>
		  <Route index element={<LandingPage />} />
		  <Route path="contact-us" element={<ContactUs />} />
		  <Route path="accessibility" element={<Accessibility />} />
		  <Route path="SBOM" element={<SBOM />} />
		  <Route path="test-coverage" element={<TestCoverage />} />
		  <Route path="vulnerabilities" element={<Vulnerabilities />} />
		  <Route path="/accessibility-summary" element={<AccessibilitySummary />} />
		  <Route path="*" element={<NoPage />} />
		</Route>
	  </Routes>
	);
  }

export default App
