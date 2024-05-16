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
                    return `<span style="color: #a17738ff; opacity: .8">${symbols[Math.floor(Math.random() * symbols.length)]}</span>`;
                }
            }).join('');

            return result;
        });

        container.html(currentParts.map((part, i) => part + (oldSeparators[i] || '')).join(''));
    };

    let scrambler = d3.interval(update, 100);

    setTimeout(() => {
        scrambler.stop();
        container.html(newParts.map((part, i) => part + (i < oldSeparators.length ? oldSeparators[i] : '')).join(''));
    }, 350);
}

function animateIncreaseDecrease(newStr, container) {
    // console.log(container.node())
    // let containerHeight = container.style('height')
    // container.style("height", containerHeight)
    // console.log("height", containerHeight)

    let currentTextContainer = container.select(".current-text");

    // let newTextContainer = container.select(".new-text");

    if (!currentTextContainer.node()) {
        console.error("Text containers not found, skipping animation.");
        return;
    }


    // if (newTextContainer.node() != null) {
    //     newTextContainer.remove();
    // }

    let oldStr;
    try {
        oldStr = currentTextContainer.html();
    } catch (error) {
    }

    let oldNumber = parseInt(oldStr, 10);
    let newNumber = parseInt(newStr, 10);

    let diff = newNumber - oldNumber;
    let increase = diff > 0;

    let changeColor = increase ? "red" : "green"
    let dimOpacity = .6
    if (diff === 0) {
        return
        changeColor = "grey";
        dimOpacity = 1
    }

    let duration = 425

    currentTextContainer
        .style("text-shadow", `0px 0px 0px ${changeColor}`)
        .html(newStr)
        .transition()
        .duration(duration)
        .style("color", changeColor)
        .style("opacity", dimOpacity)
        .style("text-shadow", `0px 0px 4px ${changeColor}`)
        .on("end", () => {
            currentTextContainer
                .transition()
                .duration(duration)
                .style("text-shadow", `0px 0px 0px ${changeColor}`)
                .style("color", null)
                .style("opacity", null)
                .on("end", () => {
                    currentTextContainer.style("text-shadow", null)
                })
        })
}


// function animateIncreaseDecrease(newStr, container) {
//     // console.log(container.node())
//     // let containerHeight = container.style('height')
//     // container.style("height", containerHeight)
//     // console.log("height", containerHeight)
//
//     let currentTextContainer = container.select(".current-text");
//     let newTextContainer = container.select(".new-text");
//
//     if (!currentTextContainer.node()) {
//         console.error("Text containers not found, skipping animation.");
//         return;
//     }
//
//
//     if (newTextContainer.node() != null) {
//         newTextContainer.remove();
//     }
//
//     let oldStr = 0;
//     try {
//         oldStr = currentTextContainer.html();
//     } catch (error) {
//     }
//
//     let oldNumber = parseInt(oldStr, 10);
//     let newNumber = parseInt(newStr, 10);
//
//     let diff = newNumber - oldNumber;
//     let increase = diff > 0;
//
//     let changeColor = increase ? "red" : "green"
//     let dimOpacity = .6
//     if (diff === 0) {
//         return
//         changeColor = "grey";
//         dimOpacity = 1
//     }
//
//     let currentTextMove = increase ? "-" : ""
//     let currentTextEase = d3.easeExpOut
//     let newTextStart = increase ? "" : "-"
//     let newTextEase = d3.easeExpOut
//
//     let translateDist = 15;
//     let duration = 250
//
//     newTextContainer = container.append('div')
//         .classed("new-text", true)
//         .style("color", changeColor)
//         .style("opacity", 0)
//         .style("transform", `translateY(${newTextStart}${translateDist}px) rotateX(${currentTextMove}90deg)`)
//         .html(newStr);
//
//     currentTextContainer
//         .transition()
//         .duration(20)
//         .style("opacity", dimOpacity)
//         .transition()
//         .duration(duration/2)
//         .style("color", changeColor)
//
//     currentTextContainer
//         .transition()
//         .ease(currentTextEase)
//         .duration(duration)
//         .style("transform", `translateY(${currentTextMove}${translateDist}px) rotateX(${newTextStart}90deg)`)
//         .style("color", changeColor)
//         .style("opacity", 0)
//         .on("end", () => {
//
//             newTextContainer
//                 .classed("current-text", true)
//                 .classed("new-text", false)
//                 .transition()
//                 .ease(newTextEase)
//                 .duration(duration)
//                 .style("opacity", dimOpacity)
//                 .style("transform", "translateY(0px) rotateX(0deg)")
//                 .transition()
//                 .style("opacity", 1)
//                 .transition()
//                 .delay(200)
//                 .duration(duration*2)
//                 .style("color", null)
//
//             // currentTextContainer.remove()
//
//         })
//         .remove();
//
// }

