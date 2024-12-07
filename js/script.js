let map;
let chart;



// Googleマップを初期化
function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 35.6895, lng: 139.6917 }, // 東京を初期表示
        zoom: 8,
    });

    // クリックイベントを登録
    map.addListener("click", (event) => {
        let lat = event.latLng.lat();
        let lng = event.latLng.lng();
        console.log(lat, lng)

        document.getElementById("coordinates").textContent = `緯度・経度: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        fetchSolarData(lat, lng);
    });
}

// APIを使って日射量データを取得
async function fetchSolarData(lat, lng) {
    // 今日の日付を取得
    let today = new Date();
    console.log(today)

    // // 日付フォーマット: YYYY-MM-DD
    // const formatDate = (date) => date.toISOString().split("T")[0];
    // console.log(formatDate)

    let apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=diffuse_radiation`;
    console.log(apiUrl)

    try {
        let response = await fetch(apiUrl);
        if (!response.ok) throw new Error("データ取得に失敗しました");

        let data = await response.json();

        if (data.error) {
            console.error("APIエラー:", data.reason);
            return;
        }

        //日射量データと時間データを取得
        let json = data
        console.log(json)

        // グラフを描画
        drawHourlyChart(json);
    } catch (error) {
        console.log("エラー", error.message);
    }
}

// データをグラフで描画
function drawHourlyChart(json) {

    let mydata = {
        labels: json.hourly.time,
        datasets: [{
            label: '日射量',
            data: json.hourly.diffuse_radiation,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
        }],
        options: {
            responsive: true,
            scales: {
                // Y軸の最大値・最小値、目盛りの範囲などを設定する
                y: {
                    suggestedMin: 0,
                    suggestedMax: 60,
                    ticks: {
                        stepSize: 20,
                    },
                },
                plugins: {
                    legend: {
                        display: true,
                    },
                },
            },
        },
    }

    new Chart(document.getElementById('solarChart'), {
        type: 'line',
        data: mydata,
    });
};

// if (solarChart) chart.destroy(); // 既存のグラフを破棄);

// 初期化
window.onload = initMap;
