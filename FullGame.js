import { Game2 } from "./Game2.js";

export class FullGame{


    constructor(){
        this.cont;
        this.matrix 
    }
    
    drawEverything(){
        this.cont = document.createElement('div')
        this.cont.classList.add('mainCont')
        document.body.appendChild(this.cont)

        this.drawForm(this.cont)
        this.fetchMatrix().then(()=>{
            const gam = new Game2(this.matrix)
            gam.begin(this.cont)
        })
        
    }
    
    drawForm(host){
        let formWrapper = document.createElement('div')
        formWrapper.classList.add('formWrapper')
        host.appendChild(formWrapper)

        let form = document.createElement('div')
        form.classList.add('form')
        formWrapper.appendChild(form)

        
    }

    async fetchMatrix() {
        const url = 'https://jobfair.nordeus.com/jf24-fullstack-challenge/test';
    
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const text = await response.text();
            
            //console.log('Response Text:', text);
    
    
            const rows = text.trim().split('\n');
            this.matrix = rows.map(row => 
                row.split(' ').map(Number) // Podeli svaki red na vrednosti i konvertuj u broj
            );
            //const gam = new Game2(matrix);
            //gam.begin()
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
        
    }




}