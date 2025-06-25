let map;
let markers = [];
let infoWindow;
let dataList = [];

const continentCenters = {
  "North America": { lat: 37.0902, lng: -95.7129 },
  "Europe": { lat: 54.5260, lng: 15.2551 },
  "Asia": { lat: 24.0479, lng: 100.6197 },
  "Oceania": { lat: -25.2744, lng: 133.7751 },
  "Latin America": { lat: 14.2350, lng: -90.9253 }
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: continentCenters["North America"],
  });

  fetch("data.json")
    .then(res => {
      //console.log("✅ fetch 응답:", res);
      return res.json();
    })
    .then(data => {
      dataList = data;
      //console.log("✅ data 응답:", dataList);
      showContinent("North America", this);
    })
    .catch(error => console.error('JSON file load error', error));

}

function createMarker(lat, lng, university) {
  const marker = new google.maps.Marker({
    position: { lat, lng },
    map: map,
    visible: true,
  });

  const listRemarks = university.비고
    ? university.비고.split('*')
      .filter((item) => item.trim() !== '')
      .map((item) => `<li>${item.trim()}</li>`)
      .join('')
    : '';

  const summaryRemarks = university.비고
    ? university.비고.split('*')
      .filter((item) => item.trim() !== '')
      .slice(0, 2)
      .map((item) => `<li>${item.trim()}</li>`)
      .join('')
    : '';

  const hoverWindow = new google.maps.InfoWindow({
    content: `
        <div class="hoverWindow">
          <h3>${university.파견기관}</h3>
          <h4 class="smallCity">City: ${university.소재도시}</h4>
          <ul>
            ${summaryRemarks}
          </ul>
        </div>
        `
  });

  const clickWindow = new google.maps.InfoWindow({
    content:
      `
      <div class="hoverWindow">
        <h3 class="universityName">${university.파견기관}</h3>
        <div class="infoSection">
          <ul class="infoList">
            <li><strong>국가:</strong> ${university.국가}</li>
            <li><strong>소재도시:</strong> ${university.소재도시}</li>
            <li><strong>강의언어:</strong> ${university.강의언어}</li>
            <li><strong>CGPA:</strong> ${university.CGPA}</li>
            <li><strong>어학 기준:</strong> ${university["어학 기준(총점)"]}</li>
            <li><strong>파견인원:</strong> ${university["파견인원(학기당)"]}</li>
            <li><strong>학부/대학원:</strong> ${university["학부 / 대학원"]}</li>
            <li><strong>전공제한:</strong> ${university.전공제한}</li>
            <li><strong>학기제한:</strong> ${university.학기제한}</li>
            ${listRemarks}
          </ul>
        </div>
      </div>
      `
  })

  //Currently opened hoverWindow
  let openDetailedInfoWindow = null;

  marker.addListener('mouseover', () => {
    if (!openDetailedInfoWindow) {
      hoverWindow.open(map, marker);
    }
  });

  marker.addListener('mouseout', () => {
    if (!openDetailedInfoWindow) {
      hoverWindow.close();
    }
  });

  marker.addListener('click', () => {

    if (openDetailedInfoWindow) {
      openDetailedInfoWindow.close();
    }
    hoverWindow.close();

    clickWindow.open(map, marker);
    openDetailedInfoWindow = clickWindow;

    google.maps.event.addListener(clickWindow, 'closeclick', () => {
      openDetailedInfoWindow = null;
    });
  });

  markers.push(marker);
}

function showContinent(continent, clickedButton) {

  //Hide Origin Markers
  markers.forEach(marker => marker.setVisible(false));

  //Go to the selected continent
  map.setCenter(continentCenters[continent]);
  map.setZoom(4);

  // 모든 버튼에서 selected 제거
  document.querySelectorAll(".continentButtonArea button").forEach(btn => {
    btn.classList.remove("selected");
  });

  // 클릭된 버튼에 selected 클래스 추가
  clickedButton.classList.add("selected");

  //Show the markers of selected continent
  dataList
    .filter(univ => univ.대륙 === continent)
    .forEach(univ => {
      createMarker(univ.lat, univ.lng, univ);
      console.log("📍 마커 생성:", univ.파견기관, univ.lat, univ.lng);
    });
}

console.log("데이터:", dataList);
console.log("필터된 결과:", dataList.filter(u => u.Continent === 'North America'));
