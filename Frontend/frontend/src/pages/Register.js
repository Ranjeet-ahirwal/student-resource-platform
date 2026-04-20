import { useState } from "react";
import axios from "axios";

function Register(){

const [name,setName] = useState("");
const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleSubmit = async (e)=>{
e.preventDefault();

await axios.post("http://localhost:5000/api/auth/register",{
name,
email,
password
});

alert("User Registered Successfully");

}

return(

<div>

<h2>Register</h2>

<form onSubmit={handleSubmit}>

<input placeholder="Name" onChange={(e)=>setName(e.target.value)} />
<br/>

<input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
<br/>

<input type="password" placeholder="Password" onChange={(e)=>setPassword(e.target.value)} />
<br/>

<button type="submit">Register</button>

</form>

</div>

);

}

export default Register;