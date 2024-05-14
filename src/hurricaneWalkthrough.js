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
                radiusMaxSpeed: (point1.properties.USA_RMW + point2.properties.USA_RMW) / 2,
                startProperties: point1.properties,
                endProperties: point2.properties,
            }
        };
        // console.log(segment)

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
    index;
    segments;
    g;
    trackWidthScale;
    infoViews;
    infoIdxs;

    constructor(data, mapID, walkthroughID) {
        this.data = data.features.sort((a, b) => a.properties.ISO_TIME - b.properties.ISO_TIME);
        this.length = this.data.length;

        this.index = 0;
        this.walkthroughID = walkthroughID;
        this.segments = processGeojson(data)
        this.trackWidthScale = d3.scaleLinear()
            .domain(d3.extent(this.segments, d => d.properties.windSpeed))
            .domain([30, 150])
            .range([20, 150])
            .clamp(true);
        this.mapID = mapID
        this.createMap()

    }

    createMap() {
        this.map = L.map(this.mapID, {
            zoomControl: false,
            dragging: false,
            scrollWheelZoom: false,
            doubleClickZoom: false,
            touchZoom: false,
            interactive: false,
        })

        // found on https://leaflet-extras.github.io/leaflet-providers/preview/index.html
        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            subdomains: 'abcd',
        }).addTo(this.map);
        this.map.attributionControl.setPosition('bottomright');
        this.initialMapView();
    }

    moveMap(lat, lon, zoom) {
        // let distance = map.distance([lat, lon], map.getCenter())
        this.map.panTo([lat, lon], zoom, {duration: .5, animate: true})
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


    // createRoute() {
    //     // let routeFeatures = [];
    //     let latLngs = [];
    //
    //     // let previousCoords = null;
    //     this.data.forEach(feature => {
    //         let coords = feature.geometry.coordinates;
    //         let latLng = new L.LatLng(coords[1], coords[0]);
    //         // let marker = L.marker(latLng);
    //         // routeFeatures.push(marker);
    //         latLngs.push(latLng);
    //
    //         // console.log(feature)
    //
    //         // if (previousCoords) {
    //         //     let line = L.polyline([previousCoords, latLng], {smoothFactor: 1.0});
    //         //     routeFeatures.push(line);
    //         // }
    //         // previousCoords = latLng;
    //     });
    //
    //     // return L.featureGroup(routeFeatures).addTo(this.map);;
    //
    //     return latLngs;
    // }

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

        existingUnion.layer = L.geoJson(updatedUnion, {
            style: {
                color: "red",
                weight: 3,
                opacity: 0.8
            },
            // interactive: false,
        })
        existingUnion.geoJson = updatedUnion;

        return existingUnion;
    }

    getTrackPolygon(endI, begI = 0) {
        let existingUnion = null
        for (let j = begI; j < endI; j++) {
            existingUnion = this.unionSegment(existingUnion, this.segments[j], this.trackWidthScale)
        }

        return existingUnion;
    }

    setTrackViews(idxs) {
        this.infoViews = [];
        this.infoIdxs = idxs;
        let existingUnion = null;

        for (let idx of idxs) {
            let _idx = idx;
            if (_idx == 0) {
                _idx = 1;
            }
            existingUnion = this.getTrackPolygon(_idx);
            existingUnion.index = idx;

            this.infoViews.push(
                existingUnion
            );
        }

        // console.log("infoViews set:", this.infoViews)
    }

    getTrackView(i) {
        if (i == "last") {
            i = this.infoViews.length - 1
        }
        return this.infoViews[i];
    }

    findChangesInColumn(column) {
        // console.log("find changes", this.data)
        const changesIdxs = [0];
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