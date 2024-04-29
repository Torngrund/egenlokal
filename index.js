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
      uniqueCitiesArray.push({ city: cityName, project: projectName });
    });

    // Sort the array alphabetically based on city names
    uniqueCitiesArray.sort((a, b) => a.city.localeCompare(b.city));

    const autoCompleteJS = new autoComplete({
      selector: "#autoComplete",
      data: {
        src: uniqueCitiesArray,
        key: ["city"],
        cache: false
      },
      resultsList: {
        render: true,
        container: (source, query) => {
          source.innerHTML = `<ul class="autocomplete-results"></ul>`;
        },
        destination: document.querySelector("#autoComplete"),
        position: "afterend",
        element: "ul",
        navigation: true
      },
      resultItem: {
        content: (data, source) => {
          source.innerHTML = `<span>${data.match}</span><span class="project-text">${data.value.project}</span>`;
        },
        element: "li"
      },
      highlight: true,
      onSelection: (feedback) => {
        document.querySelector("#autoComplete").blur();
      }
    });
  }
]);
