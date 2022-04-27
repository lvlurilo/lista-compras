import { Injectable } from '@angular/core';
import { IonListHeader } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  //cria
  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  //busca
  public get(key: string) {
    this._storage?.get(key);
  }

  //exclui
  public remove(key: string) {
    this._storage?.remove(key);
  }

  //lista
  public getAll(){
    const list = [];
    this._storage.forEach((value, key, index) => {
      list.push(value)
    });
    return list;
  }
}
