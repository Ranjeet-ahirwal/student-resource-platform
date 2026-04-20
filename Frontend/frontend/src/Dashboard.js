import { useEffect, useState } from "react";

function Dashboard(){

const [resources,setResources]=useState([]);

useEffect(()=>{

fetch("process.env.REACT_APP_API_URL/api/resources/my",{
headers:{
Authorization:"Bearer "+localStorage.getItem("token")
}
})
.then(res=>res.json())
.then(data=>setResources(data));

},[]);

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">My Uploads</h1>

{resources.map(r=>(
<div key={r._id} className="bg-white shadow p-5 mb-4">

<h3 className="text-xl font-bold">{r.title}</h3>

<p className="text-gray-600">{r.description}</p>

</div>
))}

</div>

)

}

export default Dashboard;