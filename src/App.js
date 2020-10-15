import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./components/infoBox/Info-Box";
import Map from "./components/map/Map";
import Table from "./components/table/Table";
import { sortData, showDataOnMap, prettyPrintStat } from "./util";
import LineGraph from "./components/lineGraph/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);

  const [country, setCountry] = useState("worldwide");

  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });

  const [mapZoom, setMapZoom] = useState(3);

  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => setCountryInfo(data))
      .catch((error) => console.log(error));
  }, []);
  useEffect(() => {
    // https://disease.sh/v3/covid-19/countries

    const getCountriesData = () => {
      fetch(" https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        })
        .catch((error) => console.log(error));
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? " https://disease.sh/v3/covid-19/all"
        : ` https://disease.sh/v3/covid-19/countries/${countryCode}`;

    // ​https://disease.sh/v3/covid-19/all

    // https://disease.sh/v3/covid-19/countries[COUNTRY__CODE]
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        }
        setMapZoom(4);
      });
  };
  return (
    <div className="App">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19-Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        {/* header */}
        {/* Title + Select input dropdown field */}
        <div className="app__stats">
          {/* InfoBoxs */}
          <InfoBox
            active={casesType === "cases"}
            isRed
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          {/* InfoBoxs */}
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          {/* InfoBoxs */}
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
        {/* Map */}
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
        </CardContent>
        {/* Table */}
        <Table countries={tableData} />
        {/* Graph */}
        <h3 className="app_graphTitle">WorldWide new {casesType}</h3>

        <LineGraph className="app__graph" casesType={casesType} />
      </Card>
    </div>
  );
}

export default App;
