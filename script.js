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
    <p><strong>Prediction:</strong> <span class="prediction-text">${prediction}</span></p>
    ${treatmentHtml}
`;

            resultSection.classList.remove("hidden");

            downloadBtn.disabled = false;
            downloadBtn.dataset.summary = summaryDiv.innerHTML;
            downloadBtn.dataset.prediction = prediction;
        }

        // ----- Mild ENL -----
        if (prediction === "Type 2 - Mild ENL") {
            // Directly show both treatment tables without asking
            const treatmentHtml = `
                <h4>Mild ENL - Option A (NSAIDs)</h4>
                <table class="styled-table">
                    <thead>
                        <tr><th>Drug</th><th>Duration</th><th>Dosage</th><th>Frequency</th></tr>
                    </thead>
                    <tbody>
                        <tr>
    <td>Ibuprofen</td>
    <td>1 Week</td>
    <td>200 mg</td>
    <td>Twice a day</td>
</tr>
<tr>
    <td colspan="4" style="text-align:center; font-weight:bold;">OR</td>
</tr>
<tr>
    <td>Ketoprofen</td>
    <td>1 Week</td>
    <td>100 mg</td>
    <td>Twice a day</td>
</tr>

                    </tbody>
                </table>
                <h4  style="color: red;">NSAIDs (as ibuprofen or ketoprofen ) if not respond then 
Start Prednisolone 40 mg and taper it fast complete with in a month</h4>
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
            questionBox.classList.add("hidden"); // no question
            showFinalResult(prediction, treatmentHtml);
        }

        // ----- Severe ENL -----
        else if (prediction === "Type 2 - Severe ENL") {
            questionBox.innerHTML = `
        
                <p><strong>ENL Episode:</strong></p>
                <select id="episodeSelect">
                    <option value="">--Select--</option>
                    <option value="first">First Episode</option>
                    <option value="recurrent">More than One Episode(Recurrent/Chronic)</option>
                </select>
            `;
            questionBox.classList.remove("hidden");

            const episodeSelect = document.getElementById("episodeSelect");
            episodeSelect.addEventListener("change", () => {
                if (episodeSelect.value === "first") {
                    showFinalResult(prediction, `
                        <h4>First Episode</h4>
                        <p>Start Prednisolone 40 mg (1 mg/kg) and taper over 4–5 months.<br>
                        Add NSAIDs (Ibuprofen 400 mg OD night for 2 weeks) once patient reaches 30 mg Prednisolone.</p>
                    `);
                } else if (episodeSelect.value === "recurrent") {
                    showFinalResult(prediction, `
        <h4 class="prediction-title">Recurrent/Chronic</h4>
        <p>Try Option A to C Sequentially:</p>
        
        <div class="option-box">
            <h5>Option A</h5>
            <ul>
                <li>Initiate Prednisolone as per standard guideline regimen.</li>
                <li>After two weeks on prednisolone (30 mg daily), add an NSAID such as ibuprofen or ketoprofen once daily for 2 weeks.</li>
                <li>Add diazepam 10 mg or lorazepam for 2 weeks at night after 6 weeks on prednisolone (20 mg) </li>
            </ul>
        </div>
        
        <div class="option-box">
            <h5>Option A not respond  Try Option B</h5>
            <ul>
                <li>Initiate Prednisolone as per standard guideline regimen.</li>
                <li>Once the patient is on 30 mg prednisolone, add either dexamethasone 2mg night (IM/IV) (once weekly for 3 weeks) or methylprednisolone 8 mg oral (once monthly for 3 months).</li>
                <li>Add diazepam 10 mg or lorazepam for 2 weeks at night after 6 weeks on prednisolone (20 mg)</li>
            </ul>
        </div>
        
        <div class="option-box">
            <h5>Option B Not respond Try Option C</h5>
            <ul>
                <li>Initiate prednisolone as per the standard guideline course, and add minocycline 100 mg daily for 3 months, or initiate thalidomide as per guideline recommendations.</li>
                <li>Consider an alternative MDT regimen if indicated.</li>
                <li>Add diazepam 10 mg or lorazepam for 2 weeks at night after 6 weeks on prednisolone (20 mg)</li>
            </ul>
        </div>
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
        predictionBox.innerHTML = `<span id="predictionText"></span>`;
        downloadBtn.disabled = true;
    });
});
