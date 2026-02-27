const dropZone = document.getElementById("dropTarget");

dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("dragover");
});

dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("dragover");
});

dropZone.addEventListener("drop", async (event) => {
    event.preventDefault();
    dropZone.classList.remove("dragover");

    const files = event.dataTransfer.files;
    if (files.length === 0) return;
    try {
        let file = files[0];
        let text = await file.text();
        loadFileOutput(text);
    } catch (err) {
        console.error("Error reading file:", err);
    }
});

document.getElementById("inputChooser").addEventListener("change", async (event) => {
    try {
        let file = event.target.files[0];
        let text = await file.text();
        loadFileOutput(text);
    } catch (err) {
        console.error("Error reading file:", err);
    }
});

function loadFileOutput(content) {
    function setOutput(key, value) {
        document.getElementById(`output-${key}`).innerText = value;
    }

    try {
        let data = JSON.parse(content);
        setOutput("version", data.version);
        setOutput("exportedAt", data.exportedAt);
        setOutput("name", data.template.name);
        setOutput("opacity", data.template.opacity);
        setOutput("position", `X: ${data.template.position.x} Y: ${data.template.position.y}`);
        setOutput("scale", data.template.scale);
        setOutput("rotation", data.template.rotation);
        setOutput("visible", data.template.visible);
        setOutput("size", `Width: ${data.template.width} Height: ${data.template.height}`);
        setOutput("displayMode", data.template.displayMode);
        setOutput("renderAbovePixels", data.template.renderAbovePixels);
        setOutput("excludeSpecialColors", data.template.excludeSpecialColors);
        setOutput("canvasType", data.template.canvasType);
        setOutput("imageInIndexedDB", data.template.imageInIndexedDB);
        document.getElementById("imageDataCopyButton").onclick = () => {
            navigator.clipboard.writeText(data.template.imageData);
        };
        document.getElementById("outputImage").src = data.template.imageData;
        document.getElementById("outputImage").style.display = "flex";
        setOutput("_needsImageLoad", data.template._needsImageLoad);
        setOutput("_version", data.template._version);
        document.getElementById("output").style.display = "";
    } catch (err) {
        alert(`Error reading file: ${err}`);
    }
}