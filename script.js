document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("enl-form");
    const resultSection = document.getElementById("result");
    const summaryDiv = document.getElementById("summary");
    const predictionBox = document.querySelector(".prediction-box");
    const downloadBtn = document.getElementById("downloadPdf");

    // Create a container for assessment question (if needed for Severe ENL)
    const questionBox = document.createElement("div");
    questionBox.id = "questionBox";
    questionBox.classList.add("card", "hidden");
    form.insertAdjacentElement("afterend", questionBox);

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Patient details
        const name = document.getElementById("name").value.trim();
        const age = document.getElementById("age").value;
        const sex = document.getElementById("sex").value;
        const weight = document.getElementById("weight").value;

        // Symptoms
        const nodules = document.getElementById("nodules").value;
        const fever = document.getElementById("fever").value;
        const organs = document.getElementById("organs").value;

        // Prediction logic
        let prediction = "No Reaction";
        if (nodules === "Yes" && fever === "No" && organs === "No") {
            prediction = "Type 2 - Mild ENL";
        } else if (nodules === "Yes" && fever === "Yes" && organs === "No") {
            prediction = "Type 2 - Severe ENL";
        } else if (nodules === "Yes" && organs === "Yes") {
            prediction = "Type 2 - Severe ENL";
        }

        // Function to finalize result display
        function showFinalResult(prediction, treatmentHtml) {
            summaryDiv.innerHTML = `
                <div class="kv"><strong>Name:</strong> <span>${name || "-"}</span></div>
                <div class="kv"><strong>Age:</strong> <span>${age || "-"}</span></div>
                <div class="kv"><strong>Sex:</strong> <span>${sex || "-"}</span></div>
                <div class="kv"><strong>Weight:</strong> <span>${weight || "-"}</span></div>
            `;

            predictionBox.innerHTML = `
                <p><strong class="prediction-title">Prediction:</strong> 
                <span class="prediction-text">${prediction}</span></p>
                ${treatmentHtml}
            `;

            resultSection.classList.remove("hidden");

            downloadBtn.disabled = false;
            downloadBtn.dataset.summary = summaryDiv.innerHTML;
            downloadBtn.dataset.prediction = prediction;
            downloadBtn.dataset.treatment = treatmentHtml;
            downloadBtn.dataset.patientName = name || "patient";
        }

        // ----- Mild ENL -----
        if (prediction === "Type 2 - Mild ENL") {
            const treatmentHtml = `
                <h4>Mild ENL - Option A (NSAIDs)</h4>
                <table class="styled-table">
                    <thead>
                        <tr><th>Drug</th><th>Duration</th><th>Dosage</th><th>Frequency</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Ibuprofen</td><td>1 Week</td><td>400 mg</td><td>Twice a day</td></tr>
                        <tr><td colspan="4" style="text-align:center; font-weight:bold;">OR</td></tr>
                        <tr><td>Ketoprofen</td><td>1 Week</td><td>100 mg</td><td>Twice a day</td></tr>
                    </tbody>
                </table>
                <h4 style="color: red;">NSAIDs (as ibuprofen or ketoprofen) if not respond then 
               Start Prednisolone 1mg/kg (Maximum 40 mg) and taper it fast complete with in a month</h4>
                <h4>Mild ENL - Option B (Prednisolone taper)</h4>
                <table class="styled-table">
                    <thead>
                        <tr><th>Drug</th><th>Duration</th><th>Dosage</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Prednisolone</td><td>5 days</td><td>40 mg</td></tr>
                        <tr><td>Prednisolone</td><td>5 days</td><td>30 mg</td></tr>
                        <tr><td>Prednisolone</td><td>5 days</td><td>20 mg</td></tr>
                        <tr><td>Prednisolone</td><td>5 days</td><td>15 mg</td></tr>
                        <tr><td>Prednisolone</td><td>5 days</td><td>10 mg</td></tr>
                        <tr><td>Prednisolone</td><td>5 days</td><td>5 mg</td></tr>
                    </tbody>
                </table>
            `;
            questionBox.classList.add("hidden");
            showFinalResult(prediction, treatmentHtml);
        }

        // ----- Severe ENL -----
        else if (prediction === "Type 2 - Severe ENL") {
            questionBox.innerHTML = `
                <p><strong>ENL Episode:</strong></p>
                <select id="episodeSelect">
                    <option value="">--Select--</option>
                    <option value="first">First Episode</option>
                    <option value="recurrent">More than One Episode (Recurrent/Chronic)</option>
                </select>
            `;
            questionBox.classList.remove("hidden");

            const episodeSelect = document.getElementById("episodeSelect");
            episodeSelect.addEventListener("change", () => {
                if (episodeSelect.value === "first") {
                    showFinalResult(prediction, `
                        <div class="option-box">
                            <h5>First Episode</h5>
                            <ul>
                                <li>Start Prednisolone 1 mg/kg (Maximum 60 mg) and taper it 5-6 months.</li>
                                <li>Add NSAIDs at 30 mg prednisolone (Ibuprofen 400 mg OD night for 2 weeks).</li>
                            </ul>
                        </div>
                    `);
                } else if (episodeSelect.value === "recurrent") {
                    showFinalResult(prediction, `
                        <h4 class="prediction-title">Recurrent / Chronic</h4>
                        <p>Try Option A to C Sequentially:</p>
                        <div class="option-box">
                            <h5>Option A</h5>
                            <ul>
                                <li>Start prednisolone 1 mg/kg (Maximum 60 mg) and taper it 5-6 months.</li>
                                <li>At the start of prednisolone 30 mg, add NSAID such as Ibuprofen 400 mg or ketoprofen 100 mg once daily for 2 weeks.</li>
                                <li>Add diazepam 10 mg or lorazepam 5 mg for 2 weeks at night, at the start of prednisolone (20 mg)</li>
                            </ul>
                        </div>
                        <div class="option-box">
                            <h5>Option A not respond then Try Option B</h5>
                            <ul>
                                <li>Start prednisolone 1 mg/kg (Maximum 60 mg) and taper it 5-6 months.</li>
                                <li>At the start of prednisolone 30 mg, add either dexamethasone 2mg night (IM/IV) (once weekly for 3 weeks) or methylprednisolone 8 mg oral (once monthly for 3 months).</li>
                                <li>Add diazepam 10 mg or lorazepam 5 mg for 2 weeks at night, at the start of prednisolone (20 mg).</li>
                            </ul>
                        </div>
                        <div class="option-box">
                            <h5>Option B not respond then Try Option C</h5>
                            <ul>
                                <li>Start prednisolone 1 mg/kg (Maximum 60 mg) and taper it 5-6 months and add minocycline 100 mg daily for 3 months, or initiate thalidomide as per guideline recommendations. Note:Prior to initiating Thalidomide treatment, ensure strict adherence to the eligibility criteria.</li>
                                <li>Consider an alternative MDT regimen if indicated.</li>
                                <li>Add diazepam 10 mg or lorazepam 5 mg for 2 weeks at night, at the start of prednisolone (20 mg).</li>
                            </ul>
                        </div>
                    `);
                }
                questionBox.classList.add("hidden");
            });
        }

        // ----- No Reaction -----
        else {
            questionBox.classList.add("hidden");
            showFinalResult(prediction, `<p>No additional assessment required.</p>`);
        }

        resultSection.classList.remove("hidden");
    });

    // Reset
    form.addEventListener("reset", () => {
        resultSection.classList.add("hidden");
        questionBox.classList.add("hidden");
        predictionBox.innerHTML = `<span id="predictionText"></span>`;
        downloadBtn.disabled = true;
    });

    // Download PDF
    downloadBtn.addEventListener("click", () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 15;
        doc.setFontSize(16);
        doc.text("ENL Assessment Report", 105, y, { align: "center" });
        y += 10;

        // ---- Patient Details Table ----
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = downloadBtn.dataset.summary;

        const patientData = [];
        tempDiv.querySelectorAll("div.kv").forEach(kv => {
            const key = kv.querySelector("strong").innerText.replace(":", "");
            const val = kv.querySelector("span").innerText;
            patientData.push([key, val]);
        });

        doc.autoTable({
            startY: y,
            head: [["Patient Detail", "Value"]],
            body: patientData,
            theme: "grid",
            styles: { fontSize: 11 },
            headStyles: { fillColor: [22, 160, 133] }
        });

        y = doc.lastAutoTable.finalY + 10;

        // ---- Prediction ----
        doc.setFontSize(14);
        doc.setTextColor(200, 0, 0);
        doc.text("Prediction:", 14, y);
        doc.setTextColor(0, 0, 0);
        doc.text(downloadBtn.dataset.prediction, 50, y);
        y += 10;

        // ---- Treatments ----
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 150);
        doc.text("Treatment / Recommendations:", 14, y);
        doc.setTextColor(0, 0, 0);
        y += 8;

        const treatmentDiv = document.createElement("div");
        treatmentDiv.innerHTML = downloadBtn.dataset.treatment;

        // Loop all child nodes
        [...treatmentDiv.children].forEach(el => {
            if (y > 280) { // page break check
                doc.addPage();
                y = 20;
            }

            // Handle Headings
            if (el.tagName === "H4" || el.tagName === "H5") {
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 180);
                let wrapped = doc.splitTextToSize(el.innerText, 180);
                doc.text(wrapped, 14, y);
                y += wrapped.length * 6 + 4;
            }

            // Handle Paragraphs
            else if (el.tagName === "P") {
                doc.setFontSize(11);
                doc.setTextColor(0, 0, 0);
                let wrapped = doc.splitTextToSize(el.innerText, 180);
                doc.text(wrapped, 14, y);
                y += wrapped.length * 6 + 4;
            }

            // Handle Tables
            else if (el.tagName === "TABLE") {
                let headers = [];
                el.querySelectorAll("thead th").forEach(th => headers.push(th.innerText));

                let rows = [];
                el.querySelectorAll("tbody tr").forEach(tr => {
                    let row = [];
                    tr.querySelectorAll("td").forEach(td => row.push(td.innerText));
                    rows.push(row);
                });

                doc.autoTable({
                    startY: y,
                    head: [headers],
                    body: rows,
                    theme: "grid",
                    styles: { fontSize: 10 },
                    headStyles: { fillColor: [52, 73, 94], textColor: 255 }
                });

                y = doc.lastAutoTable.finalY + 10;
            }

            // Handle Option Boxes
            // Handle Option Boxes
            else if (el.classList.contains("option-box")) {
                const title = el.querySelector("h5")?.innerText || "Option";
                const items = [...el.querySelectorAll("li")].map(li => li.innerText);

                // First, measure height needed
                let tempY = y + 8;
                let contentHeight = 0;

                // Height for items
                items.forEach(item => {
                    let wrapped = doc.splitTextToSize(`• ${item}`, 170);
                    contentHeight += wrapped.length * 6 + 4;
                });

                // Height for title + padding
                contentHeight += 14;

                // Page break check
                if (y + contentHeight > 280) {
                    doc.addPage();
                    y = 20;
                }

                // Draw grey box
                doc.setFillColor(230, 230, 230);
                doc.rect(12, y - 4, 186, contentHeight, "F");

                // Print title
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 180);
                doc.text(title, 16, y + 6);
                y += 16;

                // Print list items
                doc.setTextColor(0, 0, 0);
                items.forEach(item => {
                    doc.setFontSize(10);
                    let wrappedText = doc.splitTextToSize(`• ${item}`, 170);
                    wrappedText.forEach(line => {
                        if (y > 280) {
                            doc.addPage();
                            y = 20;
                        }
                        doc.text(line, 20, y);
                        y += 6;
                    });
                    y += 2;
                });

                y += 8; // spacing after box
            }

        });

        // Save file with patient name
        const patientName = (downloadBtn.dataset.patientName || "patient").replace(/\s+/g, "_");
        doc.save(`${patientName}_ENL_Assessment.pdf`);
    });


});
