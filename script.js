document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("enl-form");
    const resultSection = document.getElementById("result");
    const summaryDiv = document.getElementById("summary");
    const predictionBox = document.querySelector(".prediction-box");
    const downloadBtn = document.getElementById("downloadPdf");

    // Create a container for assessment question
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
                <p><strong>Prediction:</strong> ${prediction}</p>
                ${treatmentHtml}
            `;
            resultSection.classList.remove("hidden");

            downloadBtn.disabled = false;
            downloadBtn.dataset.summary = summaryDiv.innerHTML;
            downloadBtn.dataset.prediction = prediction;
        }

        // ----- Mild ENL -----
        if (prediction === "Type 2 - Mild ENL") {
            questionBox.innerHTML = `
                <h3>Additional Question</h3>
                <p><strong>Treatment (NSAIDs)?</strong></p>
                <select id="treatmentSelect">
                    <option value="">--Select--</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>
            `;
            questionBox.classList.remove("hidden");

            const treatmentSelect = document.getElementById("treatmentSelect");
            treatmentSelect.addEventListener("change", () => {
                if (treatmentSelect.value === "yes") {
                    showFinalResult(prediction, `
                        <h4>Mild ENL - Option A (NSAIDs)</h4>
                        <table class="styled-table">
                            <thead>
                                <tr><th>Drug</th><th>Duration</th><th>Dosage</th><th>Frequency</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>Ibuprofen</td><td>1 Week</td><td>200 mg</td><td>Twice a day</td></tr>
                                <tr><td>OR Ketoprofen</td><td>1 Week</td><td>100 mg</td><td>Twice a day</td></tr>
                            </tbody>
                        </table>
                    `);
                } else if (treatmentSelect.value === "no") {
                    showFinalResult(prediction, `
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
                    `);
                }
                questionBox.classList.add("hidden"); // hide question after selection
            });
        }

        // ----- Severe ENL -----
        else if (prediction === "Type 2 - Severe ENL") {
            questionBox.innerHTML = `
                <h3>Additional Question</h3>
                <p><strong>ENL Episode:</strong></p>
                <select id="episodeSelect">
                    <option value="">--Select--</option>
                    <option value="first">First Episode</option>
                    <option value="recurrent">Recurrent/Chronic</option>
                </select>
            `;
            questionBox.classList.remove("hidden");

            const episodeSelect = document.getElementById("episodeSelect");
            episodeSelect.addEventListener("change", () => {
                if (episodeSelect.value === "first") {
                    showFinalResult(prediction, `
                        <h4>Severe ENL - First Episode</h4>
                        <p>Start Prednisolone 40 mg (1 mg/kg) and taper over 4–5 months.<br>
                        Add NSAIDs (Ibuprofen 400 mg OD night for 2 weeks) once patient reaches 30 mg Prednisolone.</p>
                    `);
                } else if (episodeSelect.value === "recurrent") {
                    showFinalResult(prediction, `
                        <h4>Severe ENL - Recurrent/Chronic</h4>
                        <p>Three possible options:</p>
                        <h5>Option A</h5>
                        <ul>
                            <li>Prednisolone as per standard guideline.</li>
                            <li>After 2 weeks at 30 mg → Add NSAID (Ibuprofen/Ketoprofen OD for 2 weeks).</li>
                            <li>At 6 weeks (20 mg Prednisolone) → Add Diazepam 10 mg or Lorazepam for 2 weeks.</li>
                        </ul>
                        <h5>Option B</h5>
                        <ul>
                            <li>Prednisolone as per guideline.</li>
                            <li>At 30 mg → Add Dexamethasone 2 mg IM/IV weekly × 3 OR Methylprednisolone 8 mg oral monthly × 3.</li>
                            <li>At 6 weeks (20 mg Prednisolone) → Add Diazepam 10 mg or Lorazepam for 2 weeks.</li>
                        </ul>
                        <h5>Option C</h5>
                        <ul>
                            <li>Prednisolone + Minocycline 100 mg daily × 3 months OR Thalidomide per guidelines.</li>
                            <li>Consider alternative MDT regimen if indicated.</li>
                            <li>At 6 weeks (20 mg Prednisolone) → Add Diazepam 10 mg or Lorazepam for 2 weeks.</li>
                        </ul>
                    `);
                }
                questionBox.classList.add("hidden"); // hide question after selection
            });
        }

        // ----- No Reaction -----
        else {
            questionBox.classList.add("hidden");
            showFinalResult(prediction, `<p>No additional assessment required.</p>`);
        }

        // Show result section
        resultSection.classList.remove("hidden");
    });

    // Reset
    form.addEventListener("reset", () => {
        resultSection.classList.add("hidden");
        questionBox.classList.add("hidden");
        predictionBox.innerHTML = `<span id="predictionText">Pending — you can plug in your logic here in script.js.</span>`;
        downloadBtn.disabled = true;
    });
});
