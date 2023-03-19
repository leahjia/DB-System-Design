
import {LatLng, latLng, LatLngExpression} from "leaflet";
import React, {Component, useState} from "react";
import {MapContainer, TileLayer, useMapEvents} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    UW_LATITUDE,
    UW_LATITUDE_CENTER,
    UW_LATITUDE_OFFSET,
    UW_LATITUDE_SCALE,
    UW_LONGITUDE,
    UW_LONGITUDE_CENTER,
    UW_LONGITUDE_OFFSET,
    UW_LONGITUDE_SCALE
} from "./Constants";
import Markers from "./Markers";

// coordinates of the UW Seattle campus
let defaultPosition: LatLngExpression = [UW_LATITUDE_CENTER, UW_LONGITUDE_CENTER];

interface MapProps {
    mapLines: JSX.Element[],
    startPt: LatLngExpression,
    endPt: LatLngExpression,
}

// Converts x coordinate to longitude and y coordinate to latitude
function toLatLon(y: number, x: number): LatLng {
    return latLng(UW_LATITUDE + (y - UW_LATITUDE_OFFSET) * UW_LATITUDE_SCALE,
        UW_LONGITUDE + (x - UW_LONGITUDE_OFFSET) * UW_LONGITUDE_SCALE)
}

class Map extends Component<MapProps, {}> {

    render() {

        const paths = this.props.mapLines
        //calculate the mid-point of the path to zoom in on
        let midPt = Math.round(paths.length / 2)
        let newCenter = paths.length === 0 ? defaultPosition :
            toLatLon(Number(paths[midPt].props.y1), Number(paths[midPt].props.x1))

        // helper method to initiate zoom in
        function FlyToHelper() {
            if (newCenter !== defaultPosition) {
                FlyTo(newCenter, 4, 14)
            } else {
                FlyTo(defaultPosition, 1, 15)
            }
            return null
        }

        // feature to zoom in on the path found
        function FlyTo(center: LatLngExpression, scale: number, size: number) {
            const map = useMapEvents({
                mouseover() {
                    map.flyTo(center, map.getScaleZoom(scale, size))
                }
            })
            return null
        }

        // pin a marker on user's current location with a popup message
        function LocationMarker() {
            let initPt = latLng(0, 0)
            const [currPosition, setPosition] = useState(initPt)
            const map = useMapEvents({
                mousemove() {
                    map.locate()
                },
                locationfound(event) {
                    setPosition(event.latlng)
                },
            })
            return <Markers position={currPosition} message={"YOU ARE HERE"}/>
        }

        return (
            <div id="map">
                <MapContainer
                    id="container"
                    center={newCenter}
                    zoom={15}
                    doubleClickZoom={true}
                    scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                    <LocationMarker/>
                    <Markers position={this.props.startPt} message={"START BUILDING"}/>
                    <Markers position={this.props.endPt} message={"END BUILDING"}/>
                    <div>{this.props.mapLines}</div>
                    <FlyToHelper/>
                </MapContainer>
            </div>
        )
    }
}

export default Map;
