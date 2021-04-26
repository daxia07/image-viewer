# DEBUG project
https://blog.jetbrains.com/webstorm/2017/01/debugging-react-apps/

## update env variable to make the app work

## use build folder to deploy

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

```javascript
const handlers = useSwipeable({
onSwipedLeft: () => slide(NEXT),
onSwipedRight: () => slide(PREV),
preventDefaultTouchmoveEvent: true,
trackMouse: true
});
```

https://medium.com/trabe/prevent-click-events-on-double-click-with-react-with-and-without-hooks-6bf3697abc40
