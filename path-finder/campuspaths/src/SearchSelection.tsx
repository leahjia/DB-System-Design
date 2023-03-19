import React, {Component} from 'react'
import MapLine from "./MapLine";

interface SearchSelectionProps {
    onSelectStart: (str: string) => void
    onSelectEnd: (str: string) => void
    onSearchList: (list: JSX.Element[]) => void
}

interface SearchSelectionState {
    start: string,           // start building name
    end: string,             // end building name
    buildingNames: string[], // all building names in a list
    lines: JSX.Element[],    // lines to be drawn
    selectStart: string,     // selected start building
    selectEnd: string,       // selected destination
    color: string,           // color of the path
}

class SearchSelection extends Component<SearchSelectionProps, SearchSelectionState> {

    constructor(props: SearchSelectionProps) {
        super(props)
        this.state = {
            start: "Choose an option",
            end: "Choose an option",
            buildingNames: [],
            lines: [],
            selectStart: "",
            selectEnd: "",
            color: "RED",
        }
    }

    // fetch all building names for dropdown list
    componentDidMount() {
        fetch('http://localhost:4567/names')
            .then(response => response.json())
            .then(parsed => this.setState({
                buildingNames: (Object.keys(parsed).map(
                    function (key) {
                        return key + " - " + parsed[key]
                    })).sort()
            }))
    }

    // handle change of start string and start marker
    handleStartChange = (start: any) => {
        this.setState({start: start.target.value,})
        this.setState({selectStart: start.target.value,},
            () => {
                this.props.onSelectStart(this.state.selectStart)
            })
    }

    // handle change of end string and end marker
    handleEndChange = (end: any) => {
        this.setState({end: end.target.value})
        this.setState({selectEnd: end.target.value,},
            () => {
                this.props.onSelectEnd(this.state.selectEnd)
            }
        )
    }

    // reset all stored routes, markers, and selections
    handleClear = (init: string) => {
        this.setState({start: init, end: init, lines: [], selectStart: "", selectEnd: ""},
            () => {
                this.props.onSelectStart(this.state.selectStart)
                this.props.onSelectEnd(this.state.selectEnd)
                this.props.onSearchList(this.state.lines)
            })
    }

    handleColor = (color: any) => {
        this.setState({color: color.target.value})
    }

    // fetch the paths from start to end
    async sendRequest(startStr: string, endStr: string) {
        try {
            if (startStr !== "Choose an option" && endStr !== "Choose an option") {
                // update the state for start and end
                this.setState({start: startStr, end: endStr})

                // extract short names
                let start = startStr.substring(0, startStr.indexOf(" -"))
                let end = endStr.substring(0, endStr.indexOf(" -"))

                // send request to find path
                let response = await fetch('http://localhost:4567/path?start=' +
                    start + '&end=' + end)
                if (!response.ok) {
                    alert("Input is invalid (fetch failed).")
                }
                let parsed = await response.json()

                // collect MapLines for map
                const arrayOfLines: JSX.Element[] = []
                for (let i = 0; i < parsed.path.length; i++) {
                    console.log(this.state.color)
                    arrayOfLines.push(
                        <MapLine
                            x1={parsed.path[i].start.x}
                            y1={parsed.path[i].start.y}
                            x2={parsed.path[i].end.x}
                            y2={parsed.path[i].end.y}
                            color={this.state.color}
                            key={"Line #" + i}
                        ></MapLine>
                    )
                }
                this.setState({lines: arrayOfLines}, () => {
                    this.props.onSearchList(this.state.lines)
                })
            } else {
                this.setState({lines: []}, () => {
                    this.props.onSearchList(this.state.lines)
                })
            }
        } catch (e) {
            alert("Input is invalid (to json() failed).")
        }
    }

    render() {
        const colors = ["BLUE", "CYAN", "GREEN", "MAGENTA", "BLACK"]
        return (
            <div>
                <h3 id="prompt">Start from:
                    <select id="dropdownList"
                            value={this.state.start}
                            onChange={(start) => {
                                this.handleStartChange(start)
                            }}>
                        <option id="dropdownItems">Choose an option</option>
                        {this.state.buildingNames.map((name) => (
                            <option key={name}>{name}</option>))}
                    </select>
                </h3>
                <h3 id="prompt">To destination:
                    <select id="dropdownList"
                            value={this.state.end}
                            onChange={(end) => {
                                this.handleEndChange(end)
                            }}>
                        <option id="dropdownItems">Choose an option</option>
                        {this.state.buildingNames.map((name) => (
                            <option key={name}>{name}</option>))}
                    </select>
                </h3>

                <h3 id="prompt">Color:
                    <select id="dropdownList"
                            value={this.state.color}
                            onChange={(color) => {
                                this.handleColor(color)
                            }}>
                        <option id="dropdownItems">{"RED"}</option>
                        {colors.map((name) => (
                            <option key={name}>{name}</option>))}
                    </select>
                </h3>

                <h3 id="prompt">
                    <button id="buttons"
                            onClick={() => this.sendRequest(this.state.start, this.state.end)}>Search
                    </button>
                    <button id="buttons"
                            onClick={() => this.handleClear("Choose an option")}>Clear
                    </button>
                </h3>
            </div>
        )
    }
}

export default SearchSelection
