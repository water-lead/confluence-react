import React, { useEffect } from "react";
import "./studio.css";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import StudioVideo from "./Assets/studio-video.mp4";
import Logo from "./Assets/Logo.png";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Studio = () => {
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth.authAccess);

  useEffect(() => {
    if (!auth) {
      navigate("/");
    }
  }, [auth, navigate]);

  const showIndustryInput1 = () => {
    document.getElementById("first-studio-display").style.display = "none";
    document.getElementById("enter-industries").style.display = "flex";
    document.getElementById("init-analyse").style.display = "none";
    document.getElementById("industry1").style.display = "flex";
    document.getElementById("industry2").style.display = "none";
    document.getElementById("industry1").focus();
  };

  const showIdeaInput1 = () => {
    document.getElementById("congrats-view").style.display = "none";
    document.getElementById("init-analyse").style.display = "flex";
    document.getElementById("analyse-view").style.display = "none";
    document.getElementById("idea1").style.display = "flex";
    document.getElementById("idea1").focus();
  };

  const createAndDownloadPDF = async () => {
    const storedData = sessionStorage.getItem("pdfData");

    if (!storedData) {
      console.error("No data available for PDF creation.");
      return;
    }

    const data = JSON.parse(storedData);

    if (!data || !data.content) {
      console.error("Invalid or missing content for PDF creation.");
      return;
    }

    const pdfDoc = await PDFDocument.create();

    const headerFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const bodyFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();

    page.setFont(headerFont);
    page.setFontSize(24);
    page.drawText("Confluence Studio Results", {
      x: 50,
      y: height - 50,
      color: rgb(0, 0, 0),
    });

    page.setFont(bodyFont);
    page.setFontSize(12);
    let yPosition = height - 80;

    const designs = storedData.content.split("\n\n");
    designs.forEach((design) => {
      const lines = design.split("\n");
      lines.forEach((line) => {
        if (yPosition < 50) {
          page = pdfDoc.addPage();
          yPosition = page.getHeight() - 50;
        }
        page.drawText(line, { x: 50, y: yPosition });
        yPosition -= 20;
      });
      yPosition -= 10;
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "Confluence-Output.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const runEngine = async () => {
    const industry1 = document.getElementById("industry1").value;
    const industry2 = document.getElementById("industry2").value;
    const idea1 = document.getElementById("idea1").value;
    const idea2 = document.getElementById("idea2").value;
    const idea3 = document.getElementById("idea3").value;
    const idea4 = document.getElementById("idea4").value;
    const idea5 = document.getElementById("idea5").value;

    const payload = {
      industry1: industry1,
      industry2: industry2,
      idea1: idea1,
      idea2: idea2,
      idea3: idea3,
      idea4: idea4,
      idea5: idea5,
    };

    const apiUrl =
      "https://confluence-auth-8d9d6.uc.r.appspot.com/confluence-analyze";

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      const pdfDoc = await PDFDocument.create();

      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();

      const fontSize = 12;
      page.drawText(JSON.stringify(data.response, null, 2), {
        x: (width - headerFont.widthOfTextAtSize(headerText, fontSize)) / 2,
        y: height - 4 * fontSize,
        size: fontSize,
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "Confluence-Output.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      sessionStorage.setItem("pdfData", JSON.stringify(data.response));
      document.getElementById("download-button").style.display = "flex";
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Studio</title>
        <script src="studioScript.js" defer></script>
        <link rel="stylesheet" href="studio.css" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Quintessential&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Aclonica&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Original+Surfer&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="https://avatars.githubusercontent.com/u/148636323?s=48&v=4"
          type="image/x-icon"
          sizes="32x32"
        />
      </head>
      <body>
        <div className="studio-desktop-v">
          <video id="studio-video-bg-desktop" autoplay muted loop>
            <source src={StudioVideo} type="video/mp4" />
          </video>
        </div>

        <nav className="menu">
          <div className="logo">
            <a href="index.html">
              <img src={Logo} alt="Token Studio Logo" />
            </a>
          </div>
        </nav>

        <div className="studio-content">
          <section className="page-section">
            <div id="page1">
              <div>
                <div id="first-studio-display">
                  <h1>Welcome follow the instruction on each page</h1>

                  <div id="loginButton">
                    <button onClick={showIndustryInput1}>START</button>
                  </div>
                </div>

                <div id="enter-industries">
                  <p id="enter">Enter the industries you want to analyze:</p>
                  <div>
                    <input
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          if (
                            document.getElementById("industry1").value &&
                            document.getElementById("enter-industries").style
                              .display === "flex"
                          ) {
                            document.getElementById("industry1").style.display =
                              "none";
                            document.getElementById("industry2").style.display =
                              "flex";
                            document.getElementById("industry2").focus();
                          }
                        }
                      }}
                      type="text"
                      id="industry1"
                      placeholder="Ex: Travel"
                    />
                    <input
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          if (
                            document.getElementById("industry2").value &&
                            document.getElementById("enter-industries").style
                              .display === "flex"
                          ) {
                            document.getElementById(
                              "enter-industries"
                            ).style.display = "none";
                            document.getElementById(
                              "congrats-view"
                            ).style.display = "flex";
                            document.getElementById(
                              "analyse-view"
                            ).style.display = "none";
                          }
                        }
                      }}
                      type="text"
                      id="industry2"
                      placeholder="Ex: Clothing"
                    />
                  </div>
                </div>

                <div id="congrats-view">
                  <h1>Congrats on completing the First Step</h1>
                  <button id="proceedButton" onClick={showIdeaInput1}>
                    PROCEED
                  </button>
                </div>

                <div id="init-analyse">
                  <div id="description">
                    We have captured the focus industries, next, we need to
                    fine-tune our engine with specific concepts/ideas. You are
                    required to enter at least two.
                  </div>
                  <input
                    type="text"
                    id="idea1"
                    placeholder="Ex: Travel"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (
                          document.getElementById("idea1").value &&
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea1").style.display =
                            "none";
                          document.getElementById("idea2").style.display =
                            "flex";
                          document.getElementById(
                            "analyse-view"
                          ).style.display = "none";
                          document.getElementById("idea2").focus();
                        }
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="idea2"
                    placeholder="Ex: Idea2"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (
                          document.getElementById("idea2").value &&
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea2").style.display =
                            "none";
                          document.getElementById("idea3").style.display =
                            "flex";
                          document.getElementById(
                            "analyse-view"
                          ).style.display = "none";
                          document.getElementById("idea3").focus();
                        }
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="idea3"
                    placeholder="Ex: Idea3"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (
                          document.getElementById("idea3").value &&
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea3").style.display =
                            "none";
                          document.getElementById("idea4").style.display =
                            "flex";
                          document.getElementById("idea4").focus();
                        }
                      }

                      if (event.key === "ArrowRight") {
                        if (
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea3").style.display =
                            "none";
                          document.getElementById("idea4").style.display =
                            "flex";
                          document.getElementById("idea4").focus();
                        }
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="idea4"
                    placeholder="Ex: Idea4"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (
                          document.getElementById("idea4").value &&
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea4").style.display =
                            "none";
                          document.getElementById("idea5").style.display =
                            "flex";
                          document.getElementById("idea5").focus();
                        }
                      }

                      if (event.key === "ArrowRight") {
                        if (
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea4").style.display =
                            "none";
                          document.getElementById("idea5").style.display =
                            "flex";
                          document.getElementById("idea5").focus();
                        }
                      }

                      if (event.key === "ArrowLeft") {
                        if (
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea4").style.display =
                            "none";
                          document.getElementById("idea3").style.display =
                            "flex";
                          document.getElementById("idea3").focus();
                        }
                      }
                    }}
                  />
                  <input
                    type="text"
                    id="idea5"
                    placeholder="Ex: Idea5"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        if (
                          document.getElementById("idea5").value &&
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("description").style.display =
                            "none";
                          document.getElementById("idea5").style.display =
                            "none";
                          document.getElementById(
                            "analyse-view"
                          ).style.display = "flex";
                        }
                      }

                      if (event.key === "ArrowRight") {
                        if (
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("description").style.display =
                            "none";
                          document.getElementById("idea5").style.display =
                            "none";
                          document.getElementById(
                            "analyse-view"
                          ).style.display = "flex";
                        }
                      }

                      if (event.key === "ArrowLeft") {
                        if (
                          document.getElementById("init-analyse").style
                            .display === "flex"
                        ) {
                          document.getElementById("idea5").style.display =
                            "none";
                          document.getElementById("idea4").style.display =
                            "flex";
                          document.getElementById("idea4").focus();
                        }
                      }
                    }}
                  />
                </div>

                <div id="analyse-view">
                  <h1>Please wait while the engine mixes your ideas</h1>
                  <button id="analyseButton" onClick={runEngine}>
                    ANALYZE
                  </button>
                </div>

                <div id="download-button">
                  <button
                    id="pdf-download-button"
                    onClick={createAndDownloadPDF}
                  >
                    DOWNLOAD PDF
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </body>
    </html>
  );
};

export default Studio;
