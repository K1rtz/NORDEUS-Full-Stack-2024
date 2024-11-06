export class Game2{


    constructor(matrix){
        this.matrix = matrix;
        this.mat 
        this.cont
        this.cells = []
        this.islands = []
    }

    begin(){
        this.createMatrix(document.body)
        this.addBorders()
        this.test()
        console.log(this.islands[2])
    }
    createMatrix(host) {
        this.cont = document.createElement('div') 
        this.cont.classList.add('matrix'); 
        host.appendChild(this.cont)

        for (let i = 0; i < 30; i++) {
            this.cells[i] = []
            for (let j = 0; j < 30; j++) {
                const cell = document.createElement('div'); 
                if(this.matrix[i][j]==0){
                    cell.style.backgroundColor="blue"
                    cell.water = true;
                }else{
                    cell.style.backgroundColor="green"
                }
                this.cells[i].push(cell)
                cell.classList.add('cell');
                if(!cell.water){
                    cell.style.border = '1px solid black'
                }
                // cell.textContent = i * 30 + j + 1; // Popuni div sa brojem (1, 2, ..., 900)
                this.cont.appendChild(cell); 
                cell.i = i
                cell.j = j
                // self = this;
                if(!cell.water){
                    cell.addEventListener('mouseenter', (event) => {
                        // const islandNumber = event.target.getAttribute('islandNumber');
                        // console.log(event.target.islandNumber);
                        this.lift(event.target.islandNumber)
                    })
                    cell.addEventListener('mouseleave', (event) => {
                        // const islandNumber = event.target.getAttribute('islandNumber');
                        // console.log(event.target.islandNumber);
                        this.lower(event.target.islandNumber)
                    })
                }
                cell.classList.add('tet')
                //cell.addEventListener('mouseenter', this.test.bind(this))


            }
        }
    }

    lift(val){
        console.log('lift')
        this.islands[val].forEach(e=>{
            // e.style.backgroundColor='purple'
            e.classList.add('test')
            e.classList.remove('tet')
        })
    }

    lower(val){
        this.islands[val].forEach(e=>{
            // e.style.backgroundColor='purple'
            e.classList.remove('test')
            e.classList.add('tet')

        })
    }


    test(){
        for(let i = 0; i < 30; i ++){
            for(let j = 0; j < 30; j++){
                if(!this.cells[i][j].visited && !this.cells[i][j].water){
                    this.test2(i, j);
                }
            }
        }
    }


    test2(i, j){
        console.log('ss')
        this.islands[this.islands.length] = [] //
        this.islands[this.islands.length-1].push(this.cells[i][j]);
        this.cells[i][j].islandNumber = this.islands.length-1

        let queue = []
        queue.push(this.cells[i][j])

        while(queue.length!=0){

            let current = queue.shift()
            let i = current.i
            let j = current.j
            current.visited = true;

            // current.style.backgroundColor='red'

            if(this.cells[i-1]?.[j] && !this.cells[i-1][j].visited && !this.cells[i-1][j].water){
                this.cells[i-1][j].visited = true;
                this.islands[this.islands.length-1].push(this.cells[i-1][j]);
                this.cells[i-1][j].islandNumber = this.islands.length-1
                queue.push(this.cells[i-1][j])
            }
            if(this.cells[i][j+1] && !this.cells[i][j+1].visited && !this.cells[i][j+1].water){
                this.cells[i][j+1].visited = true;
                this.islands[this.islands.length-1].push(this.cells[i][j+1]);
                this.cells[i][j+1].islandNumber = this.islands.length-1
                queue.push(this.cells[i][j+1])

            }
            if(this.cells[i+1]?.[j] && !this.cells[i+1][j].visited && !this.cells[i+1][j].water){
                this.cells[i+1][j].visited = true;
                this.islands[this.islands.length-1].push(this.cells[i+1][j]);
                this.cells[i+1][j].islandNumber = this.islands.length-1
                queue.push(this.cells[i+1][j])
            }
            if(this.cells[i][j-1] && !this.cells[i][j-1].visited && !this.cells[i][j-1].water){
                this.cells[i][j-1].visited = true;
                this.islands[this.islands.length-1].push(this.cells[i][j-1]);
                this.cells[i][j-1].islandNumber = this.islands.length-1
                queue.push(this.cells[i][j-1])
            }
        }

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

                //DODAVANJE SLICICA
                if(this.matrix[i][j]<290 && this.matrix[i][j]>0){
                    if(Math.random()<.02)
                    this.cells[i][j].innerHTML='🏠'
                }
                if(this.matrix[i][j]>=290 && this.matrix[i][j]<500){
                    if(Math.random()<.02)
                        this.cells[i][j].innerHTML='🌳'
                }
                if(this.matrix[i][j]>=500 && this.matrix[i][j]<750){
                    if(Math.random()<.02)
                        this.cells[i][j].innerHTML='🌲'
                }


                // console.log(this.matrix[i][j])

            }

        }

    }

    getColorBasedOnHeight(height) {
        // Ako je visina 0 (voda)
        if (height === 0) {
          return 'blue'; // Voda (plava)
        }
      
        if (height <= 280) {
          return 'rgb(0, 230, 0)'
        }
      
        else if (height <= 500) {
        return 'rgb(0, 200, 0)'
        }
      
        else if (height <= 750) {
        return 'rgb(192, 168, 92)'

        }
      
        return 'rgb(159, 137, 78)'
      }



}