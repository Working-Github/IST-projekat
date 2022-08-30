const express=require('express');
const axios=require('axios');
const fs=require('fs');
const path=require('path');
const { request } = require('express');
const port = 5000;
var app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let procitajPogledZaNaziv=(naziv)=>{
    return fs.readFileSync(path.join(__dirname+"/views/"+naziv+".html"),"utf-8")
}
app.get("/",function(req,res){
    res.send(procitajPogledZaNaziv("index"));
});
function vratiOglase(){
    return axios.get("http://127.0.0.1:3000/svioglasi");
}
function vratiKategorije(){
    return axios.get("http://127.0.0.1:3000/sveKategorije");
}
function prikaziOglase(oglasi){
    let prikaz="";
    for(let i=0;i<oglasi.length;i++){
        prikaz+=`<tr>
        <td>${oglasi[i].id}</td>
        <td>${oglasi[i].naziv}</td>
        <td>${oglasi[i].kategorija}</td>
        <td>${oglasi[i].cena}</td>
        <td>${oglasi[i].tekst}</td>           
         <td><table>`;
        
        prikaz+=`<tr><td>${oglasi[i].oznake}</td> </tr>`
          
        prikaz+=`</table></td><td><table>`;

        '<tr><td>Datum isteka: ${oglasi[i].datum_isteka} </td></tr>';
        prikaz+=`</table></td>
        <td><a href="/obrisi/${oglasi[i].id}">Obrisi</a></td>
        <td><a href="/izmeni/${oglasi[i].id}">Izmeni</a></td>
        </tr>`;    
        }
        return prikaz;
}
function prikaziKategorije(kategorije){
    prikaz="";
    for(let i=0;i<kategorije.length;i++){
        prikaz+=`<option value='${kategorije[i]}'>${kategorije[i]}</option>`;
      }
      return prikaz;
}
app.get("/sviOglasi",(req,res)=>{   
    Promise.all([vratiOglase(), vratiKategorije()])
    .then(function (results) {
        res.send(procitajPogledZaNaziv("svioglasi").replace("#{kat}",prikaziKategorije(results[1].data)).replace("#{data}",prikaziOglase(results[0].data)));
        }).catch(error => {
        console.log(error);
        });
        
        
      });

    app.post("/filtrirajPoImenu",(req,res)=>{
        Promise.all([axios.get(`http://127.0.0.1:3000/filtrirajPoImenu?ime=${req.body.ime}`), vratiKategorije()])
        .then(function (results) {
              res.send(procitajPogledZaNaziv("svioglasi").replace("#{kat}",prikaziKategorije(results[1].data)).replace("#{data}",prikaziOglase(results[0].data)));
        }).catch(error => {
            console.log(error);
        });
            
    });
    app.post("/filtrirajPoKategoriji",(req,res)=>{    
        Promise.all([axios.get(`http://127.0.0.1:3000/filtrirajPoKategoriji?kategorija=${req.body.kategorija}`), vratiKategorije()])
        .then(function (results) {
              res.send(procitajPogledZaNaziv("svioglasi").replace("#{kat}",prikaziKategorije(results[1].data)).replace("#{data}",prikaziOglase(results[0].data)));
        }).catch(error => {
            console.log(error);
    });
});

    app.get("/dodajOglas",function(req,res){
       vratiKategorije().then(response=>{
          res.send(procitajPogledZaNaziv("dodaj").replace("${kat}",prikaziKategorije(response.data)));
       }).catch(error => {
        console.log(error);
});
       
    });
    app.post("/Oglas",(req,res)=>{
        axios.post("http://localhost:3000/dodajOglas",{
            kategorija:req.body.kategorija,
            naziv:req.body.naziv,
            cena:req.body.cena,
            tekst:req.body.tekst,
            oznake:req.body.oznake,
            datum_isteka:req.body.datum_isteka
            
        }).catch(error => {
            console.log(error);        
    });
    res.redirect("/sviOglasi"); 
    });
    app.get("/obrisi/:id",(req,res)=>{
        axios.delete(`http://localhost:3000/izbrisiOglas/${req.params["id"]}`)
        res.redirect("/sviOglasi");
    });

app.post("/snimiIzmene",function(req,res){
axios.post("http://localhost:3000/snimiIzmene",{
    id:req.body.id,
    kategorija:req.body.kategorija,
    naziv:req.body.naziv,
    cena:req.body.cena,
    tekst:req.body.tekst,
    oznake:req.body.oznake,
    datum_isteka:req.body.datum_isteka
}).catch(error => {
    console.log(error);        
});
res.redirect("/sviOglasi"); 
});

app.listen(port,()=>{console.log(`startovan klijent na portu ${port}`)});




