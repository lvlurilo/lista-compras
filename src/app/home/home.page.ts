import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  formulario: FormGroup;
  produtos = [];

  constructor(private formBuider: FormBuilder, private toastController: ToastController) {
  }

ngOnInit(){ 
  this.formulario = this.formBuider.group({
    produto: [''], 
  })

}

adicionar(){
  let item = this.formulario.get('produto').value;
  if( item != ''){
    item = (this.formulario.get('produto').value);
    this.produtos.push(item);
    this.mostrarToast("Item Adicionado");
    this.ngOnInit();
  }else{
    this.mostrarToast("Campo não pode ser vazio");
  }
}

excluir(produto){
  let deleteItem = (this.produtos.indexOf(produto));
  this.produtos.splice(deleteItem, 1);
  this.mostrarToast("Item Excluido");
}

mostrarToast(msg: string) {
  this.toastController.create({
    message: msg,
    duration: 1200,
    position: 'bottom',
    cssClass: 'card-toast'
  }).then((obj) => {
    obj.present();
  });
}

}
