class Anuncio{
    id: number;
    titulo: string;
    transaccion: string;
    descripcion: string;
    precio: number;

    constructor(id:number, titulo: string, transaccion: string, descripcion: string, precio: number){
        this.id=id;
        this.titulo = titulo;
        this.transaccion = transaccion;
        this.descripcion = descripcion;     
        this.precio = precio;           
    }
}

class Anuncio_Mascota extends Anuncio{
    animal: string;
    raza: string;
    fecha_nacimiento: string;
    vacuna: string;
    constructor(id:number, titulo: string, transaccion: string, descripcion: string, precio: number,
         animal: string, raza: string, fecha_nacimiento: string, vacuna: string){
        super(id, titulo, transaccion, descripcion, precio);
        this.animal = animal;
        this.raza=raza;
        this.fecha_nacimiento=fecha_nacimiento;
        this.vacuna=vacuna;
    }

}
