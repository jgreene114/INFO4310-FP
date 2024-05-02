function animateTransition(newStr, container, separators) {
    const oldStr = container.html();
    const symbols = '!@#$%^&*()_+-=[]{}|;:",.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    const separatorPattern = new RegExp(separators.map(sep =>
        `\\${sep.replace(/[-[\]<br>{}()*+?.,\\^$|#\s]/g, '\\$&')}`
    ).join('||'), 'g');

    const oldParts = oldStr.split(separatorPattern);
    const newParts = newStr.split(separatorPattern);
    const oldSeparators = oldStr.match(separatorPattern) || [];
    let currentParts = [...oldParts];

    // const update = () => {
    //     currentParts = currentParts.map((part, index) => {
    //         if (index >= newParts.length) return '';
    //         if (newParts[index] === part) return part;
    //
    //         const oldChars = part.split('');
    //         const newChars = newParts[index].split('');
    //         const result = oldChars.map((char, charIndex) => {
    //             if (charIndex >= newChars.length) return '';
    //             return newChars[charIndex] === char ? char : symbols[Math.floor(Math.random() * symbols.length)];
    //         }).join('');
    //         return result;
    //     });

    const update = () => {
        currentParts = currentParts.map((part, index) => {
            if (index >= newParts.length) return '';
            if (newParts[index] === part) return part;

            const oldChars = part.split('');
            const newChars = newParts[index].split('');
            const result = oldChars.map((char, charIndex) => {
                if (charIndex >= newChars.length) return '';
                if (newChars[charIndex] === char) {
                    return char;
                } else {
                    return `<span style="color: #a17738ff;">${symbols[Math.floor(Math.random() * symbols.length)]}</span>`;
                }
            }).join('');

            return result;
        });

        container.html(currentParts.map((part, i) => part + (oldSeparators[i] || '')).join(''));
    };

    let scrambler = d3.interval(update, 70);

    setTimeout(() => {
        scrambler.stop();
        container.html(newParts.map((part, i) => part + (i < oldSeparators.length ? oldSeparators[i] : '')).join(''));
    }, 400);
}

function animateIncreaseDecrease(newStr, container) {
    let oldTextContainer = container.select(".current-text")
    let newTextContainer = container.select(".new-text")
    console.log(container.node())

    if (newTextContainer.node() != null) {
        newTextContainer.remove()

    }
    newTextContainer = container.append('div')
        .classed("new-text", true)
        .html(newStr)
    console.log(newTextContainer)

    let oldStr = oldTextContainer.html()

    console.log(oldTextContainer.node(), newTextContainer.node(), oldStr, newStr)

}

function formatISOStr(isoStr) {
    let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

    let formatDate = d3.timeFormat("%m/%d/%Y");
    let formatTime = d3.timeFormat("%I:%M %p");


    let date = parseTime(isoStr);

    let formattedDate = formatDate(date) + '<br>' + formatTime(date);

    // console.log("Formatted Date:", formattedDate);
    return formattedDate;

}

async function requestData() {
    const katrinaData = await d3.csv('./data/katrinaTrack.csv', d => {
        d.ISO_TIME = new Date(d.ISO_TIME);
        return d;
    })

    const katrinaGeojson = await d3.json('./data/katrinaTrack.geojson', d => {
        d.ISO_TIME = new Date(d.ISO_TIME);

        return d;
    })

    return [katrinaData, katrinaGeojson];
}

function reverseLatLon(coords) {
    return coords.map(coords => [coords[1], coords[0]]);
}

