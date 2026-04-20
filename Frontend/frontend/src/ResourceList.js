import React, { useEffect, useState } from "react";
import axios from "axios";

function ResourceList() {

const [resources,setResources] = useState([]);

useEffect(()=>{

axios.get("process.env.REACT_APP_API_URL/api/resources/all")
.then(res=>{
setResources(res.data);
});

},[]);

return(

<div style={{padding:"40px"}}>

<h2>Available Study Resources</h2>

{resources.map((r)=>(
<div key={r._id} style={{border:"1px solid gray",padding:"10px",margin:"10px"}}>

<h3>{r.title}</h3>

<p>{r.description}</p>

<a
href={`process.env.REACT_APP_API_URL/uploads/${r.file}`}
target="_blank"
rel="noreferrer"
>
Download PDF
</a>

</div>
))}

</div>

);

}

export default ResourceList;