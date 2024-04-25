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
        .range([5,100])

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

    const infoSections = d3.selectAll(".info-child")
    // console.log("infoSections", infoSections)
    infoSections.each(function (d, i) {
        let trigger = {
            trigger: this,
            markers: false,
            // start: "-100% center",
            // end: "100% center",
            start: "-50% 80%",
            end: "0% 80%",
            onEnter: (self) => {
                walkthrough.setTrackView(i)
            },
            onEnterBack: (self) => {
                walkthrough.setTrackView(i)
            },
            scrub: 1,
            snap: {snapTo: "labels"}, //.5,
        }




        gsap.timeline({
            scrollTrigger: trigger,
            toggleActions: "restart reverse restart reverse",
        })
            .fromTo(this,
                {y: "100vh"},
                {y: "50vh"},
            )
            .addLabel("middle")
            .to(this, {
                y: "00vh",
                // scrollTrigger: trigger,
            })
    })

}

pageLoad()