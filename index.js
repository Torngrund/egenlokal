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
      },
      name: "auto-complete",
      searchEngine: "loose",
      threshold: 0,
      resultsList: {
        maxResults: undefined
      },
      submit: true,
      resultItem: {
        highlight: true
      },
      events: {
    input: {
        focus() {
            const inputValue = autoCompleteJS.input.value;

            if (inputValue.length) autoCompleteJS.start();
        },
    },
},
      events: {
        input: {
          selection: (event) => {
            const selection = event.detail.selection.value;
            autoCompleteJS.input.value = selection;

            const simulatedEvent = new Event("input", { bubbles: true });
            autoCompleteJS.input.dispatchEvent(simulatedEvent);
          }
        }
      }
  });
    autoCompleteJS.start();
  }
]);
