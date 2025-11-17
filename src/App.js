import Map from "./Map";
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [departure, setDeparture] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");
  const [people, setPeople] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [aiPlan, setAiPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("da210c700c2ee5f9070b115f3dbff46d");
      console.log("카카오 SDK 초기화 완료");
    }
  });

  const handlePlan = async () => {
    // 입력값 검증
    if (!departure.trim()) {
      alert("⚠️ 출발지를 입력해주세요!");
      return;
    }
    if (!destination.trim()) {
      alert("⚠️ 목적지를 입력해주세요!");
      return;
    }
    if (!date) {
      alert("⚠️ 여행 날짜를 선택해주세요!");
      return;
    }
    if (!people || people < 1) {
      alert("⚠️ 인원은 1명 이상이어야 합니다!");
      return;
    }

    try {
      setIsLoading(true);
      setShowResult(false);

      const response = await fetch("http://localhost:5000/api/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          departure,
          destination,
          date,
          people,
        }),
      });

      const data = await response.json();
      setAiPlan(data.plan);
      setShowResult(true);
    } catch (error) {
      if (error.message.includes("Failed to fetch")) {
        alert(
          "❌ 서버에 연결할 수 없습니다.\n서버가 실행 중인지 확인해주세요!"
        );
      } else {
        alert("❌ 오류가 발생했습니다.\n잠시 후 다시 시도해주세요.");
      }
      console.error("에러 상세:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 카카오톡 공유 함수
  const handleKakaoShare = () => {
    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `${departure} → ${destination} 여행 계획`,
          description: `${date} | ${people}명\nAI가 추천하는 맞춤 여행 계획을 확인하세요!`,
          imageUrl:
            "https://mud-kage.kakaocdn.net/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg",
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: "여행 계획 보기",
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      });
    } else {
      alert("카카오톡 공유 기능을 불러올 수 없습니다.");
    }
  };
  // 텍스트 복사 함수
  const handleCopyPlan = () => {
    const planText = `
    🗺️ ${departure} → ${destination} 여행 계획
    📅 날짜: ${date}
    👥 인원: ${people}명

${aiPlan}
    `.trim();

    navigator.clipboard
      .writeText(planText)
      .then(() => {
        alert("✅ 계획이 복사되었습니다!");
      })
      .catch(() => {
        alert("❌ 복사에 실패했습니다.");
      });
  };

  return (
    <>
      <div className="App">
        <div className="container">
          <h1>여행 계획 AI</h1>
          <p>어디로 떠나시나요?</p>

          <div className="input-form">
            <div className="input-group">
              <label>출발지</label>
              <input
                type="text"
                placeholder=""
                value={departure}
                onChange={(e) => setDeparture(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>목적지</label>
              <input
                type="text"
                placeholder=""
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>여행 날짜</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>인원</label>
              <input
                type="number"
                placeholder=""
                min="1"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
              />
            </div>

            <button
              className="plan-button"
              onClick={handlePlan}
              disabled={isLoading}
            >
              {isLoading ? "계획 생성 중..." : "계획 만들기"}
            </button>
          </div>

          {isLoading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>✈️ AI가 최적의 여행 계획을 짜고 있어요...</p>
              <p className="loading-sub">맛집도 찾고, 경로도 계산 중... ☕</p>
              <p className="loading-sub">잠시만 기다려주세요! (5-10초)</p>
            </div>
          )}

          {showResult && !isLoading && (
            <div className="result-container">
              <div className="result-header">
                <h2>
                  ✨ {departure} → {destination} 여행 계획
                </h2>
              </div>
              <div className="ai-plan-box">
                <h3>AI 추천 여행 계획</h3>
                <div className="plan-content">
                  {aiPlan.split("\n").map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>

                <Map departure={departure} destination={destination} />

                <div className="action-buttons">
                  <button className="share-button" onClick={handleKakaoShare}>
                    💬 카톡 공유
                  </button>
                  <button className="copy-button" onClick={handleCopyPlan}>
                    📋 복사
                  </button>
                  <button
                    className="reset-button"
                    onClick={() => setShowResult(false)}
                  >
                    ← 다시 입력
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <footer className="footer">
          <p>Made by milktan👻</p>
          <p className="footer-sub">AI 여행 계획 도우미 | 2025</p>
        </footer>
      </div>
    </>
  );
}

export default App;
