export class Game2{


    constructor(matrix){
        this.matrix = matrix;
        this.mat 
        this.cont
        this.cells = []
    }

    begin(){
        this.createMatrix(document.body)
        this.addBorders()
    }

    


    createMatrix(host) {
        this.cont = document.createElement('div') // Referenca na glavni div
        this.cont.classList.add('matrix'); // Dodavanje klase za CSS stilizaciju
        host.appendChild(this.cont)

        for (let i = 0; i < 30; i++) {
            this.cells[i] = []
            for (let j = 0; j < 30; j++) {
                const cell = document.createElement('div'); // Kreiraj novi div za svaku ćeliju
                if(this.matrix[i][j]==0){
                    cell.style.backgroundColor="blue"
                    cell.water = true;
                }else{
                    cell.style.backgroundColor="green"
                }
                this.cells[i].push(cell)
                cell.classList.add('cell'); // Dodaj klasu za stilizaciju
                if(!cell.water){
                    cell.style.border = '1px solid black'
                }
                // cell.textContent = i * 30 + j + 1; // Popuni div sa brojem (1, 2, ..., 900)
                this.cont.appendChild(cell); // Dodaj div u glavni kontejner

            }
        }
        
        // this.cells[0].style.borderRight = '1px solid black';
        // this.cells[1].style.borderLeft = '1px solid black'

    }

    addBorders(){
        for(let i = 0; i < 30; i++){
            for(let j = 0; j < 30; j++){
                if(j<29){
                    if(this.cells[i][j].water == this.cells[i][j+1].water){
                        this.cells[i][j].style.borderRight='none'
                        this.cells[i][j+1].style.borderLeft='none'
                    }
                }
                if(i<29){
                    if(this.cells[i][j].water == this.cells[i+1][j].water){
                        this.cells[i][j].style.borderBottom='none'
                        this.cells[i+1][j].style.borderTop='none'
                    }
                }

                let radius = '4px'

                if(i>0 && j<29){
                    if(!this.cells[i][j].water && this.cells[i-1][j].water && this.cells[i][j+1].water){
                        this.cells[i][j].style.borderTopRightRadius = radius
                        // this.cells[i-1][j].style.borderBottom='none'
                        // this.cells[i][j+1].style.borderLeft='none'
                    }
                }
                if(i>0 && j>0){
                    if(!this.cells[i][j].water && this.cells[i-1][j].water && this.cells[i][j-1].water){
                        this.cells[i][j].style.borderTopLeftRadius = radius
                    }
                }
                if(i<29 && j<29){
                    if(!this.cells[i][j].water && this.cells[i][j+1].water && this.cells[i+1][j].water){
                        this.cells[i][j].style.borderBottomRightRadius = radius
                    }
                }
                if(i<29 && j>0){
                    if(!this.cells[i][j].water && this.cells[i][j-1].water && this.cells[i+1][j].water){
                        this.cells[i][j].style.borderBottomLeftRadius = radius
                    }
                }

                let color = this.getColorBasedOnHeight(this.matrix[i][j])
                this.cells[i][j].style.backgroundColor = color;
                console.log(this.matrix[i][j])

            }

        }

    }

    getColorBasedOnHeight(height) {
        // Ako je visina 0 (voda)
        if (height === 0) {
          return 'blue'; // Voda (plava)
        }
      
        // Ako je visina u opsegu od 0 do 250
        if (height <= 280) {
          let greenIntensity = Math.floor(255 * (height / 250)); // Od svetlo zelene do tamno zelene
          //return `rgb(0, ${greenIntensity}, 0)`; // Zelena
          return 'rgb(0, 230, 0)'
        }
      
        // Ako je visina u opsegu od 250 do 500
        else if (height <= 500) {
          let greenIntensity = Math.floor(255 * ((500 - height) / 250)); // Od tamno zelene do svetlo zelene
        //   return `rgb(0, ${greenIntensity}, 0)`; // Zelena
        return 'rgb(0, 200, 0)'
        }
      
        // Ako je visina u opsegu od 500 do 750
        else if (height <= 750) {
          let brownIntensity = Math.floor(255 * ((750 - height) / 250)); // Od svetlo braon do tamno braon
        //   return `rgb(${brownIntensity}, ${brownIntensity}, 0)`; // Braon
        // return 'lightbrown'
        return 'rgb(192, 168, 92)'

        }
      
        // Ako je visina u opsegu od 750 do 1000
        //return 'rgb(139, 69, 19)'; // Tamno braon
        return 'rgb(159, 137, 78)'
      }



}