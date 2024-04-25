function processGeojson(geojsonData) {
    let segments = [];

    for (let i = 0; i < geojsonData.features.length - 1; i++) {
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

                startProperties: point1.properties,
                endProperties: point2.properties,
            }
        };

        segments.push(segment);
    }
    return segments;
}



class HurricaneTrack {
    walkthroughID;
    data;
    length;
    prevPoint = null;
    currentPoint = null;
    changes = null;
    map;
    mapID;
    currentZoom;
    index;
    svgLayer;
    svg;
    segments;
    g;
    sshsScale;
    infoViews;
    infoIdxs;
    currentLayer = null;
    currentPath;
    pathGenerator;

    constructor(data, mapID, walkthroughID) {
        this.data = data.features.sort((a, b) => a.properties.ISO_TIME - b.properties.ISO_TIME);
        this.length = this.data.length;
        this.index = 0;
        this.walkthroughID = walkthroughID;
        this.segments = processGeojson(data)
        this.sshsScale = d3.scaleLinear()
            .domain(d3.extent(this.segments, d => d.properties.windSpeed))
            .range([5, 100]);
        this.mapID = mapID
        this.createMap()

    }

    createMap () {
        this.map = L.map(this.mapID, {
            // zoomControl: false,
            // dragging: false,
            // scrollWheelZoom: false,
            // doubleClickZoom: false,
            // touchZoom: false
        })

        // found on https://leaflet-extras.github.io/leaflet-providers/preview/index.html
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
        }).addTo(this.map);
        this.map.attributionControl.setPosition('bottomright');
        this.initialMapView();
        if (!this.svgLayer) {
            this.svgLayer = L.svg({clickable: true}).addTo(this.map);
            console.log('svgLayer', this.svgLayer)
            this.svg = d3.select(this.svgLayer._container)
                // .style('transform', 'none ');
            this.g = this.svg.append("g").attr("class", "hurricane-path-g");
        }
        this.currentPath = this.g.append("path")
            .attr("class", "track-path")
            .style("fill", "none")
            .style("stroke", "red")
            .style("stroke-width", "3");

        this.pathGenerator = d3.geoPath().projection(this.createProjection());



        const updateSvg = () => {
            const bounds = this.map.getBounds();
            const topLeft = this.map.latLngToLayerPoint(bounds.getNorthWest());
            const bottomRight = this.map.latLngToLayerPoint(bounds.getSouthEast());

            this.svg
                .attr("width", bottomRight.x - topLeft.x)
                .attr("height", bottomRight.y - topLeft.y)
                .style("left", topLeft.x + "px")
                .style("top", topLeft.y + "px")
                .style("border", "2px solid black")
                // .style("transform", `translate3d(${-topLeft.x}px, ${-topLeft.y}px, 0px)`)



            this.g.attr("transform", `translate(${-topLeft.x},${-topLeft.y})`);

            this.g.selectAll("path").attr("d", this.pathGenerator(this.g.attr('g')));


            console.log("Path data:", this.g.selectAll("path").attr("d"));
            console.log("Top left:", topLeft);
            console.log("Bottom right:", bottomRight);
            console.log("SVG dimensions:", bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
            console.log("Check if g is selected:", this.svg.node());
            console.log("Check transform attribute:", this.g.attr("transform")); // Check if the transform attribute is set
            console.log("Translation values:", -topLeft.x, -topLeft.y);


        }

        updateSvg.bind(this)();

        this.map.on("viewreset", updateSvg.bind(this));
        this.map.on("zoomend", updateSvg.bind(this));
        this.map.on("moveend", updateSvg.bind(this));


    }

    createProjection() {
        const map = this.map;
        return d3.geoTransform({
            point: function (x, y) {
                const point = map.latLngToLayerPoint(new L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        });
    }

    moveMap(lat, lon, zoom) {
        // let distance = map.distance([lat, lon], map.getCenter())
        this.map.panTo([lat, lon], zoom, { duration: .5, animate: true})
    }

    initialMapView() {
        this.currentPoint = this.data[0]
        this.map.setView([this.currentPoint.geometry.coordinates[1], this.currentPoint.geometry.coordinates[0]], 7)
    }

    next(i) {
        if (i == null) {
            i = (this.index) ? this.index : 1;
        }
        if (this.index + i < this.length) {
            this.index += i;
            this.prevPoint = this.currentPoint;
            this.currentPoint = this.data[this.index];
            // console.log(this.index)
            // console.log(this.currentPoint)

            if (this.currentPoint.LAT == null || this.currentPoint.LON == null) {
                console.error("Invalid data point:", point);
                return;
            }

            this.moveMap(this.currentPoint.LAT, this.currentPoint.LON, 7)

        } else {
            console.log("No more steps")
        }
    }

    goToIdx(i) {
        if (i < this.length) {
            this.prevPoint = this.currentPoint;
            this.index = i;
            this.currentPoint = this.data[this.index];
            // console.log(this.index)
            // console.log(this.currentPoint)

            if (this.currentPoint.LAT == null || this.currentPoint.LON == null) {
                console.error("Invalid data point:", point);
                return;
            }

            this.moveMap(this.currentPoint.LAT, this.currentPoint.LON, 7)

        } else {
            console.error("Invalid index: " + i)
        }
    }

    unionSegment(existingUnion, newSegment, widthScale) {
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

        // if (existingUnion.layer) {
        //     map.removeLayer(existingUnion.layer);
        // }

        existingUnion.layer = L.geoJson(updatedUnion, {
            style: {
                color: "red",
                weight: 3,
                opacity: 0.8
            }
        })
        existingUnion.geoJson = updatedUnion;

        // console.log("unionSegment geojson", updatedUnion)
        return existingUnion;
    }

    getTrackPolygon(endI, begI = 0) {
        let existingUnion = null
        for (let j = begI; j < endI; j++) {
            existingUnion = this.unionSegment(existingUnion, this.segments[j], this.sshsScale)
        }

        return existingUnion;
    }

    setTrackViews(idxs) {
        this.infoViews = [];
        this.infoIdxs = idxs;
        let existingUnion = null;

        for (let idx of idxs) {
            existingUnion = this.getTrackPolygon(idx);
            existingUnion.index = idx;

            this.infoViews.push(
                existingUnion
            );
        }

        // console.log("infoViews set:", this.infoViews)
    }

    setTrackView(idx) {
        // let infoIdx = this.idx[this.infoIdxs];
        // let infoIdx = this.infoIdxs.indexOf(idx)
        const thisView = this.infoViews[idx];
        let newGeoJson = thisView.geoJson;
        let newPath = this.pathGenerator(newGeoJson)
        // let newPath = this.pathFromGeoJson(newGeoJson, this.map)
        const oldPath = this.currentPath.attr("d") || ""

        if (oldPath) {
            const interpolator = flubber.interpolate(oldPath, newPath, {
                maxSegmentLength: 10
            });

            this.currentPath.transition()
                .duration(500)
                .attrTween("d", () => t => interpolator(t))
        } else {
            // console.log("new path", newPath)
            this.currentPath.attr("d", newPath)
            // this.g.selectAll("path").attr("d", this.pathGenerator(this.newPath))
        }
        // this.g.selectAll("path").attr("d", this.pathGenerator(this.g.attr('g')));

        this.map.flyToBounds(thisView.layer.getBounds(), {duration: .4, animate: true})


        // console.log("infoview", this.infoViews[idx])
        // console.log("infoview geoj", this.infoViews[idx].geoJson)
        //
        // console.log("newGeoJson", newGeoJson)
        // console.log("oldpath", oldPath)
        // console.log("newpath", newPath)



        // if (this.currentPath.attr("d")) {
        //     console.log("attr d yes!")
        //
        // } else {
        //     console.log("attr d no")
        // }


        // let existingUnion, layer;
        // if (this.currentLayer) {
        //     // this.map.removeLayer(this.currentLayer)
        //     // let interpolator = flubber.interpolate(this.
        //     existingUnion = this.infoViews[idx];
        //     layer = existingUnion.layer;
        //
        //     layer.addTo(this.map)
        //     this.currentLayer = layer
        //
        //     console.log("d3 selecting map",d3.select(this.mapID))
        //     console.log("map id", this.mapID)
        //
        //     console.log('current layer', this.currentLayer)
        // } else {
        //     existingUnion = this.infoViews[idx];
        //     layer = existingUnion.layer;
        //
        //
        //
        //     layer.addTo(this.map)
        //     this.currentLayer = layer
        // }

        // updatePath(newSegment)




        // existingUnion = addAndUnionSegment(existingUnion, segments[i], walkthrough.map, sshsScale)
        // let bounds = existingUnion.layer.getBounds()


    }

    // pathFromGeoJson(geoJson, map) {
    //     // const geoGenerator = d3.geoPath().projection(d3.geoTransform({
    //     //     point: function (x, y) {
    //     //         const point = map.latLngToLayerPoint(new L.LatLng(y, x));
    //     //         this.stream.point(point.x, point.y);
    //     //     }
    //     // }));
    //
    //     // return geoGenerator(geoJson);
    //     return this.pathGenerator(geoJson);
    // }

    findChangesInColumn(column) {
        // console.log("find changes", this.data)
        const changesIdxs = [];
        let previousPoint = this.data[0].properties[column];
        for (let i = 1; i < this.length; i++) {
            let currentPoint = this.data[i].properties[column];
            if (currentPoint !== previousPoint) {
                changesIdxs.push(i);
                previousPoint = currentPoint;
            }
        }
        return changesIdxs;
    }
}