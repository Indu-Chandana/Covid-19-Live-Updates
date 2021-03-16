import React, { useEffect, useState } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from './InfoBox';
import Map from './Map';
import './App.css';
import Table from "./Table";
import {prettyPrintStat, sortData} from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
//import { useMap } from "react-leaflet";


function App() {
  const[countries, setCountries] = useState([]);
  const[country, setCountry] = useState('worldwide');
  const[countryInfo, setCountryInfo] = useState({});
  const[tableData, setTableData] = useState([]);
  const[mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796});
  const[mapZoom, setMapZoom] = useState(3);
  const[mapCountries, setMapCountries] = useState([]);
  const[casesType, setCasesType] = useState("cases");
  

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    });
  }, []);

//https://disease.sh/v3/covid-19/countries
//USEEFFECT = Run a piece of code based on a given condition

useEffect(()=> {
  //The code inside here will run once when the component loads and not again
  //async -> send a request, wait for it, do something with info


  const getCountriesData = async () => {
    await fetch("https://disease.sh/v3/covid-19/countries")
    .then((response)=> response.json())
    .then((data) => {
      const countries = data.map((country) => ( //MAP -> item1, item2, .........
        {
          name: country.country, //United Kindom, United State
          value: country.countryInfo.iso2 //UK, USA, FR
        }));

        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
    });
  };

  getCountriesData();
}, []);

const onCountryChange = async(event) => {
  const countryCode = event.target.value;
  

  const url = 
  countryCode ==="worldwide"
  ? "https://disease.sh/v3/covid-19/all"
  : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

  await fetch(url)
  .then(response => response.json())
  .then(data => {
    setCountry(countryCode);
    //All of the data...
    //from the country response
    setCountryInfo(data);

    // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    // setMapZoom(10);

    countryCode === "worldwide"
    ? setMapCenter([34.80746, -40.4796])
    
     
    :setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
    countryCode === "worldwide"
    ?setMapZoom(3)
    :setMapZoom(4);
   
  });

  // ChangeMapView =({coords}) => {
  //   const map = useMap();
  //   map.setView([coords.lat, coords.lng], map.getZoom());

  //   return null;
  // }

};


//console.log("COUNTRY INFO >>",countryInfo);

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID-19 LIVE UPDATES</h1>

        <FormControl className="app__dropdown">
          <Select variant="outlined" onChange={onCountryChange} value={country}>
            {/* Loop through all the countries and show a drop down list of the options */}
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}

            {/* <MenuItem value="worldwide">Worldwide</MenuItem>
            <MenuItem value="worldwide">Option 2</MenuItem> */}
          </Select>
        </FormControl>
      </div>
      
      <div className="app__stats">
        <InfoBox
        isRed
        active={casesType === "cases"}
        onClick={(e) => setCasesType("cases")}
         title="Coronavirus Cases" 
         cases={prettyPrintStat(countryInfo.todayCases)} 
         total={prettyPrintStat(countryInfo.cases)}
         />

        <InfoBox 
        active = {casesType === "recovered"}
        onClick={(e) => setCasesType("recovered")}
        title="Recovered" 
        cases={prettyPrintStat(countryInfo.todayRecovered)} 
        total={prettyPrintStat(countryInfo.recovered)}
        />
        
        <InfoBox 
        isRed
        active={casesType === "deaths"}
        onClick={(e) => setCasesType("deaths")}
        title="Deaths" 
        cases={prettyPrintStat(countryInfo.todayDeaths)} 
        total={prettyPrintStat(countryInfo.deaths)}
        />

        {/* InfoBoxs */}
        {/* InfoBoxs */}
        {/* InfoBoxs */}
      </div>
 
      {/* Map */}
      <Map casesType={casesType} countries ={mapCountries} center={mapCenter} zoom={mapZoom} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>


          <Table countries={tableData}/>


          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>

          <LineGraph className="app__graph" casesType={casesType}/>
          
        </CardContent>
      </Card>


    </div>
  );
}

export default App;
