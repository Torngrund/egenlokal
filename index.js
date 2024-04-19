window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsfilter",
  (listInstances) => {
    const cities = document.querySelectorAll('[wb-autocomplete="cities"]');
    console.log({ cities });
  },
]);
