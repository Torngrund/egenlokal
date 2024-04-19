window.fsAttributes = window.fsAttributes || [];
window.fsAttributes.push([
  "cmsnest",
  (listInstances) => {
    const cities = document.querySelectorAll('[wb-autocomplete="cities"]');
    console.log({ cities });
  },
]);
