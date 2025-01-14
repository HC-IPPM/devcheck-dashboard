import { useEffect, useState } from "react"
import { GcdsButton, GcdsContainer, GcdsGrid, GcdsHeading, GcdsText } from "@cdssnc/gcds-components-react"
import "@cdssnc/gcds-components-react/gcds.css"
import { useTranslation } from "react-i18next"

export default function LandingPage() {
	const { t, i18n } = useTranslation()

	const [isWideScreen, setIsWideScreen] = useState(window.innerWidth > 1080)
	useEffect(() => {
		const mediaQuery = window.matchMedia("(min-width: 1080px)")
		const handleMediaChange = () => setIsWideScreen(mediaQuery.matches)

		mediaQuery.addEventListener("change", handleMediaChange)
		return () => mediaQuery.removeEventListener("change", handleMediaChange)
	}, [])

	return (
		<>
			{/* Start welcome section */}
			<div>
				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "rgba(38, 55, 74, 0.9)", // Semi-transparent background for text
						boxShadow: "0 0 10px 5px rgba(255, 255, 255, 0.7)", // White box shadow for text container
						borderRadius: "5px",
						color: "white",
						padding: "60px 5vw",
						textAlign: "center",
						position: "relative", // Ensure this is above the blurred background
						zIndex: 1,
					}}
				>
					<h1>{t("pages.landingPage.title")} </h1>
					{/* Main title */}
				</div>
			</div>
			{/* End of welcome section */}

			{/* Start of container for paragraphs and three single fetch items */}
			<GcdsContainer
				size="xl"
				centered
				color="black"
				style={{ flexGrow: "1",textAlign: "left" }}
				padding="400"
				id="main-content"
				role="main" // Landmark role for main content
				aria-label={t("pages.landingPage.title")} // Associate container with a heading
			>
				<GcdsText tag="p" characterLimit="false">{t("pages.landingPage.landingPagePara")}</GcdsText> {/* Main paragraph text */}
				<div>
					<GcdsHeading tag="h2" style={{ textAlign: "left" }}>{t("pages.landingPage.underHeader")}</GcdsHeading> {/* Section heading for API-related content */}
					<GcdsText characterLimit="false">
						<em> {t("pages.landingPage.title")} </em>
					</GcdsText>{" "}
					
				</div>
			</GcdsContainer>
		</>
	)
}