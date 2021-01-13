async function storeData(){
    alert('Wait For The Server Response it may take 5 Sec or n/ more depending on Your Network')
    var email = await document.getElementById("email").value;
    var name = await document.getElementById("name").value;
    const data =  {name,email};
    /////// posting Header
    const postOption ={
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    };
    ////fecth detail
    const response = await  fetch('/api', postOption)
    const moro = await response.json()
    console.log(moro.status)
    console.log(moro)
    if(moro.status === 'Success'){
        alert('Welcome To the Club ')
    }else{
        alert('Try Again, your network is kinda bad ', moro.name, '\n before Making A New Request \n or check the user List for you name ')
    }

};


async function read(){
   const respones = await fetch('/api');
   const data = await respones.json();
   console.log(data)
   document.getElementById("total").innerHTML = data.length;

   for (item of data){
       const root = document.createElement('p');
       const date = document.createElement('div');
       const Name = document.createElement('div');
  
       Name.textContent = `${item.name}`;
       const dateString = new Date(item.timestamp).toLocaleString();
       date.textContent = dateString
       root.append( date, Name);
       document.body.append(root)
   }
};

async function Complain(){
    alert('Waiit For The Server Response')
    var Email = await document.getElementById("C_email").value;
    var Name = await document.getElementById("C_name").value;
    var Complain = await document.getElementById("complain").value;
    const data =  {Name,Email,Complain};
    /////// posting Header
    const postOption ={
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    };
    ////fecth detail
    const response = await  fetch('/complain', postOption)
    const moro = await response.json()
    console.log(moro)
    alert('Received it, will get back shortly')
}
