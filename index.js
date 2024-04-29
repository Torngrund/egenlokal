window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsfilter",
  (listInstances) => {
    // Select all the cities
    const cities = document.querySelectorAll('[wb-autocomplete="cities"]');
    
    // Initialize an empty array to store city names
    const uniqueCitiesArray = [];
    
    // Iterate over cities and add their text content to the array
    cities.forEach((city) => {
      uniqueCitiesArray.push(city.textContent);
    });

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
          selection: (event) => {
            const selection = event.detail.selection.value;
            autoCompleteJS.input.value = selection;

            const simulatedEvent = new Event("input", { bubbles: true });
            autoCompleteJS.input.dispatchEvent(simulatedEvent);
          },
          focus: () => {
              if (autoCompleteJS.input.value.length) autoCompleteJS.start();
        }
        }
      }
  });
    autoCompleteJS.start();
  }
]);