function formatISOStr(isoStr) {
    // let parseTime = d3.timeParse("%m/%d/%y %H:%M");
    let parseTime = d3.timeParse("%Y-%m-%d %H:%M:%S");

    // let formatDate = d3.timeFormat("%m/%d/%Y");
    let formatDate = d3.timeFormat("%b %d, %Y");
    let formatTime = d3.timeFormat("%I:%M");
    let formatAMPM = d3.timeFormat("%p");


    let date = parseTime(isoStr);
    let formattedDate = [formatDate(date), formatTime(date), formatAMPM(date)];

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
    // idxs.unshift(0)
    idxs.splice(2, 0, 17)
    idxs.splice(2, 0, 17)
    if (!idxs.includes(walkthrough.data.length - 1)) { idxs.push(walkthrough.data.length - 1) }

    idxs.splice(idxs.length - 2, 2)
    idxs.splice(8, 2)

    // const latlngs = walkthrough.data.map(function (feature) {
    //     return [
    //         feature.geometry.coordinates[1],
    //         feature.geometry.coordinates[0]
    //     ];
    // });

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
    const mapHeaderDate = mapHeader.select("#datedate")
    const mapHeaderTime = mapHeader.select("#datetime")
    const mapHeaderAMPM = mapHeader.select("#dateAMPM")
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
        let fmtdDateTime = formatISOStr(date)
        animateTransition(fmtdDateTime[0], mapHeaderDate, ["-", "/", "<br>"])
        animateTransition(fmtdDateTime[1], mapHeaderTime, ["-", "/", "<br>"])
        animateTransition(fmtdDateTime[2], mapHeaderAMPM, ["-", "/", "<br>"])
        // animateTransition(windSpeedStr, mapHeaderWindSpeed, [])
        // animateTransition(stormClf + "", mapHeaderStormClf, [" ", " "])

        animateIncreaseDecrease(stormClf, mapHeaderStormClf)
        animateIncreaseDecrease(windSpeedStr, mapHeaderWindSpeed)

        updateTooltipValueText()
    }

    let mapOverlayContainers = d3.selectAll(".overlay-map").nodes()

    mapOverlayContainers.forEach(function (parent, i) {
        gsap.timeline({
            scrollTrigger: {
                trigger: parent,
                scroller: infoContainer,
                // markers: true,
                start: "top bottom-=5px", //-=100",
                end: "bottom bottom-=5px", //-=100",
                onEnter: () => {
                    mapHeader
                        .style("display", 'none')
                        .style("visibility", 'hidden');
                    mapHeaderTooltip
                        .style("display", "none")

                },
                onEnterBack: () => {
                    mapHeader
                        .style("display", 'none')
                        .style("visibility", 'hidden');
                    mapHeaderTooltip
                        .style("display", "none")
                },
                onLeave: () => {
                    mapHeader
                        .style("display", 'flex')
                        .style("visibility", 'visible');
                },
                onLeaveBack: () => {
                    mapHeader
                        .style("display", 'flex')
                        .style("visibility", 'visible');
                },
                scrub: 3,
            },
            toggleActions: "restart reverse restart reverse",
        })
    })
    const mdrPolygonCoords = [
        [10, -20],
        [10, -85],
        [20, -85],
        [20, -20]
    ];
    let mdrPolygon = L.polygon(mdrPolygonCoords, {
        // color: "#1C2143",
        color: '#219ebcff',
        fillColor: '#219ebcff',
        fillOpacity: 0.2,
        interactive: false,
    })
    let nino3_4Polygon = L.polygon([
        [5, -170],
        [5, -120],
        [-5, -120],
        [-5, -170],
    ], {
        // color: "#1C2143",
        color: '#219ebcff',
        fillColor: '#219ebcff',
        fillOpacity: 0.2,
        interactive: false,
    })


    let form2Prev = false;

    trackPolygon.addTo(walkthrough.map)
    infoParents.forEach(function (parent, i) {
        if (infoChildren[i]) {
            let target = infoChildren[i];
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
                    // markers: true,
                    start: "top bottom-=5", //-=100",
                    end: "bottom bottom-=5", //-=100",
                    onEnter: () => {
                        changeHeader(i)
                        toolTipTextExplanation.html("")
                        toolTipInfoIcon.text("info_i")
                        hideTooltip()


                    },
                    onEnterBack: () => {
                        changeHeader(i)
                        toolTipTextExplanation.html("")
                        toolTipInfoIcon.text("icon_i")
                        hideTooltip()
                    },
                    onUpdate: (self) => {
                        updateTooltipValueText()
                        // let currentZoom = walkthrough.map.getZoom();
                        if (target.id == "formation-2") {


                            mdrPolygon.addTo(walkthrough.map)

                            walkthrough.map.flyToBounds(mdrPolygon.getBounds(), {
                                duration: .1,
                                animate: true,
                                padding: [30, 30]
                            })
                            form2Prev = true
                        } else if (target.id == "formation-3") {
                            nino3_4Polygon.addTo(walkthrough.map)

                            walkthrough.map.flyToBounds(nino3_4Polygon.getBounds(), {
                                duration: .1,
                                animate: true,
                                padding: [100, 30]
                            })
                            form2Prev = true
                        } else {
                            if (mdrPolygon) {mdrPolygon.remove()}
                            if (nino3_4Polygon) {nino3_4Polygon.remove()}
                            simTrackPolygon.setLatLngs(interpolator(self.progress))
                            walkthrough.map.flyToBounds(simTrackPolygon.getBounds(), {
                                duration: .1,
                                animate: form2Prev,
                                padding: [30, 30]
                            })
                            trackPolygon.setLatLngs(interpolator(self.progress))
                            form2Prev = false
                        }
                    },
                    scrub: 2,
                },
                toggleActions: "restart reverse restart reverse",
            })
                .fromTo(target,
                    // {y: "100%"},
                    {y: "100vh"},
                    {
                        y: function() {
                            let targetHeight = target.offsetHeight;
                            if (targetHeight > 400) {
                                return (window.innerHeight / 2) - (target.offsetHeight / 2);
                            } else {
                                return "random([20vh,19vh,16vh,23vh,18vh])";
                            }
                        },
                        duration: .5, ease: "power1.inOut"
                    },
                    // {y: "random([20vh,27vh,32vh,25vh,21vh])", duration: .5, ease: "power1.inOut"},
                )
        } else {
            console.error("NO INFO CHILD", i)
        }
    })

    const titleMap = L.map("title-page-map", {
        zoomControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        interactive: true
    })

    // found on https://leaflet-extras.github.io/leaflet-providers/preview/index.html
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        // attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
    }).addTo(titleMap);

    let geoJson = walkthrough.getTrackView('last').geoJson;
    const finalKatrinaTrack = L.polygon(reverseLatLon(geoJson.geometry.coordinates[0]), {
        color: "#1C2143",
        fillColor: '#F3CD74',
        fillOpacity: 0.8,
        className: "track-path",
        interactive: false,
    }).addTo(titleMap);
    // titleMap.fitBounds(finalKatrinaTrack.getBounds(), {
    //     padding: [10, 160]
    // })

    titleMap.setView([30, -75], 5)

    // let coordsDisplay = document.getElementById('coords');
    //
    // titleMap.on('mousemove', function (e) {
    //     let lat = e.latlng.lat.toFixed(5);
    //     let lng = e.latlng.lng.toFixed(5);
    //     coordsDisplay.innerHTML = `Latitude: ${lat}, Longitude: ${lng}`;
    // });

    let mapHeaderTooltip = d3.select("#map-header-tooltip")
    let mapHeaderParentStormClf = d3.select("#storm-clf")

    let timeout;

    function showTooltip() {
        clearTimeout(timeout);
        mapHeaderTooltip
            .style("display", null)
            .transition()
            .duration(200)
            .style("opacity", 1)
        toolTipInfoIcon
            .style("display", null)
        updateTooltipValueText()
    }

    function hideTooltip(timeoutTime = 500) {
        if (toolTipTextExplanation.html() === "") {
            timeout = setTimeout(() => {
                mapHeaderTooltip
                    .transition()
                    .duration(200)
                    .style("opacity", 0)
                    .on("end", () => {
                        mapHeaderTooltip
                            .style("display", "none")
                    })
                toolTipInfoIcon.html("info_i")
            }, timeoutTime);
        }
    }

    async function updateTooltipValueText() {

        let element = d3.select("#storm-clf")
        let node = element.node()
        let bbox = node.getBoundingClientRect()
        let sshsValue;
        try {
            sshsValue = await element.select(".map-header-info-value").select(".current-text").text()
        } catch (error) {
            console.error("text not loading, reload page")
            sshsValue = "0"
        }
        mapHeaderTooltip.select("#tooltip-current-text")
            .html(sshsExplanationDict[sshsValue])

        mapHeaderTooltip
            .style("top", `${bbox.y + bbox.height + 10}px`)
    }

    mapHeaderParentStormClf
        .on("mouseover", (event, d) => {
            showTooltip()

        })
        .on("mouseout", (event, d) => {
            hideTooltip()
        })

    mapHeaderTooltip
        .on("mouseover", (event, d) => {
            showTooltip()
        })
        .on("mouseout", (event, d) => {
            hideTooltip()
        })

    let toolTipTextExplanation = mapHeaderTooltip.select("#tooltip-text")
    let toolTipInfoIcon = mapHeaderTooltip.select("#tooltip-info-icon")

    d3.select("#tooltip-info-icon")
        .on("click", function() {
            if (toolTipTextExplanation.html() == "") {
                toolTipTextExplanation
                    .style("display", null)
                    .html(sshsExplanationHtml)
                toolTipInfoIcon.text("remove")
            } else {
                toolTipTextExplanation
                    .style("display", "none")
                    .html("")
                toolTipInfoIcon.text("info_i")
            }
        })

    d3.select("#tooltip-close-button")
        .on("click", () => {
            // hideTooltip(0)
            mapHeaderTooltip
                .transition()
                .duration(200)
                .style("opacity", 0)
                .on("end", () => {
                    mapHeaderTooltip
                        .style("display", "none")
                    toolTipInfoIcon
                        .style("display", null)
                        .text("info_i")
                    toolTipTextExplanation
                        .style("display", "none")
                        .html("")
                })


        })

    mapHeaderTooltip
        .style("display", "none")


    function hoverWordExplanation(elemID, explanation) {
        let elem = d3.select(elemID);

        elem.on("mouseover", (event) => {
            d3.select("#definition-popup")
                .html(explanation)
                .transition()
                .duration(200)
                .style("left", event.x + "px")
                .style("display", "block")
                .style("opacity", 1).style("top", event.y + 2 + "px")
        })
            .on("mouseout", (event) => {
                d3.select("#definition-popup")
                    .transition()
                    .delay(2000)
                    .duration(200)
                    .style("opacity", 0)
                    .style("top", null)
                    .style("left", null)
                    .style("display", null)
                    .on("end", () => {
                        d3.select("#definition-popup").html("")
                    })
            })
    }

    let explanation = `"Vertical wind shear is the change in wind speed with height." <a href="https://www.noaa.gov/jetstream/tropical/tropical-cyclone-introduction"
                         target="_blank">(CITE)</a>`
    hoverWordExplanation("#vertical-wind-shear", explanation)


    function alignContainers() {
        function getScrollbarWidth(elementId) {
            var element = d3.select(elementId).node();
            if (element) {
                return element.offsetWidth - element.clientWidth;
            }
            return 0;
        }

        let scrollbarWidth = getScrollbarWidth("#info-container")

        let mapCont = d3.select("#map-container")
        let interactivesCont = d3.select("#interactives-container")

        mapCont
            .style("width", `calc(100% - ${scrollbarWidth}px)`)
            .style("margin-right", `${scrollbarWidth}px`)

        interactivesCont
            .style("width", `calc(100% - ${scrollbarWidth}px)`)
            .style("margin-right", `${scrollbarWidth}px`)
    }

    alignContainers();

    d3.select(window).on("resize", function () {
        alignContainers();
    });
}

pageLoad().then(async r => {
    await requestDataCharts();
})