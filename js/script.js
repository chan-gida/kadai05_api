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
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();
        console.log(lat,lng)

        document.getElementById("coordinates").textContent = `緯度・経度: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        fetchSolarData(lat, lng);
    });
}

// APIを使って日射量データを取得
async function fetchSolarData(lat, lng) {
    // 今日の日付を取得
    const today = new Date();
    console.log(today)

    // // 日付フォーマット: YYYY-MM-DD
    // const formatDate = (date) => date.toISOString().split("T")[0];
    // console.log(formatDate)

    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&hourly=diffuse_radiation`;
    console.log(apiUrl)

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("データ取得に失敗しました");

        const data = await response.json();

        if (data.error) {
            console.error("APIエラー:", data.reason);
            return;
        }

        日射量データと時間データを取得
        const json = data
        console.log(json)

        // グラフを描画
        drawHourlyChart(time, solarRadiation);
    } catch (error) {
        console.log("エラー");
    }
}

/// 1時間のデータをグラフで描画
// function drawHourlyChart(timeArray, dataArray) {
//     const ctx = document.getElementById("solarChart").getContext("2d");
//     console.log(ctx)

function drawHourlyChart(json) {
    const mydata = {
        labels: json.daily.time,
        datasets: [{
            label: '最高気温',
            data: json.daily.temperature_2m_max,
            borderColor: 'rgb(192, 75, 75)',
        }, {
            label: '最低気温',
            data: json.daily.temperature_2m_min,
            borderColor: 'rgb(75, 75, 192)',
        }]
    }

    new Chart(document.getElementById('stage'), {
        type: 'line',
        data: mydata,
    });
}
    // if (chart) chart.destroy(); // 既存のグラフを破棄

    // chart = new Chart(ctx, {
    //     type: "line",
    //     data: {
    //         labels: timeArray, // 時間ラベル
    //         datasets: [{
    //             label: "1時間ごとの日射量 (W/m²)",
    //             data: dataArray,
    //             borderColor: "rgba(75, 192, 192, 1)",
    //             fill: false,
    //         }],
    //     },
    //     options: {
    //         responsive: true,
    //         scales: {
    //             x: {
    //                 type: "time", // 時間スケールを使用
    //                 time: {
    //                     unit: "hour", // 時間単位
    //                     displayFormats: {
    //                         hour: "MM-DD HH:mm", // 日付と時刻のフォーマット
    //                     },
    //                 },
    //             },
    //             y: {
    //                 title: {
    //                     display: true,
    //                     text: "日射量 (W/m²)",
    //                 },
    //             },
    //         },
    //         plugins: {
    //             legend: {
    //                 display: true,
    //             },
    //         },
    //     },
    // });
}

// 初期化
window.onload = initMap;
