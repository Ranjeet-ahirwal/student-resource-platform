import React, { useState } from "react";
import axios from "axios";

function UploadResource() {

const [title,setTitle]=useState("");
const [description,setDescription]=useState("");
const [file,setFile]=useState(null);

const handleSubmit = async(e)=>{
e.preventDefault();

const formData = new FormData();

formData.append("title",title);
formData.append("description",description);
formData.append("file",file);

try{

const res = await axios.post(
"process.env.REACT_APP_API_URL/api/resources/upload",
formData
);

alert(res.data.message);

}catch(err){

console.log(err);
alert("Upload failed");

}

};

return(

<div style={{padding:"40px"}}>

<h2>Upload Study Resource</h2>

<form onSubmit={handleSubmit}>

<input
type="text"
placeholder="Title"
value={title}
onChange={(e)=>setTitle(e.target.value)}
required
/>

<br/><br/>

<textarea
placeholder="Description"
value={description}
onChange={(e)=>setDescription(e.target.value)}
required
/>

<br/><br/>

<input
type="file"
onChange={(e)=>setFile(e.target.files[0])}
required
/>

<br/><br/>

<button type="submit">
Upload Resource
</button>

</form>

</div>

);

}

export default UploadResource;