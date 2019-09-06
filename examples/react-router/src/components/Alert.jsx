import React from "react";
import t from "prop-types";
import { Link } from "react-router-dom";

const kinds = {
  info: "#5352ED",
  positive: "#2ED573",
  negative: "#FF4757",
  warning: "#FFA502"
};

const AlertStyledWithLink = ({ children, kind, ...rest }) => (
  <div
    style={{
      padding: 20,
      background: "white",
      borderRadius: 3,
      color: "white",
      background: kinds[kind]
    }}
    {...rest}
  >
    <Link to="/">{children}</Link>
  </div>
);

export const Alert = props => <AlertStyledWithLink {...props} />;

Alert.propTypes = {
  kind: t.oneOf(["info", "positive", "negative", "warning"])
};

Alert.defaultProps = {
  kind: "info"
};
