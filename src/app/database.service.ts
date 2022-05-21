import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite/ngx';
import { SQLite } from '@ionic-native/sqlite/ngx';
//import { runInThisContext } from 'vm';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  databaseObj: SQLiteObject;

  tables = {
    items: "items",
  }

  constructor(private sqlite: SQLite) { }

  async createDatabase(){
    console.log("teste create database")
    await this.sqlite
    .create({
      name: "ionic_sqlite_A04app",
      location: "default"
    })
    .then(
      (db: SQLiteObject) => {
        this.databaseObj = db;
      })
    .catch((e) => {
      alert("erro ao criar database " + JSON.stringify(e));
    });

    await this.createTables();
  }

  async createTables(){
    await this.databaseObj.executeSql(
      `CREATE TABLE IF NOT EXISTS ${this.tables.items} 
      (id INTEGER PRIMARY KEY AUTOINCREMENT,
       nome VARCHAR(50) NOT NULL,
       quantidade INTEGER NOT NULL,
       valor VARCHAR(20) NOT NULL,
      )`,
      []);
  }

  async addItem(nome: string, quantidade: number, valor: string){
    return this.databaseObj.executeSql(
      `INSERT INTO ${this.tables.items} (nome, quantidade, valor) VALUES ('${nome}', ${quantidade}, '${valor}')`,
      [])
      .then(
      () => {
        return "item salvo"
      })
      .catch((e) => {
        return "erro ao salvar item " + JSON.stringify(e);  
      });
  }

  async getAllItem(){
    return this.databaseObj.executeSql(
      `SELECT * FROM ${this.tables.items} ORDER BY nome ASC`,
      [])
      .then(
      (res) => {
        return res
      })
      .catch((e) => {
        return "erro ao buscar itens " + JSON.stringify(e);  
      });
  }

  async deleteItem(id: number){
    return this.databaseObj.executeSql(
      `DELETE FROM ${this.tables.items} WHERE id = ${id}`,
      [])
      .then(
      () => {
        return "item excluido"
      })
      .catch((e) => {
        return "erro ao excluir item " + JSON.stringify(e);  
      });
  }

  async editItem(id: number, nome: string, quantidade: number, valor: string){
    return this.databaseObj.executeSql(
      `UPDATE ${this.tables.items} SET (nome = '${nome}', quantidade = ${quantidade}, valor = '${valor}') WHERE id = ${id})`,
      [])
      .then(
      () => {
        return "item atualizado"
      })
      .catch((e) => {
        return "erro ao atualizar item " + JSON.stringify(e);  
      });
  }
}
