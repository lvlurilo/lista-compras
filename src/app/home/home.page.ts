import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserTestingModule } from '@angular/platform-browser/testing';
import { ToastController } from '@ionic/angular';
import { Item } from '../models/Item';
//import { StorageService } from '../services/storage.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

//usando SQLite
export class HomePage {

  formulario: FormGroup;
  item: Item = new Item();
  items: Item[] = [];
  //items: any = [];
  addEdit: boolean = true;
  item_key: string = '';
  
  
  constructor(private formBuider: FormBuilder,
              private toastController: ToastController,
              private database: DatabaseService)
  {
    this.database.createDatabase().then(() =>
    {
      this.getAll();
    });
  }

  ngOnInit() {
    this.formulario = this.formBuider.group({
      nome: ['', Validators.compose([Validators.required])], 
      quantidade: ['', Validators.compose([Validators.required])],
      valor: ['', Validators.compose([Validators.required])]
    })
  }

  ionViewDidEnter() {
    this.getAll();
  }

  async getAll() {  //busca todos os itens salvos no storage
    this.items = await this.database.getAllItem();
  }

  async adicionar() {
    console.log("adicionar")
    this.addEdit = true;
    if (this.formulario.valid) {
      this.item.nome = this.formulario.value.nome;
      this.item.quantidade = this.formulario.value.quantidade;
      this.item.valor = this.formulario.value.valor;
      await this.database.addItem(this.item.nome, this.item.quantidade, this.item.valor)  //para salvar no storage
      this.mostrarToast("Item adicionado");
      this.ionViewDidEnter();
      this.ngOnInit();
    } else {
      this.mostrarToast("Campo item/quantidade/valor não pode ser vazio");
    }
  }

  async mostrarEditar(itemEdit: Item) {
    this.addEdit = false;
    this.item_key = itemEdit.nome,
      this.formulario = this.formBuider.group({
        nome: [itemEdit.nome],
        quantidade: [itemEdit.quantidade],
        valor: [itemEdit.valor],
      })
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

  async salvarEditar() {
    if (this.formulario.value.nome != '' && this.formulario.value.quantidade != '' && this.formulario.value.valor != '') {
      this.item.nome = this.formulario.value.nome;
      this.item.quantidade = this.formulario.value.quantidade;
      this.item.valor = this.formulario.value.valor;
      this.database.deleteItem(this.item.id);
      await this.database.editItem(this.item.id, this.item.nome, this.item.quantidade, this.item.valor)  //para salvar no storage
      this.mostrarToast("Item editado");
      this.ionViewDidEnter();
      this.ngOnInit();
      this.addEdit = true;
    } else {
      this.mostrarToast("Campo item/quantidade não pode ser vazio");
    }
  }

  excluir(id: number){
    this.database.deleteItem(id);
    this.mostrarToast("Item Excluido");
    this.ionViewDidEnter();
    this.ngOnInit();
  }

  cancelar() {
    this.addEdit = true;
    this.ionViewDidEnter();
    this.ngOnInit();
  }
}


//export class HomePage usando Ionic storage
/*
export class HomePage {

  formulario: FormGroup;
  item: Item = new Item();
  itens: Item[] = [];
  addEdit: boolean = true;
  item_key: string = '';

  constructor(private formBuider: FormBuilder,
    private toastController: ToastController,
    private storageService: StorageService) { }  



  ngOnInit() {
    this.formulario = this.formBuider.group({
      nome: ['', Validators.compose([Validators.required])],  //com compose é possivel colocar mais de 1
      quantidade: ['', Validators.compose([Validators.required])],
    })
  }

  async getAllItens() {  //busca todos os itens salvos no storage
    this.itens = await this.storageService.getAll();
  }

  ionViewDidEnter() {
    this.getAllItens();
  }

  async adicionar() {
    this.addEdit = true;
    if (this.formulario.valid) {
      this.item.nome = this.formulario.value.nome;
      this.item.quantidade = this.formulario.value.quantidade;
      await this.storageService.set(this.item.nome, this.item)  //para salvar no storage
      this.mostrarToast("Item adicionado");
      this.ionViewDidEnter();
      this.ngOnInit();
    } else {
      this.mostrarToast("Campo item/quantidade não pode ser vazio");
    }

  }

  async mostrarEditar(itemEdit: Item) {
    this.addEdit = false;
    this.item_key = itemEdit.nome,
      this.formulario = this.formBuider.group({
        nome: [itemEdit.nome],
        quantidade: [itemEdit.quantidade],
      })
  }

  async salvarEditar() {
    if (this.formulario.value.nome != '' && this.formulario.value.quantidade != '') {
      this.item.nome = this.formulario.value.nome;
      this.item.quantidade = this.formulario.value.quantidade;
      this.storageService.remove(this.item_key);
      await this.storageService.set(this.item.nome, this.item)  //para salvar no storage
      this.mostrarToast("Item editado");
      this.ionViewDidEnter();
      this.ngOnInit();
      this.addEdit = true;
    } else {
      this.mostrarToast("Campo item/quantidade não pode ser vazio");
    }
  }

  cancelar() {
    this.addEdit = true;
    this.ionViewDidEnter();
    this.ngOnInit();
  }

  excluir(nome: string) {
    this.storageService.remove(nome);
    this.mostrarToast("Item Excluido");
    this.ionViewDidEnter();
    this.ngOnInit();
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
}*/
