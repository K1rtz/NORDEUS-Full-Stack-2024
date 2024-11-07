export class FullGame{


    constructor(){
        this.cont;

    }

    drawEverything(){
        this.cont = document.createElement('div')
        this.cont.classList.add('mainCont')
        this.drawForm(this.cont)

    }

    drawForm(host){
        let formWrapper = document.createElement('div')
        formWrapper.classList.add('formWrapper')
        host.appendChild(formWrapper)

        let form = document.createElement('div')
        form.classList.add('form')
        formWrapper.appendChild(form)

        
    }

}