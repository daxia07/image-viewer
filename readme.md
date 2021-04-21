# DEBUG project
https://blog.jetbrains.com/webstorm/2017/01/debugging-react-apps/

## resources 
```javascript
import React, {useEffect, useState} from 'react';

import logo from './logo.svg';
import './App.css';

const App  = () => {
const [state, setState] = useState({data: []});

useEffect(()=>{
    fetchData();
}, [state]);

const fetchData =  async () => {
    try {
        const response = await  fetch('http://worldclockapi.com/api/json/utc/now');
        if (!response.ok) {throw Error(response.statusText);}
        const json = await response.json();
        setState({ data: json});
        console.log(json);
    }
    catch (error) {console.log(error);}
}

return (<div><h1>worldclockapi.com data (edit App.js)</h1>
<li>currentFileTime: {state.data.currentFileTime }</li>
</div> );
}

export default App;
```