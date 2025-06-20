let map;
let markers = [];

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 37.5665, lng: 126.9780 }, // 초기 중심: 서울
    zoom: 2,
  });

  fetch('data.json')
  .then(res => res.json())
  .then(data => {
    data.forEach(item => {
      if (item.lat && item.lng) {
        new google.maps.Marker({
          map: map,
          position: { lat: item.lat, lng: item.lng },
          title: item.university,
        });
      }
    });
  });  
}

function filterByContinent(continent) {
    markers.forEach(({ marker, continent: markerContinent }) => {
      marker.setVisible(markerContinent === continent || continent === 'All');
    });
  }
  
  // 대륙 버튼 이벤트 연결
  document.getElementById("btn-asia").onclick = () => filterByContinent("Asia");
  document.getElementById("btn-europe").onclick = () => filterByContinent("Europe");
  document.getElementById("btn-all").onclick = () => filterByContinent("All");
  
