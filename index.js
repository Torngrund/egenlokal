window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsfilter",
  (listInstances) => {
    // Select all the cities and their corresponding project names
    const cities = document.querySelectorAll('[wb-autocomplete="cities"]');
    const projects = document.querySelectorAll('[wb-autocomplete="project"]');
    
    // Initialize an empty array to store city names along with project names
    const uniqueCitiesArray = [];
    
    // Iterate over cities and add their text content along with project names to the array
    cities.forEach((city, index) => {
      const cityName = city.textContent;
      const projectName = projects[index].textContent;
      uniqueCitiesArray.push(`${cityName} - ${projectName}`);
    });

    // Sort the array alphabetically
    uniqueCitiesArray.sort();

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
