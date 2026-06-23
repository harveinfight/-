window.onload = function() {
    // 1. 地図の土台を作る（MapLibreの書き方）
    const map = new maplibregl.Map({
        container: 'map',
        style: {
            "version": 8,
            "glyphs": "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
            "sources": {
                "osm": {
                    "type": "raster",
                    "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                    "tileSize": 256,
                    "attribution": "&copy; OpenStreetMap contributors"
                }
            },
            "layers": [{
                "id": "osm-layer",
                "type": "raster",
                "source": "osm"
            }]
        },
        center: [138, 38], // 日本を中心にしますわ
        zoom: 2
    });

    // 2. 世界地図のデータを読み込む
    map.on('load', function() {
        fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
            .then(response => response.json())
            .then(data => {
                map.addSource('world-data', {
                    'type': 'geojson',
                    'data': data
                });

                // 国を塗りつぶす設定
                map.addLayer({
                    'id': 'country-fills',
                    'type': 'fill',
                    'source': 'world-data',
                    'paint': {
                        'fill-color': '#228b22', // あなたの好きな緑色ですわ！
                        'fill-opacity': 0.2
                    }
                });

                // 国の名前を表示する設定
                map.addLayer({
                    'id': 'country-labels',
                    'type': 'symbol',
                    'source': 'world-data',
                    'layout': {
                        'text-field': ['get', 'name'],
                        'text-size': 12,
                        'text-font': ['Noto Sans Regular', 'Open Sans Regular']
                    },
                    'paint': {
                        'text-color': '#333333',
                        'text-halo-color': '#ffffff',
                        'text-halo-width': 2
                    }
                });

                // 【100%確実に動くデバッグ用クリック処理】
                map.on('click', function(e) {
                    const features = map.queryRenderedFeatures(e.point, {
                        layers: ['country-fills']
                    });

                    if (features.length > 0) {
                        const countryName = features[0].properties.name || "名もなき地";
                        alert("タップされた国の名前は: " + countryName + " ですわ！");
                    } else {
                        alert("そこは海、または虚空ですわ！");
                    }
                }); // ← ここでクリック処理が閉じます

            }); // ← ここで fetch 後の処理（.then）が閉じます
    }); // ← ここで map.on('load') が閉じます
}; // ← ここで window.onload がおクソ完璧に閉じます