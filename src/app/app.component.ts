import { Component,OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Headers, RequestOptions } from '@angular/http';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  ciudad:String = '';
  ciudades:any = [];
  mensajeError:String = 'ocurrio un error';

  constructor(private httpClient: HttpClient){ }

  ngOnInit(){
    let usuario = this.getNombreUsuario();
    let url = 'http://localhost:8090/boards/';
    this.httpClient.get(url+usuario)
    .subscribe((data: any) => {
      this.ciudades = data.listaCiudades;
    });
   	const source = interval(1000 * 30);
	const subscribe = source.subscribe(val => this.getListaCiudades());
  }

  getListaCiudades(){
    let usuario = this.getNombreUsuario();
    let url = 'http://localhost:8090/boards/';
    this.httpClient.get(url+usuario)
    .subscribe(
      (data:any) => this.ciudades = data.listaCiudades,
      error => this.mensajeError = <any>error
    );
  }

  agregarCiudad(){
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type':'application/json',
        'access-control-allow-origin':'http://localhost:4200/',
      })
    }
    let json = {"ciudad":this.ciudad,"usuario":this.getNombreUsuario()};
    this.httpClient.post(`http://localhost:8080/addLocation`,json,httpOptions)
    .subscribe((data: any) => {
      this.getListaCiudades();
    });
  }

  borrarCiudad(ciudad){
    const httpOptions = {
      headers: new HttpHeaders({
        'content-type':'application/json',
        'access-control-allow-origin':'http://localhost:4200/',
      })
    }
    let json = {"ciudad": ciudad,"usuario":this.getNombreUsuario()};
    this.httpClient.post(`http://localhost:8080/removeLocation`,json,httpOptions)
    .subscribe((data: any) => {
      this.getListaCiudades();
    });
  }

  getNombreUsuario(){
    var cadena = window.location.href;
    return cadena.slice(29);
  }

  onKey(event: any) {
    this.ciudad = event.target.value;
  }

}
