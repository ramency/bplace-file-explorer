export class templateFile {
   constructor(data) {
      JSON.parse(data, (key, value) => {
         this[key] = value;
      });
   }

   version = 0;
   exportedAt = '';

}


version: 0,
   exportedAt: "",
   template: {
   name: "",
      imageData: "",
      opacity: 0,
      position: {
      x: 0,
         y: 0,
   },
   scale: 0,
      rotation: 0,
      visible: false,
      width: 0,
      height: 0,
      displayMode: "",
      renderAbovePixels: false,
      canvasType: "",
      excludeSpecialColors: false,
      imageInIndexedDB: false,
      _needsImageLoad: false,
      _version: 0,
}