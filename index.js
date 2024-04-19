window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsfilter",
  (listInstances) => {
  
    // select all the cities
    const cities = document.querySelectorAll(
      '[wb-autocomplete="cities"]'
    );

    const autoCompleteJS = new autoComplete({
      selector: "#autoComplete",
      data: {
        src: cities
    }
  });
    autoCompleteJS.start();
  }
]);
