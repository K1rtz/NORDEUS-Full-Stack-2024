export class Game2{


    constructor(host){
        this.host = host;
        this.matrix; //= matrix;
        // this.mat 
        this.cont
        this.cells = []
        this.islands = []

        this.selectedIslands = []
        this.correctIslands = []

        this.addEventListeners();

        this.duckInfo = {
            x: 0,
            y: 0,
            currentDirection: 1

        }

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
            console.log('success')
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }


    addEventListeners(){
        document.addEventListener('keydown', (event)=>{
            if(event.key == 'ArrowRight'){
                this.moveDuck([0, 1]);
            }
            else if(event.key == 'ArrowLeft'){
                this.moveDuck([0,-1])
            }
            else if(event.key == 'ArrowDown'){
                this.moveDuck([1,0])
            }
            else if(event.key == 'ArrowUp'){
                this.moveDuck([-1,0])
            }
            else if(event.key == ' '){
                this.layEgg()
                // this.floodIsland(0)
                // this.fetchMatrix()
                // this.begin(document.body)
            }
        })

    }

    calculateAverageHeight(){
        let t = []
        this.islands.forEach((island, index)=>{
            let islandNumber = index
            let islandAverage = 0;
            island.forEach(e=>{
                islandAverage+=e.height
            })
            islandAverage/=island.length;
            t.push({index: islandNumber,
                    averageHeight: islandAverage
            })
        })
        let t3 = t.sort((a,b) => b.averageHeight - a.averageHeight).slice(0 , 3)
        t3.forEach(e=>{
            this.correctIslands.push(e.index)
        })
        // this.correctIslands
        console.log(t3)
        console.log(t)
    }

    layEgg(){
        let x = this.duckInfo.x
        let y = this.duckInfo.y
        
        let i;
        // do{
        //     i = Math.random() > 0.5 ? -1 : 1
        //     console.log(i)
        // }
        // while(!this.moveDuck([0, i]))
        const islandElement = this.islands[this.cells[x][y].islandNumber][0];
        // console.log(this.cells[x][y].height)
        if(islandElement.getAttribute('hasEgg') != 'true' && this.selectedIslands.length<3){
        // if(this.selectedIslands.length<3){

            this.islands[this.cells[x][y].islandNumber][0].setAttribute('hasEgg', 'true');
            if(!this.moveDuck([0, this.duckInfo.currentDirection]))
                this.moveDuck([0, this.duckInfo.currentDirection -2])
            
            this.cells[x][y].childNodes[0].innerHTML='🥚'
            this.selectedIslands.push(this.cells[x][y].islandNumber)
            console.log('Selected islands are:' + this.selectedIslands)

            let button = this.host.querySelector('.submitButton')
            button.innerHTML = `${this.selectedIslands.length}/3 Eggs placed!`
            if(this.selectedIslands.length==3){
                button.innerHTML = `Big waves incoming, find ship!`
            }
            console.log(button)

        }


        
    }

    moveDuck(val){
        

        let x = this.duckInfo.x
        let y = this.duckInfo.y
        if(this.cells[x+val[0]]?.[y+val[1]] && this.cells[x+val[0]][y+val[1]].innerHTML!='🚢'){
            
            //Moving the duck and giving it right orientation
            this.duckInfo.x = x+val[0];
            this.duckInfo.y = y+val[1];
            //provera da li ce ugaziti u egg da ga obrise
            if(this.cells[x+val[0]][y+val[1]].childNodes[0].innerHTML=='🥚'){
                this.islands[this.cells[x+val[0]][y+val[1]].islandNumber][0].setAttribute('hasEgg', 'false');
                this.selectedIslands = this.selectedIslands.filter(e => e!==this.cells[x+val[0]][y+val[1]].islandNumber)
                let button = this.host.querySelector('.submitButton')
                button.innerHTML = `${this.selectedIslands.length}/3 Eggs placed!`
                console.log(button)
            }

            // if(this.cells[x+val[0]][y+val[1]].innerHTML=='🚢'){
            //     console.log('EXIT')
            //     if(this.selectedIslands.length==3){
            //         this.cells[x][y].childNodes[0].innerHTML = ''
            //         this.checkResult();
            //         return true;
            //     }
            //     return true
            // }
            //dalje
            // if(this.cells[x][y].childNodes[0].innerHTML!='🥚')
            this.cells[x][y].childNodes[0].innerHTML=''
            this.cells[x+val[0]][y+val[1]].childNodes[0].innerHTML='🦆'
            if(this.cells[x+val[0]][y+val[1]].innerHTML!='🚢'){
                if(val[1] == 1){
                    
                    this.cells[x+val[0]][y+val[1]].childNodes[0].classList.add('spa')
                    this.duckInfo.currentDirection = 1;
                }
                else if(val[1] == -1){
                    this.cells[x+val[0]][y+val[1]].childNodes[0].classList.remove('spa')
                    this.duckInfo.currentDirection = -1;
                }
                if(val[0] != 0){
                    if(this.duckInfo.currentDirection == 1)
                        this.cells[x+val[0]][y+val[1]].childNodes[0].classList.add('spa')
                    else
                    this.cells[x+val[0]][y+val[1]].childNodes[0].classList.remove('spa')
            }
        }
            // console.log(this.duckInfo.currentDirection)

            //Lighting up islands once they are entered
            if(!this.cells[x+val[0]][y+val[1]].water){
                this.lift(this.cells[x+val[0]][y+val[1]].islandNumber)
            }
            else if(!this.cells[x][y].water && this.islands[this.cells[x][y].islandNumber][0].getAttribute('hasEgg') == 'false'){ //&&this.islands[this.cells[x+val[0]][y+val[1]].islandNumber][0].getAttribute('hasEgg') != 'true'){
                this.lower(this.cells[x][y].islandNumber)
                console.log(this.islands[this.cells[x][y].islandNumber][0].getAttribute('hasEgg'))
            }


            return true;
        }
        else if(this.cells[x+val[0]]?.[y+val[1]] && this.cells[x+val[0]][y+val[1]].innerHTML=='🚢'){
            console.log('EXIT')
            if(this.selectedIslands.length==3){
                this.cells[x][y].childNodes[0].innerHTML = ''
                this.checkResult();
                return true;
            }
            return false
        }
        else{
            return false;
        }
    }

    checkResult(){
        console.log(this.correctIslands)
        let gameResult = true;
        this.correctIslands.forEach( e =>{
            if(!this.selectedIslands.includes(e)){
                gameResult = false;
            }
        })

        this.islands.forEach(e=>{
            if(!this.correctIslands.includes(e[0].islandNumber)){
                e.forEach(i=>{
                    i.classList.add('flood1')
                })
            }
        })



        if(gameResult){
            console.log("Victory!")
        }else{
            console.log('Defeat!')
        }

        this.floodIsland()
        setTimeout(()=>{
            this.resetGame()
        }, 3000)

    }

    resetGame(){

        // this.cont.parentNode.removeChild(this.cont)

        this.duckInfo.x = 0;
        this.duckInfo.y = 0;
        this.duckInfo.currentDirection = 1;

        this.selectedIslands.length = 0;
        this.correctIslands.length = 0;
        this.islands.length = 0;
        this.cells.length = 0;

        this.cont.replaceChildren()

        this.fetchMatrix().then(()=>{      
            this.createMatrix()
            this.addBorders()
            this.test()
            this.addEggPropertyOnIslands()
            this.calculateAverageHeight()

        })



    }

    addEggPropertyOnIslands(){
        this.islands.forEach(e=>{
            e[0].setAttribute('hasEgg', 'false')
        })
    }

    begin(){

        this.cont = document.createElement('div') 
        this.cont.classList.add('matrix'); 
        this.host.appendChild(this.cont)



        this.fetchMatrix().then(()=>{
            console.log(this.matrix)
            this.createMatrix()
            this.addBorders()
            this.test()
            this.addEggPropertyOnIslands()
            this.calculateAverageHeight()
            // this.floodIsland(0)
        })
        // console.log(this.islands[2])
    }

    floodIsland(val){
        console.log(this.islands[0][0])
        this.islands[0].forEach(e=>{
            e.classList.add('flood1')
        })

    }

    createMatrix() {



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
                cell.height = this.matrix[i][j];
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
                //MOUSE DETECTION
                // if(!cell.water){
                //     cell.addEventListener('mouseenter', (event) => {
                //         // const islandNumber = event.target.getAttribute('islandNumber');
                //         // console.log(event.target.islandNumber);
                //         this.lift(event.target.islandNumber)
                //     })
                //     cell.addEventListener('mouseleave', (event) => {
                //         // const islandNumber = event.target.getAttribute('islandNumber');
                //         // console.log(event.target.islandNumber);
                //         this.lower(event.target.islandNumber)
                //     })
                // }
                cell.classList.add('tet')
                let x = document.createElement('span')
                x.classList.add('spa')
                cell.appendChild(x);
                if(i==0 && j == 0){
                    x.innerHTML = '🦆'
                }

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
        this.islands[this.islands.length] = [] 
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
                // if(this.matrix[i][j]<290 && this.matrix[i][j]>0){
                //     if(Math.random()<.02)
                //     this.cells[i][j].innerHTML='🏠'
                // }
                // if(this.matrix[i][j]>=290 && this.matrix[i][j]<500){
                //     if(Math.random()<.02)
                //         this.cells[i][j].innerHTML='🌳'
                // }
                // if(this.matrix[i][j]>=500 && this.matrix[i][j]<750){
                //     if(Math.random()<.02)
                //         this.cells[i][j].innerHTML='🌲'
                // }
                //

                


                // console.log(this.matrix[i][j])

            }

        }
        let a,b
        do{
            a = Math.floor(Math.random()*30)
            b = Math.floor(Math.random()*30)
            console.log(a)
        }
        while(!this.cells[a][b].water)
        this.cells[a][b].childNodes[0].innerHTML = '🚢'
        this.cells[a][b].innerHTML = '🚢'

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