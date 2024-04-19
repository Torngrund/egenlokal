window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsfilter",
  (listInstances) => {
  
    // select all the cities
    const cities = document.querySelectorAll(
      '[wb-autocomplete="cities"]'
    );

    const citiesSet = new Set();
    cities.forEach((cities) => {
      citiesSet.add(cities.textContent);
    });

    const uniqueCitiesArray = [...citiesSet];

    const autoCompleteJS = new autoComplete({
      selector: "#autoComplete",
      data: {
        src: uniqueCitiesArray
    }
  });
    autoCompleteJS.start();
  }
]);
