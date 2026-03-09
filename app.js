import { templateFile } from "./templateFile.js";

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
      event.dataTransfer.clearData(); // Clear data to "reset" files[0]
   } catch (err) {
      console.error("Error reading file:", err);
   }
});

document.getElementById("inputChooser").addEventListener("change", async (event) => {
   try {
      let file = event.target.files[0];
      let text = await file.text();
      loadFileOutput(text);
      event.target.value = ""; // Clear data to "reset" event.target
   } catch (err) {
      console.error("Error reading file:", err);
   }
});

document.getElementById("resetButton").addEventListener("click", async (event) => {
   resetOutput();
});

function loadFileOutput(content) {
   function setOutput(key, value) {
      document.getElementById(`output-${key}`).innerText = value;
   }

   try {

      let data = Object.assign({}, JSON.parse(content));
      console.log(data);
      let imageData = data.template.imageData;
      let timestamp = new Date(Date.parse(data.exportedAt)).toUTCString();

      setOutput("version", data.version);
      setOutput("exportedAt", timestamp);
      setOutput("name", data.template.name);
      setOutput("opacity", `${Math.round(data.template.opacity * 100)} %`);
      setOutput("position", `X: ${data.template.position.x} \nY: ${data.template.position.y}`);
      setOutput("scale", `${Math.round(data.template.scale * 100)} %`);
      setOutput("rotation", `${data.template.rotation} °`);
      setOutput("visible", data.template.visible);
      setOutput("size", `Width: ${Math.round(data.template.width)} px \nHeight: ${Math.round(data.template.height)} px`);
      setOutput("displayMode", data.template.displayMode);
      setOutput("renderAbovePixels", data.template.renderAbovePixels);
      setOutput("excludeSpecialColors", data.template.excludeSpecialColors);
      setOutput("canvasType", data.template.canvasType);
      setOutput("imageInIndexedDB", data.template.imageInIndexedDB);

      document.getElementById("outputImage").src = data.template.imageData;
      setOutput("_needsImageLoad", data.template._needsImageLoad);
      setOutput("_version", data.template._version);

      showOutput();
      hideInput();
      setDownloadLink(imageData);

   } catch (err) {
      alert(`Error reading file: ${err}`);
   }
}

function showOutput() {
   const outputContainer = document.getElementById("outputContainer");
   const imgContainer = document.getElementById("imgContainer");

   outputContainer.style.display = "flex";
   imgContainer.style.display = "flex";
}

function hideInput() {
   const dropContainer = document.getElementById("dropContainer");
   const outputContainer = document.getElementById("outputContainer");
   const resetButton = document.getElementById("bottomContainer");

   if (outputContainer.style.display !== "none") {
      dropContainer.style.display = "none";
      resetButton.style.display = "flex";
   }
}

function resetOutput() {
   const dropContainer = document.getElementById("dropContainer");
   const outputContainer = document.getElementById("outputContainer");
   const imgContainer = document.getElementById("imgContainer");
   const bottomContainer = document.getElementById("bottomContainer");

   dropContainer.style.display = "flex";
   imgContainer.style.display = "none";
   outputContainer.style.display = "none";
   bottomContainer.style.display = "none";
}

function setDownloadLink(imageData) {
   const blobURL = base64ToBlobURL(imageData);
   linkBlobURLToButton(blobURL);
}

function base64ToBlobURL(base64) {
   const base64Data = base64.replace(/^data:image\/\w+;base64,/, ""); // Strip off prefix
   const byteChars = atob(base64Data);
   const byteNums = new Array(byteChars.length);

   for (let i = 0; i < byteChars.length; i++) {
      byteNums[i] = byteChars.charCodeAt(i);
   }

   const byteArray = new Uint8Array(byteNums);
   const blob = new Blob([byteArray], {type: "image/png"});
   return URL.createObjectURL(blob);
}

function linkBlobURLToButton(blobURL) {
   const link = document.getElementById("saveButton");
   const filename = document.getElementById("output-name").innerText;

   link.style.display = "flex";
   link.href = blobURL;
   link.download = `${filename}.png`;

   // Potentially needs fix to reliably revoke and reassign
   link.addEventListener("load", (e) => {
      URL.revokeObjectURL(blobURL);
   });
}