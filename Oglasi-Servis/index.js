var express = require('express');
var oglasiServis=require('../Oglasi-Modul/funkcijeOglasi');
var app = express();
const port = 3000;
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get('/',(request, response)=>{
    response.send("Server radi");
});
app.get("/sviOglasi",function(request,response){
response.send(oglasiServis.sviOglasi())
});
app.post("/dodajOglas",function(request,response){
   oglasiServis.dodajOglas(request.body);
   response.end("Dodat Oglas!");
});
app.get("/filtrirajPoImenu",function(request,response){
    response.send(oglasServis.filtrirajPoImenu(request.query.ime));
});
app.get("/filtrirajPoKategoriji",function(request,response){
    response.send(oglasServis.filtrirajPoKategoriji(request.query.kategorija)); 
});
app.get("/sveKategorije",function(request,response){
    response.send(oglasServis.vratiKategorije());
})
app.delete('/izbrisiOglas/:id',(request, response)=>{
    oglasServis.izbrisiOglas(request.params["id"]);
    response.end("Izbrisan oglas");
});
app.get("/vratiOglas/:id",(request,response)=>{

response.send(oglasServis.nadjiOglas(request.params["id"]));
});
app.post("/snimiIzmene",(request,response)=>{
    oglasServis.IzmeniOglas(request.body);
    response.end("Snimljeno!");
});

app.listen(port,()=>{console.log(`startovan server na portu ${port}`)});