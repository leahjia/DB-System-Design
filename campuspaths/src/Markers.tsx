import {Icon, LatLngExpression} from "leaflet";
import React, {Component} from "react";
import {Marker, Popup, Tooltip} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import markerPinIcon from "leaflet/dist/images/marker-icon.png"
import markerPinShadow from "leaflet/dist/images/marker-shadow.png"

interface MarkersProps {
    position: LatLngExpression,
    message: string
}

class Markers extends Component<MarkersProps, {}> {

    render() {
        return (
            <Marker
                position={this.props.position}
                icon={new Icon({
                    iconUrl: markerPinIcon,
                    shadowUrl: markerPinShadow,
                    iconSize: [25, 40],
                    iconAnchor: [12.5, 40],
                    popupAnchor: [0, -40],
                })}>
                <Popup><h3>{this.props.message}</h3></Popup>
                <Tooltip>{this.props.message}</Tooltip>
            </Marker>
        )
    }
}

export default Markers;
