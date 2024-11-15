export class Game2{


    constructor(host){
        this.host = host;
        this.matrix;

        //GAME THIGNYS
        this.initialSpawn = true;
        this.currentLevel = 1;
        this.livesTotal = 6;
        this.currentLives = 6;
        this.avatar = '🦆'
        this.difficulty = 'Easy'


        this.quack = new Audio('./Audio/quack.mp3')
        this.music = new Audio('./Audio/game-music.mp3')

        this.cont
        this.cells = []
        this.islands = []
        this.selectedIslands = []
        this.correctIslands = []

        
        this.levelActive = false;
        this.gameActive = false;

        
        this.duckInfo = {
            x: 0,
            y: 0,
            currentDirection: 1
        }
        
        this.addEventListeners();
    }

    updateLives(val){
        if(val == 'Hard') this.livesTotal = this.currentLives = 4
        if(val == 'Medium') this.livesTotal = this.currentLives = 5
        if(val == 'Easy') this.livesTotal = this.currentLives = 6
        this.updateHearts()

    }
    

    async fetchMatrix() {
        const url = 'https://jobfair.nordeus.com/jf24-fullstack-challenge/test';
    
        try {
            const response = await fetch(url);
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const text = await response.text();    
    
            const rows = text.trim().split('\n');
            this.matrix = rows.map(row => 
                row.split(' ').map(Number) 
            );

            console.log('success')
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }
    }


    addEventListeners(){
        document.addEventListener('keydown', (event)=>{
            if(this.levelActive){
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
            }
        }
        })
    }

    calculateAverageIslandHeight(){
        let islandIndexAndAverage = []
        this.islands.forEach((island, index)=>{
            let islandNumber = index
            let islandAverage = 0;
            island.forEach(e=>{
                islandAverage+=e.height
            })
            islandAverage/=island.length;
            islandIndexAndAverage.push({index: islandNumber,
                    averageHeight: islandAverage
            })
        })
        let top3 = islandIndexAndAverage.sort((a,b) => b.averageHeight - a.averageHeight).slice(0 , 3)
        top3.forEach(e=>{
            this.correctIslands.push(e.index)
        })
        console.log(top3)
        
    }

    layEgg(){
        let x = this.duckInfo.x
        let y = this.duckInfo.y

        const islandElement = this.islands[this.cells[x][y].islandNumber][0];
        // console.log(this.cells[x][y].height)
        if(islandElement.getAttribute('hasEgg') != 'true' && this.selectedIslands.length<3){
        // if(this.selectedIslands.length<3){

            this.islands[this.cells[x][y].islandNumber][0].setAttribute('hasEgg', 'true');
            if(!this.moveDuck([0, this.duckInfo.currentDirection]))
                this.moveDuck([0, -this.duckInfo.currentDirection])
            
            this.cells[x][y].childNodes[0].innerHTML='🥚'
            this.quack.play()
            this.selectedIslands.push(this.cells[x][y].islandNumber)
            console.log('Selected islands are:' + this.selectedIslands)

            let button = this.host.querySelector('.submitButton')
            button.innerHTML = `${this.selectedIslands.length}/3 Eggs placed!`
            if(this.selectedIslands.length==3){
                button.innerHTML = `Big waves incoming, to the ship!`
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


            // if(this.cells[x][y].childNodes[0].innerHTML!='🥚')
            this.cells[x][y].childNodes[0].innerHTML=''
            // this.cells[x+val[0]][y+val[1]].childNodes[0].innerHTML='🦆'
            this.cells[x+val[0]][y+val[1]].childNodes[0].innerHTML = this.avatar
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
        this.music.pause()
        this.levelActive = false;
        let rightGuesses = 0;

        this.selectedIslands.forEach(e=>{
            if(this.correctIslands.includes(e))
                rightGuesses++;
        })
        
        this.islands.forEach(e=>{
            if(!this.correctIslands.includes(e[0].islandNumber)){
                e.forEach(i=>{
                    i.classList.add('flood1')
                })
            }
        })

        //Updating lives
        this.currentLives -= (3-rightGuesses)
        this.updateHearts()

        //GAME OVER
        if(this.currentLives <= 0){
            this.gameActive = false;
            this.host.parentNode.querySelector('.select1').disabled = false;
            this.updateLevels(0)
            this.updateWildDiv(0)
        }else if(this.currentLives > 0 && this.currentLevel<12){//NEXT LEVEL
            this.updateLevels(0)
            this.currentLevel++
            this.updateWildDiv(1, rightGuesses)
        }else{
            this.gameActive = false;
            this.host.parentNode.querySelector('.select1').disabled = false;
            this.updateLevels(0)
            this.updateWildDiv(2)
        }
    }  

    updateLevels(){
        let levelsForm = this.host.parentNode.querySelector('.levelsForm')
        for(let i = 0; i < 12; i++){
            i < this.currentLevel ? 
            levelsForm.childNodes[i].classList.add('active') :
            levelsForm.childNodes[i].classList.remove('active')
        }
    }

    updateWildDiv(val, rightGuesses){
        let wildDiv = this.host.querySelector('.wildDiv')
        let wildDivText = this.host.querySelector('.wildDivText')
        let wildDivText2 = this.host.querySelector('.wildDivText2')
        let wildButton = this.host.querySelector('.wildDivButton')
        
        wildDiv.style.display='flex'
        if(val == -1){//STARTING SCREEN
            wildDiv.style.backgroundColor='#d9d29c'
            wildDiv.style.border='4px solid rgb(57, 28, 28)'
            wildDivText.innerHTML = "The Duck Game"
            wildDiv.style.borderRadius = '8px'


            wildButton.style.backgroundColor='#ab8e71'
            wildDivText2.style.display = 'none'
            wildButton.innerHTML = 'Start'
            wildButton.style.borderRadius = '5px'
            wildButton.style.marginTop = '4%'
        }
        else if(val == 0){//GAME OVER
            console.log('sed')
            wildDiv.style.backgroundColor='red'
            wildDiv.style.border='4px solid rgb(57, 28, 28)'
            wildDivText.innerHTML = "GAME OVER"
            wildDiv.style.borderRadius = '8px'


            wildButton.style.backgroundColor='#c00000'
            wildDivText2.style.display = 'none'
            wildButton.style.borderRadius = '5px'
            wildButton.innerHTML = 'Play Again'
            wildButton.style.marginTop = '4%'
        }else if (val == 1){//LEVEL COMPLETION
            wildDiv.style.backgroundColor='#ebe581'
            wildDiv.style.border='4px solid rgb(0, 0, 0)'
            wildDivText.innerHTML = "Level completed"
            wildDiv.style.borderRadius = '8px'

            let str = ''
            for(let i = 0; i < 3; i++){
                i < rightGuesses ? str+='🐣' : str+='🍗'
            }

            wildDivText2.innerHTML = `${rightGuesses} out of 3 eggs have survived ` + str
            wildButton.style.backgroundColor='#e3d249'
            wildDivText2.style.display = 'flex'
            wildButton.innerHTML = 'next level'
            wildButton.style.borderRadius = '5px'
            wildButton.style.marginTop = '2%'

        }
        else if (val == 2){//GAME COMPLETION
            wildDiv.style.backgroundColor='#85c057'
            wildDiv.style.border='4px solid rgb(0, 0, 0)'
            wildDivText.innerHTML = "Great work!"
            wildDiv.style.borderRadius = '8px'

            wildDivText2.style.marginTop = '2%'
            wildDivText2.innerHTML = `You have finished the game :)`
            wildButton.style.backgroundColor='#ffffff'
            wildDivText2.style.display = 'flex'
            wildButton.innerHTML = 'Replay'
            wildButton.style.borderRadius = '5px'
            wildButton.style.marginTop = '2%'
        }
    }

    updateHearts(){
        let hearts = this.host.querySelector('.gameDesc')
        let srt = ''
        for(let i = 0; i < this.livesTotal; i++){
            if(i < this.currentLives){
                srt += '❤️ '
            }
            else{
                srt+= '🖤 '
            }
        }
        hearts.innerHTML = srt;
    }


    resetGame(){
        this.levelActive = true;

        this.updateLevels()
        this.duckInfo.x = 0;
        this.duckInfo.y = 0;
        this.duckInfo.currentDirection = 1;

        this.selectedIslands.length = 0;
        this.correctIslands.length = 0;
        this.islands.length = 0;
        this.cells.length = 0;

        let subBut = this.host.parentNode.querySelector('.submitButton')
        subBut.innerHTML = 'Place first egg!'

        let wildDiv = this.host.querySelector('.wildDiv')
        wildDiv.style.display = 'none'

        this.cont.replaceChildren()

        this.fetchMatrix().then(()=>{      
            this.createCellMatrix()
            this.addBorders()
            this.findAllIslands()
            this.calculateAverageIslandHeight()

        })
    }

    initializeNextLevel(){
        this.resetGame()
    }

    //InitialShow
    begin(){
        
        
        let matrixWrapper = document.createElement('div')
        matrixWrapper.classList.add('matrixWrapper')
        this.host.appendChild(matrixWrapper)
        
        let wildDiv = document.createElement('div')
        wildDiv.classList.add('wildDiv')
        matrixWrapper.appendChild(wildDiv)
        
        let wildDivText = document.createElement('div')
        wildDivText.classList.add('wildDivText')
        wildDivText.innerHTML = "LEVEL DONE"
        wildDiv.appendChild(wildDivText)
        
        let wildDivText2 = document.createElement('div')
        wildDivText2.classList.add('wildDivText2')
        wildDivText2.innerHTML = "x out of 3 eggs survived!"
        wildDiv.appendChild(wildDivText2)
        
        let wildDivButton = document.createElement('button')
        wildDivButton.classList.add('wildDivButton')
        wildDivButton.innerHTML = "next level"
        wildDiv.appendChild(wildDivButton)
        
        self = this;
        wildDivButton.onclick = (ev) =>{

            this.music.loop = true;
            this.music.play()
            this.resetGame()
            this.host.parentNode.querySelector('.select1').disabled = true;


            if(!this.gameActive){
                this.currentLives = this.livesTotal;
                this.updateLives()
                this.gameActive = true;
                this.currentLevel  = 1
                this.updateLevels()   
            }
            
        }
        
        this.updateWildDiv(-1)

        this.cont = document.createElement('div') 
        this.cont.classList.add('matrix'); 
        matrixWrapper.appendChild(this.cont)


        self = this
        this.fetchMatrix().then(()=>{

            if(self.initialSpawn){
                this.createCellMatrix()
                this.addBorders()

                for(let i = 0; i < 30; i++){
                    // 
                    this.cells[i].forEach(e=>{
                        e.style.backgroundColor='#1212ff'
                        e.style.border='none'
                        e.innerHTML = ''
                        if(Math.random() < 0.3){
                            e.style.borderBottom = '1px solid black'
                        }
                        if(Math.random() < 0.01){
                            // e.innerHTML = '🐙'
                            e.innerHTML = '🐠'
                        }
                        else if(Math.random() < 0.02){
                            e.innerHTML = ''
                        }
                        e.style.borderRadius='0px'
                    })


                }
                self.initialSpawn = false;
            }else{
                this.createCellMatrix()
                this.addBorders()
                this.findAllIslands()
                this.calculateAverageIslandHeight()
            }
        })
    }

    createCellMatrix() {
        for (let i = 0; i < 30; i++) {
            this.cells[i] = []
            for (let j = 0; j < 30; j++) {

                const cell = this.createCell(i, j)
                console.log(cell)
                console.log(cell.height)
                this.cells[i].push(cell)
                this.cont.appendChild(cell)
            }
        }
    }

    createCell(i, j){
        const cell = document.createElement('div');
        cell.classList.add('cell', 'tet');
        cell.i = i;
        cell.j = j;
        cell.water = this.matrix[i][j] === 0;
    
        // Dodaj boju i granicu na osnovu toga da li je voda ili kopno
        cell.style.backgroundColor = cell.water ? 'blue' : 'green';
        if (!cell.water) {
            cell.style.border = '1px solid black';
        }
        
        cell.height = this.matrix[i][j];
    
        // Kreiraj span za prikaz avatara ili drugih simbola
        const span = document.createElement('span');
        span.classList.add('span1', 'spa');
        cell.appendChild(span);
    
        // Postavi avatar u gornji levi ugao
        if (i === 0 && j === 0) {
            span.innerHTML = this.avatar;
        }
    
        return cell;
    }




    updateAvatar(x){
        this.avatar = x;
    }
    updateDifficulty(dif){
        this.difficulty = dif;
    }

    lift(val){
        this.islands[val].forEach(e=>{
            e.classList.remove('tet')
        })
    }
    lower(val){
        this.islands[val].forEach(e=>{
            e.classList.add('tet')
        })
    }


    findAllIslands(){
        for(let i = 0; i < 30; i ++){
            for(let j = 0; j < 30; j++){
                if(!this.cells[i][j].visited && !this.cells[i][j].water){
                    this.exploreIsland(i, j);
                }
            }
        }
    }


    exploreIsland(i, j){

        this.cells[i][j].setAttribute('hasEgg', 'false')
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

            if(this.cells[i-1]?.[j] && !this.cells[i-1][j].visited && !this.cells[i-1][j].water){
                this.cells[i-1][j].visited = true;
                this.cells[i-1][j].islandNumber = this.islands.length-1
                this.islands[this.islands.length-1].push(this.cells[i-1][j]);
                queue.push(this.cells[i-1][j])
            }
            if(this.cells[i][j+1] && !this.cells[i][j+1].visited && !this.cells[i][j+1].water){
                this.cells[i][j+1].visited = true;
                this.cells[i][j+1].islandNumber = this.islands.length-1
                this.islands[this.islands.length-1].push(this.cells[i][j+1]);
                queue.push(this.cells[i][j+1])

            }
            if(this.cells[i+1]?.[j] && !this.cells[i+1][j].visited && !this.cells[i+1][j].water){
                this.cells[i+1][j].visited = true;
                this.cells[i+1][j].islandNumber = this.islands.length-1
                this.islands[this.islands.length-1].push(this.cells[i+1][j]);
                queue.push(this.cells[i+1][j])
            }
            if(this.cells[i][j-1] && !this.cells[i][j-1].visited && !this.cells[i][j-1].water){
                this.cells[i][j-1].visited = true;
                this.cells[i][j-1].islandNumber = this.islands.length-1
                this.islands[this.islands.length-1].push(this.cells[i][j-1]);
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

                // DODAVANJE SLICICA
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

        if(height===0) return 'blue'

        if(this.difficulty == 'Easy'){
            if (height <= 350) return 'rgb(0 246 0)'
            if (height <= 450) return 'rgb(3 220 3)'
            if (height <= 550) return 'rgb(20 206 20)'
            if (height <= 650) return 'rgb(253 221 120)'
            if (height <= 750) return 'rgb(233 198 105)'
            if (height <= 880) return 'rgb(222 218 210)'
            return 'rgb(240, 240, 240)'
        }
        if(this.difficulty == 'Medium'){
            if (height <= 350) return 'rgb(0 246 0)'
            if (height <= 500) return 'rgb(3 220 3)'
            if (height <= 650) return 'rgb(20 206 20)'
            if (height <= 750) return 'rgb(253 221 120)'
            return 'rgb(233 198 105)'
        }
        if(this.difficulty == 'Hard'){
            if (height <= 280) return 'rgb(0, 230, 0)'
            if (height <= 500) return 'rgb(0, 200, 0)'
            if (height <= 750) return 'rgb(253 221 120)'
            return 'rgb(233 198 105)'
        }
    }
}