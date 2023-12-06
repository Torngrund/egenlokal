var map;
var markers = [];
var openOverlay = null;

window.addEventListener('load', function () {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 62, lng: 15 },
        zoom: 5,
        mapTypeControl: false,
        fullscreenControl: false,
    });

    var sidebarItems = document.querySelectorAll('#sidebar .sidebar-item');
    sidebarItems.forEach(function (item, index) {
        var lat = parseFloat(item.getAttribute('data-lat'));
        var lng = parseFloat(item.getAttribute('data-lng'));
        var title = item.getAttribute('data-title');
        var area = item.getAttribute('data-area');
        var status = item.getAttribute('data-status');
        var slug = item.getAttribute('data-slug');
        addMarker({ lat: lat, lng: lng, title: title, status: status, area: area }, slug);
    });

    updateSidebar();

    document.getElementById('sidebar').addEventListener('click', function (event) {
        var target = event.target;

        var listItem = target.closest('.sidebar-item');

        if (listItem) {
            var index = listItem.getAttribute('data-index');
            if (index !== null) {
                handleMarkerClick(index);
            }
        }
    });
});


function getMarkerIcon(status) {
    var color;
    switch (status.toLowerCase()) {
        case 'pågående':
            color = '#61E447';
            break;
        case 'kommande':
            color = '#202F2F';
            break;
        case 'genomförd':
            color = '#ff5a00';
            break;
        default:
            color = '#808080';
            break;
    }

    return {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: color,
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 8,
    };
}

function addMarker(position, slug) {
    var marker = new google.maps.Marker({
        position: position,
        map: map,
        title: position.title + ' - ' + position.area,
        status: position.status,
        icon: getMarkerIcon(position.status),
    });

    marker.set('data-slug', slug);

    markers.push(marker);

    google.maps.event.addListener(marker, 'click', function () {
        handleMarkerClick(markers.indexOf(marker));
    });
}

function getStatusFromMarker(index) {
    var marker = markers[index];

    if (marker) {
        var status = marker.status;
        if (status !== null) {
            return status;
        }
    }

    return 'Unknown';
}

function getAreaFromMarker(markerIndex) {
    var marker = markers[markerIndex];

    if (marker) {
        var title = marker.getTitle();

        var titleParts = title.split(' - ');

        if (titleParts.length > 1) {
            return titleParts[1];
        }
    }


    return 'Unknown Area';
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(2);
}

function updateSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.innerHTML = '';

    var statusGroups = {};

    markers.forEach(function (marker, index) {
        var status = getStatusFromMarker(index);
        var area = getAreaFromMarker(index);

        if (!statusGroups[status]) {
            statusGroups[status] = [];
        }

        statusGroups[status].push({ marker: marker, area: area });
    });

    var customStatusOrder = ['Pågående', 'Kommande', 'Genomförd'];

    var sortedStatusKeys = Object.keys(statusGroups).sort(function (a, b) {
        return customStatusOrder.indexOf(a) - customStatusOrder.indexOf(b);
    });

    var defaultLocation = {
        lat: 59.3293,
        lng: 18.0686,
    };

    sortedStatusKeys.forEach(function (status) {
        statusGroups[status].sort(function (a, b) {
            var titleA = a.marker.getTitle().toUpperCase();
            var titleB = b.marker.getTitle().toUpperCase();
            return titleA.localeCompare(titleB);
        });

        sidebar.innerHTML += '<h2>' + status + '</h2>';

        statusGroups[status].forEach(function (item) {
            var listItem = document.createElement('div');
            listItem.className = 'sidebar-item';

            listItem.innerHTML +=
                '<div class="marker-status" style="background-color: ' + getColorForStatus(status) + '"></div>';

            var markerPosition = item.marker.getPosition();
            var markerLat = markerPosition.lat();
            var markerLng = markerPosition.lng();

            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    function (position) {
                        var userLocation = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                        };

                        var distance = haversineDistance(userLocation.lat, userLocation.lng, markerLat, markerLng);

                        listItem.innerHTML +=
                            '<span>' +
                            item.marker.getTitle() +
                            ' - ' +
                            item.area +
                            ' - ' +
                            distance +
                            ' km' +
                            '</span>';

                        listItem.setAttribute('data-index', markers.indexOf(item.marker));

                        listItem.setAttribute('data-area', item.area);

                        sidebar.appendChild(listItem);
                    },
                    function (error) {
                        console.error('Error getting user location:', error);
                    }
                );
            } else {

                var distance = haversineDistance(defaultLocation.lat, defaultLocation.lng, markerLat, markerLng);

                listItem.innerHTML +=
                    '<span>' +
                    item.marker.getTitle() +
                    ' - ' +
                    item.area +
                    ' - ' +
                    distance +
                    ' km' +
                    '</span>';


                listItem.setAttribute('data-index', markers.indexOf(item.marker));

                listItem.setAttribute('data-area', item.area);


                sidebar.appendChild(listItem);
            }
        });
    });
}

updateSidebar();


function getColorForStatus(status) {

    switch (status.toLowerCase()) {
        case 'pågående':
            return '#61E447';
        case 'kommande':
            return '#202F2F';
        case 'genomförd':
            return '#ff5a00';
        default:
            return '#808080'; // Default color for unknown status
    }
}

var openInfoWindow = null;

function handleMarkerClick(index) {
    var marker = markers[index];

    // Close the previously opened InfoWindow, if any
    if (openInfoWindow) {
        openInfoWindow.close();
    }

    // Create a new InfoWindow
    var infoWindow = new google.maps.InfoWindow();

    // Set the fixed width for the InfoWindow
    var infoWindowWidth = 300;
    var padding = 10;

    // Get the data attributes from the clicked list item
    var titleAreaParts = marker.getTitle().split(' - ');
    var title = titleAreaParts[0];
    var area = titleAreaParts.length > 1 ? titleAreaParts[1] : '';
    var slug = marker.get('data-slug'); // Use the appropriate method to get the data-slug attribute

    // Set the content for the InfoWindow with the new data-slug attribute
    var content = '<div class="info-window-container" style="width: ' + infoWindowWidth + 'px; padding: ' + padding + 'px;">' +
        '<div class="marker-box-content">' +
        '<h3 class="marker-box-content-header">' + title + '</h3>' +
        '<p class="area-span">' + area + '</p>' +
        '<p class="marker-box-content-text">Projektet är slutsålt, vill du att vi ska släppa en till etapp i ' + title + '? Gör en intresseanmälan för mer information!</p>' +
        '<a class="marker-box-button" href="https://egenlokal.se/projekt/' + slug + '">Läs mer</a>' +
        '</div>' +
        '</div>';

    // Set the content to the InfoWindow
    infoWindow.setContent(content);

    // Open the InfoWindow above the marker's position
    infoWindow.setPosition(marker.getPosition());

    // Animate the vertical position of the InfoWindow
    var infoWindowOffset = 0;
    infoWindow.open(map);

    var animationInterval = setInterval(function () {
        infoWindowOffset += 5; // Adjust the value for the animation speed
        infoWindow.setOptions({
            pixelOffset: new google.maps.Size(0, -infoWindowOffset)
        });

        if (infoWindowOffset >= padding) {
            clearInterval(animationInterval);
        }
    }, 20);

    // Update the currently open InfoWindow
    openInfoWindow = infoWindow;

    // Add an event listener for the 'closeclick' event
    google.maps.event.addListener(infoWindow, 'closeclick', function () {
        // Reset the currently open InfoWindow when closed
        openInfoWindow = null;
    });
}
