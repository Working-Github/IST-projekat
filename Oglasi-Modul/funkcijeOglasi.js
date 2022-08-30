const fs=require('fs');
const file="oglasi.json";
const datetime=require('date-and-time');
const { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } = require('constants');
var kategorije=["Automobili","Stan","Igracke","Namestaj","Usluge"];
let procitajPodatkeIzFajla=()=>{
    let oglasi=fs.readFileSync(file, (err, data) => {
        if (err) throw err;
            return data;
    });
    return JSON.parse(oglasi);
}
let snimiOglas=(data)=>{
    fs.writeFileSync(file,JSON.stringify(data));
}
exports.sviOglasi=()=>{
return  procitajPodatkeIzFajla();
};
exports.dodajOglas=(noviOglas)=>{
    let id=1;
    let oglas=this.sviOglasi();
    let oglasi={};
    let  oznake=noviOglas.oznake.split(',');
    if(oglasi.length>0){
         id=oglasi.length+1;
    }
    if(kategorije.find(x=>x.startsWith(noviOglas.kategorija))){     
        if(noviOglas.nova_cena!="" && noviOglas.datum_isteka!=""){
             oglas={
                "id":id,
                "naziv":noviOglas.naziv,
                "kategorija":noviOglas.kategorija,
                "cena":parseFloat(noviOglas.cena),
                "tekst":noviOglas.tekst,
                "oznake":oznake,

    };
        }
        else{
            oglas={
                "id":id,
                "naziv":noviOglas.naziv,
                "kategorija":noviOglas.kategorija,
                "cena":parseFloat(noviOglas.cena),
                "tekst":noviOglas.tekst,
                "oznake":oznake,

    };
        }
    
    oglasi.push(oglas);
    snimiOglas(oglasi);
}

}
exports.izbrisiOglas=(id)=>{
    if(this.sviOglasi().find(x=>x.id==id)){
        snimiOglas(this.sviOglasi().filter(oglas=>oglas.id!=id));
    }
}
exports.filtrirajPoImenu=(ime)=>{
 let filtrirano=this.sviOglasi().filter(p=>p.naziv.startsWith(ime));
  return filtrirano;
}
exports.filtrirajPoKategoriji=(kategorija)=>{
    return this.sviOglasi().filter(p=>p.kategorija==kategorija);
}

exports.vratiKategorije=()=>{ 
    return kategorije;
}
exports.nadjiOglas=(id)=>{
    let broj=parseInt(id);
    let oglasi=this.sviOglasi();
    let oglas=oglasi.filter(p=>p.id==broj);
    return oglas;
}
exports.IzmeniOglas=(izmenaOglasa)=>{
let oglasi=this.sviOglasi();
for(let i=0;i<oglasi.length;i++){
    if(izmenaOglasa.id==oglasi[i].id){
        oglasi[i].naziv=izmenaOglasa.naziv;
        oglasi[i].kategorija=izmenaOglasa.kategorija;
        oglasi[i].cena=izmenaOglasa.cena;
        oglasi[i].tekst=izmenaOglasa.tekst;
        oglasi[i].oznake=izmenaOglasa.oznake;
    }
}
snimiOglase(oglasi);
}

