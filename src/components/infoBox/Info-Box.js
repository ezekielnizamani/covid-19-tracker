import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./Info.css";
function InfoBox({ title, cases, active, isRed, total, ...props }) {
  return (
    <Card
      onClick={props.onClick}
      className={`infoBox ${active && "infoBox--selected"}  ${
        isRed && active && "infoBox--red"
      }`}
    >
      <CardContent>
        {/* title */}
        <Typography className="infoBox_title" color="textSecondary">
          {title}
        </Typography>

        {/* number of cases */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases_green"}`}>
          {cases}
        </h2>

        {/* total  */}
        <Typography className="infoBox__total">total {total}</Typography>
      </CardContent>
    </Card>
  );
}

export default InfoBox;
