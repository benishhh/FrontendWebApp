import {BrowserRouter} from "react-router-dom";
import {Routing} from "./features/Routing";
import '@mantine/core/styles.css';
import {MantineProvider, Notification} from "@mantine/core";


function App() {

  return(
        <MantineProvider defaultColorScheme="light">
            <Notification />
             <BrowserRouter>
                 <Routing/>
             </BrowserRouter>
          </MantineProvider>
  );
}

export default App;
