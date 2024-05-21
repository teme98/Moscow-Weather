import "./App.css";
import { useEffect } from "react";
import { useState } from "react";
// MATERIAL UI COMPONENT
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CloudIcon from "@mui/icons-material/Cloud";
import Button from "@mui/material/Button";
// AXIOS
import axios from "axios";
// MOMENT
import moment from "moment";
// I18NEXT TRANSLATE
import { useTranslation } from "react-i18next";
import { useControlled } from "@mui/material";

let cancelAxios = null;
function App() {
  const { t, i18n } = useTranslation();

  // const axios = require("axios");
  const [time, setTime] = useState("");
  const [temp, setTemp] = useState({
    number: null,
    description: "",
    min: null,
    max: null,
    icon: null,
  });
  // Event Handler
  const [local, setLocal] = useState("en")
  function handleChangeLang() {
    if (local == "en") {
      setLocal("ru")
      i18n.changeLanguage("en")
      moment.locale("en")
    } else {
      setLocal("en")
      i18n.changeLanguage("ru")
      moment.locale("en")
    }
    setTime(moment().format("MMM Do YY"))
  }
  useEffect(() => {
    i18n.changeLanguage("ru")
  },[])
  useEffect(() => {
    setTime(moment().format("MMM Do YY"));
    axios
      .get(
        "https://api.openweathermap.org/data/2.5/weather?lat=55.7&lon=37.6&appid=84bb79a4819e4fffbac801ab142cdcd9",
        {
          cancelToken: new axios.CancelToken((c) => {
            cancelAxios = c;
          }),
        }
      )
      .then(function (response) {
        // handle success
        const responseTemp = Math.round(response.data.main.temp - 273.15);
        const minTemp = Math.round(response.data.main.temp_min - 273.15);
        const maxTemp = Math.round(response.data.main.temp_max - 273.15);
        const descriptionTemp = response.data.weather[0].description;
        const iconTemp = response.data.weather[0].icon;
        setTemp({
          number: responseTemp,
          description: descriptionTemp,
          min: minTemp,
          max: maxTemp,
          icon: `https://openweathermap.org/img/wn/${iconTemp}@2x.png`,
        });
      })
      .catch(function (error) {
        // handle error
        // console.log(error);
      });
    return () => {
      cancelAxios();
    };
  }, []);
  return (
    <>
      <Container
        maxWidth="sm"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* CARD */}
          <div
            style={{
              backgroundColor: "#5d4037",
              color: "#fff",
              borderRadius: "15px",
              boxShadow: "0px 11px 1px rgpa(0,0,0,0.05)",
              width: "100%",
            }}
          >
            {/* content */}
            <div>
              {/* CITY & TIME */}
              <div
                style={{
                  display: "flex",
                  fontFamily: "TAMIMI",
                  alignItems: "end",
                }}
              >
                <Typography variant="h1" style={{ marginLeft: "10px",fontFamily:"TAMIMI" }}>
                  {t('Moscow')}
                </Typography>
                <Typography
                  variant="h5"
                  style={{ marginLeft: "15px", marginRight: "12px", }}
                >
                  {time}
                </Typography>
              </div>
              {/*== CITY & TIME ==*/}
            </div>
            <hr />
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <div>
                {/* DEGREE & DESCRIPTION */}
                {/* TEMP */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h1" style={{ marginLeft: "10px" }}>
                    {temp.number}
                  </Typography>
                  {/* TODO: TEMP IMAGE */}
                  <img src={temp.icon} alt="img" />
                </div>
                {/*== TEMP ==*/}
                <Typography variant="h6" style={{ marginLeft: "40px" }}>
                  {t(temp.description)}
                </Typography>
                {/* MIN & MAX */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    alignItems: "center",
                  }}
                >
                  <h4> {t("min")} : {temp.min}</h4>
                  <h4> | </h4>
                  <h4> {t("max")} : {temp.max}</h4>
                </div>
                {/*== MIN & MAX ==*/}
              </div>
              {/*== DEGREE & DESCRIPTION ==*/}
              <CloudIcon style={{ fontSize: "200px" }} />
            </div>
            {/*== content ==*/}
          </div>
          {/*== CARD ==*/}
          <Button
            variant="text"
            style={{ color: "black", fontFamily: "tamimi" }}
          onClick={handleChangeLang}
          >
            {local=="en"?"ENGLISH":"РУССКИЙ"}
          </Button>
        </div>
      </Container>
    </>
  );
}

export default App;
