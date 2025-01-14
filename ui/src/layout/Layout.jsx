import { Outlet, useLocation } from "react-router-dom"
import { GcdsHeader, GcdsContainer, GcdsFooter, GcdsTopNav, GcdsNavLink, GcdsNavGroup, GcdsLangToggle, GcdsBreadcrumbsItem, GcdsBreadcrumbs } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css"
import "./Layout.css"
import { useTranslation } from "react-i18next"
import { useState, useEffect } from "react"
import { ToastContainer,toast  } from "react-toastify"

export default function Layout() {
	const { t, i18n } = useTranslation()
	const [announcement, setAnnouncement] = useState("") // State for announcements
	const location = useLocation()

	useEffect(() => {
		// Define the titles for different routes
		const routeTitles = {
		  "/": t("menu.home"),
		  "/contact-us": t("pages.contactUs.title"),
		  "/accessibility": t("pages.accessibility.title"),
		  "/accessibility-summary": t("pages.accessibility-summary.title"),
		  "/SBOM": t("pages.SBOM.title"),
		  "/test-coverage": t("pages.test-coverage.title"),
		  "/vulnerabilities": t("pages.vulnerabilities.title"),
		};

		// Set the title based on the current path
		const currentTitle = routeTitles[location.pathname] + " - safe-inputs-health-dashboard.ca" || "safe-inputs-health-dashboards.ca"
		document.title = currentTitle

		// Delay added to allow i18N to translate first before announcing
		const timer = setTimeout(() => {
			setAnnouncement(currentTitle)
		}, 200) // Adjust delay here

		// Clear timeout if component unmounts or announcement changes
		return () => clearTimeout(timer)
	}, [location.pathname, t])

	const contextualLinks = { // footer links
		[t("footer.contactUs")]: "/contact-us",
	  };

	const changeLanguage = lng => {
		i18n.changeLanguage(lng)
		toast.dismiss();
		setAnnouncement(`${lng === "fr" ? "La langue a été changée en français" : "The language has been changed to English"}`) // Update announcement
	}

	return (
		<>
		  {/* Header with navigation */}
		  <GcdsHeader
			langHref={i18n.language}
			signatureHasLink="false"
			lang={i18n.language}
			style={{ fontSize: "20px" }}
		  >
			<div slot="menu">
			  {/* <GcdsTopNav label="Top navigation" alignment="right" class="custom-nav-bar"> */}
			  <GcdsTopNav label="Top navigation" alignment="right">
				<GcdsNavLink href="/" slot="home">
				{t("menu.title")}
				</GcdsNavLink>
				<GcdsNavLink
				  href="/accessibility"
				  current={location.pathname === "/accessibility" ? true : undefined}
				>
				  {t("menu.accessibility")}
				</GcdsNavLink>
				<GcdsNavLink
				  href="/SBOM"
				  current={location.pathname === "/SBOM" ? true : undefined}
				>
				  {t("menu.SBOM")}
				</GcdsNavLink>
				<GcdsNavLink
				  href="/test-coverage"
				  current={location.pathname === "/test-coverage" ? true : undefined}
				>
				  {t("menu.testCoverage")}
				</GcdsNavLink>
				<GcdsNavLink
				  href="/vulnerabilities"
				  current={location.pathname === "/vulnerabilities" ? true : undefined}
				>
				  {t("menu.vulnerabilities")}
				</GcdsNavLink>
			  </GcdsTopNav>
			</div>
	
			{/* Breadcrumbs */}
			<div slot="breadcrumb">
			  {location.pathname === "/" ? null : (
				<GcdsBreadcrumbs className="breadcrumbs-container">
					<GcdsBreadcrumbsItem href="/">{t("menu.home")}</GcdsBreadcrumbsItem>
					{location.pathname.includes("/accessibility-summary") ? (
						<>
							<GcdsBreadcrumbsItem href="/accessibility">{t("menu.accessibility")}</GcdsBreadcrumbsItem>
							<GcdsBreadcrumbsItem>{t("menu.accessibility-summary")}</GcdsBreadcrumbsItem>
						</>
					) : (
					<GcdsBreadcrumbsItem>
						{t(`menu.${location.pathname.replace("/", "")}`)}
					</GcdsBreadcrumbsItem>
					)}
				</GcdsBreadcrumbs>
			  )}
			</div>
	
			{/* Skip to content link */}
			<div
			  slot="skip-to-nav"
			  style={{ textAlign: "center", top: "10px", left: 0, width: "100%", zIndex: 3 }}
			>
			  <a
				className="skip-to-content-link"
				href="#main-content"
				aria-label={t("menu.skipNav")}
			  >
				{t("menu.skipNav")}
			  </a>
			</div>
	
			{/* Language toggle */}
			<div slot="toggle">
			  <GcdsLangToggle
				href="#"
				lang={i18n.language}
				onClick={(event) => {
				  event.preventDefault();
				  changeLanguage(i18n.language === "en" ? "fr" : "en");
				}}
			  ></GcdsLangToggle>
			</div>
		  </GcdsHeader>
	
		  {/* Main content container */}
		  <GcdsContainer
			size={location.pathname === "/" ? "full" : "xl"}
			centered
			color="black"
			style={{ flexGrow: "1" }}
			main-container
			id="main-content"
		  >
			<Outlet />
		  </GcdsContainer>
	
		  {/* Announce the language change */}
		  <span
			role="status"
			aria-live="polite"
			tabIndex="-1"
			style={{
			  position: "absolute",
			  left: "-9999px",
			  width: "1px",
			  height: "1px",
			  overflow: "hidden",
			}}
		  >
			{announcement}
		  </span>
	
		  {/* Footer with contextual links */}
		  <GcdsFooter
			lang={i18n.language}
			display="full"
			contextualHeading={t("footer.additionalNav")}
			contextualLinks={contextualLinks}
			style={{ paddingTop: "50px" }}
		  />
	
		  {/* Toast container */}
		  <ToastContainer position="top-right" autoClose={false} theme="dark" />
		</>
	  );
	}