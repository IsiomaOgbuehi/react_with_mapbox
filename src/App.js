import React from 'react';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import coord from './coord.js';
import NavBar from './navbar';
import Address from './addresses'

class App extends React.Component{
    constructor() {
        super();
        const initial = coord.map(data => <Address key={data.id} places={data} handleClick={this.handleClick} handleOnChange={this.handleOnChange} />);
        this.state = {
            api: [],
            done: false,
            viewport: {
                width: '100vw',
                height: '100vh',
                latitude: 6.493036,
                longitude: 3.288555,
                zoom: 8
            },
            setViewPort: null,
            navData: initial,
            latt: null,
            lngg: null,
            loc_name: null

        };
        this.handleClick = this.handleClick.bind(this);
        this.handleOnChange = this.handleOnChange.bind(this);
    }
    componentDidMount(){
        this.setState(
            {api : coord,
             done: true,
                viewport: {
                    width: '100vw',
                    height: '100vh',
                    marginLeft: '20vw',
                    latitude: 6.493036,
                    longitude: 3.288555,
                    zoom: 8
                },
                setViewPort: null
            },
        )
    }
    handleClick = (id) => {

       //  console.log(id);
       //  console.log(this.state.navData);
        this.state.navData.map(res => {

            if(res.props.places.id === id){
                this.setState({

                    latt: res.props.places.coordinates[0].lat,
                    lngg: res.props.places.coordinates[0].lng,
                    loc_name: res.props.places.name

                });

            }
            return this.state;
        });


    }
    handleOnChange = (e) => {
        let txt = e.target.value.toLowerCase();
        const searched = this.state.api.filter(data => data.address.toLowerCase().includes(txt) ? data : null);

        const filtered = searched.map(data => <Address key={data.id} places={data} handleClick={this.handleClick} handleOnChange={this.handleOnChange} />)
        this.setState({
            navData: filtered
        });
        console.log(this.state.navData);
    }

    handleKeyboardEvent = e => {
        if(e.key === 'Escape'){
            this.setState({

                latt: null,
                lngg: null,
                loc_name: null

            })
        }
        return window.removeEventListener("keydown", this);
    }


    // const [viewport, setViewPort] = useState({
    //                                              width: '100vw',
    //                                              height: '100vh',
    //                                              latitude: 6.493036,
    //                                              longitude: 3.288555,
    //                                              zoom: 8
    //                                          });
    // console.log(api);
    render(){
        // this.state.navData = this.state.api.map(data => <Address key={data.id} places={data} handleClick={this.handleClick} handleOnChange={this.handleOnChange} />);
            const handleKey = window.addEventListener("keydown", this.handleKeyboardEvent);
    return (

        <div>
            <NavBar addressList={this.state.navData} searchText={this.handleOnChange} />
            <ReactMapGL {...this.state.viewport}
                        mapboxApiAccessToken={"pk.eyJ1IjoiaXNpb21hIiwiYSI6ImNqemhpcTYwMDBkaWIzZm16dG5ucHdweW0ifQ.fAQlsUYEzVN2st5qft2IKw"}
                        mapStyle="mapbox://styles/isioma/cjzi11o2t2yjv1cqlraiqesb0"
                        onViewportChange={(viewport) => this.setState({viewport})}>
                {this.state.navData.map(data => (
                    <Marker key={data.props.places.id} latitude={data.props.places.coordinates[0].lat} longitude={data.props.places.coordinates[0].lng}>
                        <div className="marker"><i className="fa fa-map-marker"></i></div>
                    </Marker>
                ))}
                {this.state.latt && this.state.lngg ?
                    (<Popup
                        latitude={this.state.latt}
                        longitude={this.state.lngg}
                        onClose={() => {
                            this.setState({

                                latt: null,
                                lngg: null,
                                loc_name: null

                            });
                }}>
                        <div>
                            <h2>{this.state.loc_name}</h2>
                        </div>
                    </Popup>) : null
                }

            </ReactMapGL>
        </div>
    );
    }
}

export default App;