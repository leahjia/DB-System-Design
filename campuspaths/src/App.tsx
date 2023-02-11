import React, {Component} from 'react';
import Map from "./Map"
import "./App.css";
import SearchSelection from "./SearchSelection";
import {latLng, LatLng, LatLngExpression} from "leaflet";
import {
    UW_LATITUDE, UW_LATITUDE_OFFSET, UW_LATITUDE_SCALE,
    UW_LONGITUDE, UW_LONGITUDE_OFFSET, UW_LONGITUDE_SCALE
} from "./Constants";

// Converts x coordinate to longitude and y coordinate to latitude
function toLatLon(y: number, x: number): LatLng {
    return latLng(UW_LATITUDE + (y - UW_LATITUDE_OFFSET) * UW_LATITUDE_SCALE,
        UW_LONGITUDE + (x - UW_LONGITUDE_OFFSET) * UW_LONGITUDE_SCALE)
}

interface AppState {
    startPt: LatLngExpression, // coordinates of start point
    endPt: LatLngExpression,   // coordinates of end point
    mapLines: JSX.Element[],   // list of MapLines to be drawn
}

class App extends Component<{}, AppState> {

    constructor(props: {}) {
        super(props);
        this.state = {startPt: [0, 0], endPt: [0, 0], mapLines: []}
    }

    // set locations for markers immediately upon selection of the start or end building
    async setPoints(opt: string, rep: string) {

        // check if selection is not a default value
        if (opt !== "" && opt !== "Choose an option") {
            // fetch building information
            let name = opt.substring(0, opt.indexOf(" -"))
            let response = await fetch('http://localhost:4567/path?start=' +
                name + '&end=' + name)
            if (!response.ok) {
                alert("Input is invalid (fetch failed).")
            }
            let parsed = await response.json()
            let newPin = parsed.start
            rep === "start" ?
                this.setState({startPt: toLatLon(newPin.y, newPin.x)}) :
                this.setState({endPt: toLatLon(newPin.y, newPin.x)})
        } else {
            rep === "start" ?
                this.setState({startPt: [0, 0]}) :
                this.setState({endPt: [0, 0]})
        }
    }

    render() {
        return (
            <div className={"app"}>
                <h1 id="appTitle">Campus Path Finder!</h1>
                <Map
                    startPt={this.state.startPt}
                    endPt={this.state.endPt}
                    mapLines={this.state.mapLines}
                />
                <SearchSelection
                    onSearchList={(list) => this.setState({mapLines: list})}
                    onSelectStart={(start) => this.setPoints(start, "start")}
                    onSelectEnd={(end) => this.setPoints(end, "end")}
                />
            </div>
        )
    }

}

export default App;
