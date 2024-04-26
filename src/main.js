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

const pageLoad = async function () {
    let katrinaData, katrinaGeojson
    try {
        let data = await requestData();
        katrinaData = data[0]
        katrinaGeojson = data[1]


    } catch (error) {
        console.error("Error in pageLoad: ", error)
    }
    // console.log(katrinaGeojson.features[0].geometry.coordinates[0])

    const walkthrough = new HurricaneTrack(katrinaGeojson, 'map', 'katrinaWalkthrough')

    // document.addEventListener(walkthrough.walkthroughID + '#PointChanged', (event) => {
    //     console.log("Data changed to:", event.data);
    // });

    let idxs = walkthrough.findChangesInColumn('USA_SSHS')

    function processGeojson(geojsonData, map) {
        let segments = [];

        for (let i= 0; i < geojsonData.features.length - 1; i++) {
            const point1 = geojsonData.features[i];
            const point2 = geojsonData.features[i + 1];

            const segment = {
                type: 'Feature',
                geometry: {
                    type: 'LineString',
                    coordinates: [point1.geometry.coordinates, point2.geometry.coordinates]
                },
                properties: {
                    windSpeed: (point1.properties.USA_WIND + point2.properties.USA_WIND) / 2,
                    sshs: point1.properties.USA_SSHS,
                }
            };

            segments.push(segment);
        }
        return segments;
    }

    let segments = processGeojson(katrinaGeojson, walkthrough.map);

    function addAndUnionSegment(existingUnion, newSegment, map, widthScale) {
        if (!existingUnion) {
            existingUnion = {
                geoJson: null,
                layer: null
            };
        }

        let updatedUnion;

        const bufferSize = widthScale(newSegment.properties.windSpeed);
        const bufferedSegment = turf.buffer(newSegment, bufferSize, {units: 'miles'});

        if (existingUnion.geoJson) {
            updatedUnion = turf.union(existingUnion.geoJson, bufferedSegment);
        } else {
            updatedUnion = bufferedSegment;
        }

        if (existingUnion.layer) {
            map.removeLayer(existingUnion.layer);
        }

        existingUnion.layer = L.geoJson(updatedUnion, {
            style: {
                color: "red",
                weight: 3,
                opacity: 0.8
            }
        })

        existingUnion.layer.addTo(map);
        existingUnion.geoJson = updatedUnion;

        return existingUnion;
    }

    let existingUnion = null;
    let i = 0;

    const sshsScale = d3.scaleLinear()
        .domain(d3.extent(segments, d => d.properties.windSpeed))
        .range([5, 100])

    // let seconds = 0
    // for (let i = 0; i < segments.length; i++) {
    //     // if (i % 1 == 0) {
    //     //     seconds += 500
    //     // }
    //
    //     setTimeout(() => {
    //         existingUnion = addAndUnionSegment(existingUnion, segments[i], walkthrough.map, sshsScale)
    //         let bounds = existingUnion.layer.getBounds()
    //
    //         walkthrough.map.flyToBounds(bounds, {duration: .4, animate: true})
    //     }, seconds)
    //
    //     if (existingUnion) {
    //
    //     }
    // }
    // idxs = walkthrough.findChangesInColumn('USA_SSHS')
    // console.log(idxs)
    walkthrough.setTrackViews(idxs)

    gsap.registerPlugin(ScrollTrigger)

    const infoParents = d3.selectAll(".info-parent.hurricane-track").nodes()
    const infoChildren = d3.selectAll(".info-child.hurricane-track").nodes()
    const infoContainer = d3.select("#info-container").node()
    console.log(infoContainer)

    infoParents.forEach(function (parent, i) {
        if (infoChildren[i]) {
            let target = infoChildren[i]
            gsap.timeline({
                scrollTrigger: {
                    trigger: target,
                    scroller: infoContainer,
                    markers: true,
                    // start: "-100% center",
                    // end: "100% center",
                    start: "top center+=350",
                    end: "bottom center-=350",
                    onEnter: (self) => {
                        walkthrough.setTrackView(i)
                    },
                    onEnterBack: (self) => {
                        walkthrough.setTrackView(i)
                    },
                    scrub: 3,
                    // snap: 1 / (infoChildren.length - 1),
                },
                toggleActions: "restart reverse restart reverse",
            })
                .fromTo(target,
                    // {y: "100%"},
                    {yPercent: 100},
                    {yPercent: 80, duration: 3, ease: "power1.inOut"},
                    {yPercent: 0, duration: 3, ease: "power1.inOut"}
                )
                // .addLabel("middle")
                // .to(target, {
                //     // y: "00%", duration: 1, ease: "power1.inOut"
                //     yPercent: 0, duration: 1, ease: "power1.inOut"
                // });
        } else {
            console.error("NO INFO CHILD", i)
        }
    })

    const titleMap = L.map("title-page-map", {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false
    }).setView([15, 10], 2);

    // found on https://leaflet-extras.github.io/leaflet-providers/preview/index.html
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
    }).addTo(titleMap);

    var mdrPolygonCoords = [
        [10, -20],
        [10, -60],
        [20, -60],
        [20, -20]
    ];

    var mdrPolygon = L.polygon(mdrPolygonCoords, {
        color: '#219ebcff',
        fillColor: '#9ad0eaff',
        fillOpacity: 0.5
    }).addTo(titleMap);

}

pageLoad()