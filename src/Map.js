import { useEffect, useRef } from "react";

function Map({ departure, destination }) {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const kakao = window.kakao;

      const pohangPos = new kakao.maps.LatLng(36.019, 129.343);
      const jejuPos = new kakao.maps.LatLng(33.450701, 126.570667);

      const options = {
        center: pohangPos,
        level: 13,
      };

      const map = new kakao.maps.Map(mapContainer.current, options);

      // 출발지 커스텀 오버레이
      const departureContent = document.createElement("div");
      departureContent.style.cssText =
        "padding:8px 12px; font-size:14px; font-weight:bold; color:#667eea; background:#fff; border:2px solid #667eea; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);";
      departureContent.innerHTML = "📍 " + departure;

      new kakao.maps.CustomOverlay({
        map: map,
        position: pohangPos,
        content: departureContent,
        yAnchor: 1,
      });

      // 도착지 커스텀 오버레이
      const destinationContent = document.createElement("div");
      destinationContent.style.cssText =
        "padding:8px 12px; font-size:14px; font-weight:bold; color:#764ba2; background:#fff; border:2px solid #764ba2; border-radius:8px; box-shadow:0 2px 6px rgba(0,0,0,0.1);";
      destinationContent.innerHTML = "🎯 " + destination;

      new kakao.maps.CustomOverlay({
        map: map,
        position: jejuPos,
        content: destinationContent,
        yAnchor: 1, // 1.5 → 1로 변경
      });

      // 두 마커가 다 보이도록
      const bounds = new kakao.maps.LatLngBounds();
      bounds.extend(pohangPos);
      bounds.extend(jejuPos);
      map.setBounds(bounds);

      // 경로 선 그리기
      const linePath = [pohangPos, jejuPos];
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: "#667eea",
        strokeOpacity: 0.8,
        strokeStyle: "dashed",
      });
      polyline.setMap(map);
    }
  }, [departure, destination]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "15px",
        marginTop: "20px",
      }}
    />
  );
}

export default Map;
