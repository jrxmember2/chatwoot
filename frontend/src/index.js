import React from "react";
import ReactDOM from "react-dom";
import CssBaseline from "@material-ui/core/CssBaseline";

import App from "./App";
import { BrandingProvider } from "./context/Branding/BrandingContext";

ReactDOM.render(
	<BrandingProvider>
		<CssBaseline>
			<App />
		</CssBaseline>
	</BrandingProvider>,
	document.getElementById("root")
);

// ReactDOM.render(
// 	<React.StrictMode>
// 		<CssBaseline>
// 			<App />
// 		</CssBaseline>,
//   </React.StrictMode>

// 	document.getElementById("root")
// );
