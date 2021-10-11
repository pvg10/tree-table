import React, {
  Component,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import ReactDOM from "react-dom";
import TreeTable from "./TreeTable";

// const Alert = React.forwardRef(function Alert(props, ref) {
//   return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
// });
function Demo () {
  return <div>demo</div>
}
export default function App(props) {
  return (
    <div>
      <TreeTable />
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