const pageLoad = async function () {
    let katrinaData, katrinaGeojson
    try {
        let data = await requestData();
        katrinaData = data[0]
        katrinaGeojson = data[1]


    } catch (error) {
        console.error("Error in pageLoad: ", error)
    }

    const walkthrough = new HurricaneTrack(katrinaGeojson, 'map', 'katrinaWalkthrough')


    let idxs = walkthrough.findChangesInColumn('USA_SSHS')
    if (!idxs.includes(walkthrough.data.length - 1)) { idxs.push(walkthrough.data.length - 1) }

    // function processGeojson(geojsonData, map) {
    //     let segments = [];
    //
    //     for (let i = 0; i < geojsonData.features.length - 1; i++) {
    //         const point1 = geojsonData.features[i];
    //         const point2 = geojsonData.features[i + 1];
    //
    //         const segment = {
    //             type: 'Feature',
    //             geometry: {
    //                 type: 'LineString',
    //                 coordinates: [point1.geometry.coordinates, point2.geometry.coordinates]
    //             },
    //             properties: {
    //                 windSpeed: (point1.properties.USA_WIND + point2.properties.USA_WIND) / 2,
    //                 sshs: point1.properties.USA_SSHS,
    //                 ISO_TIME: point1.properties.ISO_TIME
    //             }
    //         };
    //
    //         segments.push(segment);
    //     }
    //     return segments;
    // }

    const latlngs = walkthrough.data.map(function (feature) {
        return [
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0]
        ];
    });

    // let track = new L.Polyline(latlngs, {
    //     className: "track-line-path",
    // }).addTo(walkthrough.map);

    walkthrough.setTrackViews(idxs)
    gsap.registerPlugin(ScrollTrigger)
    // gsap.registerPlugin(TextPlugin)

    const infoParents = d3.selectAll(".info-parent.hurricane-track").nodes()
    const infoChildren = d3.selectAll(".info-child.hurricane-track").nodes()
    const infoContainer = d3.select("#info-container").node()
    // const trackLine = d3.select(".track-line-path")

    const mapHeader = d3.select("#map-info-header")
    const mapHeaderDate = mapHeader.select("#date .map-header-info-value")
    const mapHeaderStormClf = mapHeader.select("#storm-clf .map-header-info-value")
    const mapHeaderWindSpeed = mapHeader.select("#wind-speed .map-header-info-value")


    let trackPolygon = L.polygon(
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        {
            color: "#023047ff",
            fillColor: '#fcd29fff',
            fillOpacity: 0.5,
            className: "track-path",
            smoothFactor: 0,
        }
    )

    let simTrackPolygon = L.polygon(
        [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
        {
            color: "#023047ff",
            fillColor: '#fcd29fff',
            fillOpacity: 0.5,
            className: "track-path",
        }
    )

    let prevWindSpeedLen = null

    let prevZoom = walkthrough.map.getZoom();

    function changeHeader (i) {
        let idx = walkthrough.infoIdxs[i]
        let data = walkthrough.data[idx]

        let date = data.properties.ISO_TIME
        let windSpeed = data.properties.USA_WIND
        let stormClf = data.properties.USA_SSHS

        let windSpeedStr = "" + windSpeed //"" + (" ".repeat(3 - windSpeed.toString().length)) + windSpeed

        // animateTransition(formatISOStr(date), mapHeaderDate, ["-", "/", "<br>"])
        // animateTransition(windSpeedStr, mapHeaderWindSpeed, [])
        // animateTransition(stormClf + "", mapHeaderStormClf, [" ", " "])

        animateIncreaseDecrease(stormClf, mapHeaderStormClf)
    }

    trackPolygon.addTo(walkthrough.map)
    infoParents.forEach(function (parent, i) {
        if (infoChildren[i]) {
            let target = infoChildren[i]

            let prevCoords, prevGeoJson;
            if (i == 0) {
                prevGeoJson = walkthrough.getTrackView(i).geoJson
            } else {
                prevGeoJson = walkthrough.getTrackView(i - 1).geoJson
            }
            prevCoords = reverseLatLon(prevGeoJson.geometry.coordinates[0])
            let nextGeoJson = walkthrough.getTrackView(i).geoJson
            let nextCoords = reverseLatLon(nextGeoJson.geometry.coordinates[0])

            let interpolator = flubber.interpolate(
                prevCoords,
                nextCoords,
                {
                    maxSegmentLength: 10,
                    string: false,
                }
            )

            gsap.timeline({
                scrollTrigger: {
                    trigger: parent,
                    scroller: infoContainer,
                    markers: true,
                    start: "top bottom-=5", //-=100",
                    end: "bottom bottom-=5", //-=100",
                    onEnter: () => {
                        changeHeader(i)
                    },
                    onEnterBack: () => {
                        changeHeader(i)
                    },
                    onUpdate: (self) => {
                        let currentZoom = walkthrough.map.getZoom();

                        simTrackPolygon.setLatLngs(interpolator(self.progress))

                        // let newBounds = simTrackPolygon.getBounds();
                        // let newZoom = walkthrough.map.getBoundsZoom(newBounds, true);
                        // let zoomChange = false
                        // if (prevZoom !== newZoom) {
                        //     console.log(prevZoom, newZoom)
                        //     zoomChange = true;
                        //     prevZoom = newZoom
                        //     console.log('zoom change')
                        // } else {
                        //     // console.log('no zoom change')
                        // }
                        // if (currentZoom !== newZoom) {console.log("not equal")}
                        // console.log("start")
                        // console.log(currentZoom, newZoom)
                        // trackLine
                        //     // .style("stroke-dasharray", (((increment * i) + (increment * self.progress)) * 100) + "%, 100%")
                        //     .style("stroke-dasharray", (((increment * i) + (increment * self.progress)) * lineLen) + "," + lineLen)
                        // console.log((((increment * i) + (increment * self.progress)) * lineLen) + "," + lineLen)
                        // console.log("changeview")

                        walkthrough.map.flyToBounds(simTrackPolygon.getBounds(), {
                            duration: .1,
                            animate: false,
                            padding: [30, 30]
                        })
                        trackPolygon.setLatLngs(interpolator(self.progress))
                    },
                    scrub: 3,
                },
                toggleActions: "restart reverse restart reverse",
            })
                .fromTo(target,
                    // {y: "100%"},
                    {y: "100vh"},
                    {y: "random([30vh,37vh,45vh,50vh,60vh])", duration: .5, ease: "power1.inOut"},
                )
        } else {
            console.error("NO INFO CHILD", i)
        }
    })

    // console.log(trackLine.node().getTotalLength())
    // let polyline = L.polyline(latlngs, {
    //     color: 'red',
    //     snakingSpeed: 300000,
    //     smoothFactor: 0
    // })
    // polyline.addTo(walkthrough.map)
    // setTimeout(() => {polyline.snakeIn()}, 2000);
    // var trd = [63.5, 11],
    //     mad = [40.5, -3.5],
    //     lnd = [51.5, -0.5],
    //     ams = [52.3, 4.75],
    //     vlc = [39.5, -0.5];
    //
    //
    // var route = L.featureGroup([
    //     L.marker(trd),
    //     L.polyline([trd, ams]),
    //     L.marker(ams),
    //     L.polyline([ams, lnd]),
    //     L.marker(lnd),
    //     L.polyline([lnd, mad]),
    //     L.marker(mad),
    //     L.polyline([mad, vlc]),
    //     L.marker(vlc)
    // ]);
    //
    // var map = L.map('map');
    //
    // var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
    // }).addTo(map);
    //
    // let route = walkthrough.createRoute()
    //
    // walkthrough.map.fitBounds(route.getBounds());
    // 	map.addLayer(new L.Marker(latlngs[0]));
    // 	map.addLayer(new L.Marker(latlngs[len - 1]));
    // walkthrough.map.addLayer(route);
    // function snake() {
    //     route.snakeIn();
    // }
    // snake()

    const titleMap = L.map("title-page-map", {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        interactive: false
    }).setView([-52.5, 20], 2);

    // found on https://leaflet-extras.github.io/leaflet-providers/preview/index.html
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
    }).addTo(titleMap);

    const mdrPolygonCoords = [
        [10, -20],
        [10, -85],
        [20, -85],
        [20, -20]
    ];

    const mdrPolygon = L.polygon(mdrPolygonCoords, {
        color: "#023047ff",
        fillColor: '#fcd29fff',
        fillOpacity: 0.5,
        interactive: false,
    }).addTo(titleMap);
    // polyline.snakeIn();



}

pageLoad()