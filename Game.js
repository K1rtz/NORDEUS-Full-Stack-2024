export class Game{


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
        
    }

    layEgg(){
        let x = this.duckInfo.x
        let y = this.duckInfo.y
        if(!this.cells[x][y].water){
            const islandElement = this.islands[this.cells[x][y].islandNumber][0];
            if(islandElement.getAttribute('hasEgg') != 'true' && this.selectedIslands.length<3){
                
                this.islands[this.cells[x][y].islandNumber][0].setAttribute('hasEgg', 'true');
                
                if(!this.moveDuck([0, this.duckInfo.currentDirection]) && !this.moveDuck([0, -this.duckInfo.currentDirection]) && !this.moveDuck([-1,0]))
                    this.moveDuck([1,0])
                
                this.cells[x][y].childNodes[0].innerHTML='🥚'
                this.quack.play()
                this.selectedIslands.push(this.cells[x][y].islandNumber)
                
                this.updateTaskProgress()
            }
        }
    }


    moveDuck(val){
        

        let x = this.duckInfo.x
        let y = this.duckInfo.y
        const barriers = ['🚢','🏠', '🌳', '🌲']

        const targetCell = this.cells[x+val[0]]?.[y+val[1]]
        const currentCell = this.cells[x][y]

        if(targetCell && !barriers.includes(targetCell.innerHTML)){

            //If we walk over egg, we collect it
            if(targetCell.childNodes[0].innerHTML=='🥚'){
                this.islands[targetCell.islandNumber][0].setAttribute('hasEgg', 'false');
                this.selectedIslands = this.selectedIslands.filter(e => e!==targetCell.islandNumber)
                this.updateTaskProgress()
            }

            //Updating avatrs representation
            currentCell.childNodes[0].innerHTML=''
            targetCell.childNodes[0].innerHTML = this.avatar
            this.updateDuckInfo(val, targetCell)

            //Lighting up islands once they are entered
            if(!targetCell.water){
                this.lift(targetCell.islandNumber)
            }
            else if(!currentCell.water && this.islands[currentCell.islandNumber][0].getAttribute('hasEgg') == 'false'){ 
                this.lower(currentCell.islandNumber)
            }
            return true;
        }
        else if(targetCell && targetCell.innerHTML=='🚢' && this.selectedIslands.length==3){
            currentCell.childNodes[0].innerHTML = ''
            this.checkResult();
            return true
        }
        
        return false
        
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
                    i.classList.add('flood')
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
            this.host.parentNode.querySelector('.avatarForm').childNodes.forEach(e=> e.disabled = false)
            this.updateLevels(0)
            this.updatepopUpDiv(0)
        }else if(this.currentLives > 0 && this.currentLevel<12){//NEXT LEVEL
            this.updateLevels(0)
            this.currentLevel++
            this.updatepopUpDiv(1, rightGuesses)
        }else{
            this.gameActive = false;
            this.host.parentNode.querySelector('.select1').disabled = false;
            this.host.parentNode.querySelector('.avatarForm').childNodes.forEach(e=> e.disabled = false)
            this.updateLevels(0)
            this.updatepopUpDiv(2)
        }
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

        let taskProgress = this.host.parentNode.querySelector('.taskProgress')
        taskProgress.innerHTML = 'Use spacebar to lay first egg!'
        let popUpDiv = this.host.querySelector('.popUpDiv')
        popUpDiv.style.display = 'none'

        this.cont.replaceChildren()

        this.fetchMatrix().then(()=>{      
            this.createCellMatrix()
            this.addBorders()
            this.findAllIslands()
            this.calculateAverageIslandHeight()
            if(!this.cells[0][0].water){
                this.lift(0)
            }
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
        
        let popUpDiv = document.createElement('div')
        popUpDiv.classList.add('popUpDiv')
        matrixWrapper.appendChild(popUpDiv)
        
        let popUpDivText = document.createElement('div')
        popUpDivText.classList.add('popUpDivText')
        popUpDivText.innerHTML = "LEVEL DONE"
        popUpDiv.appendChild(popUpDivText)
        
        let popUpDivText2 = document.createElement('div')
        popUpDivText2.classList.add('popUpDivText2')
        popUpDivText2.innerHTML = "x out of 3 eggs survived!"
        popUpDiv.appendChild(popUpDivText2)
        
        let popUpDivButton = document.createElement('button')
        popUpDivButton.classList.add('popUpDivButton')
        popUpDivButton.innerHTML = "next level"
        popUpDiv.appendChild(popUpDivButton)
        
        self = this;
        popUpDivButton.onclick = (ev) =>{

            this.music.loop = true;
            this.music.play()
            this.resetGame()
            this.host.parentNode.querySelector('.select1').disabled = true;
            this.host.parentNode.querySelector('.avatarForm').childNodes.forEach(e=> e.disabled = true)



            if(!this.gameActive){
                this.currentLives = this.livesTotal;
                this.updateLives()
                this.gameActive = true;
                this.currentLevel  = 1
                this.updateLevels()   
            }

        }
        
        this.updatepopUpDiv(-1)

        this.cont = document.createElement('div') 
        this.cont.classList.add('matrix'); 
        matrixWrapper.appendChild(this.cont)


        self = this
        this.fetchMatrix().then(()=>{

            if(self.initialSpawn){
                this.fetchMatrix()
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
                this.cells[i].push(cell)
                this.cont.appendChild(cell)
            }
        }
    }

    createCell(i, j){
        const cell = document.createElement('div');
        cell.classList.add('cell', 'darken');
        cell.i = i;
        cell.j = j;
        cell.water = this.matrix[i][j] === 0;
    

        const color = this.getColorBasedOnHeight(this.matrix[i][j])
        cell.style.backgroundColor = color;

        if (!cell.water) {
            cell.style.border = '1px solid black';
        }
        
        cell.height = this.matrix[i][j];
    
        const span = document.createElement('span');
        span.classList.add('span1', 'flip-horizontal');
        cell.appendChild(span);
    
        if (i === 0 && j === 0) {
            span.innerHTML = this.avatar;
        }
    
        return cell;
    }

    lift(val){
        this.islands[val].forEach(e=>{
            e.classList.remove('darken')
        })
    }

    lower(val){
        this.islands[val].forEach(e=>{
            e.classList.add('darken')
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

                // let color = this.getColorBasedOnHeight(this.matrix[i][j])
                //this.cells[i][j].style.backgroundColor = color;

                // DODAVANJE SLICICA
                if(this.matrix[i][j]<290 && this.matrix[i][j]>0){
                    if(Math.random()<.02){
                        this.cells[i][j].innerHTML='🏠'
                        // this.cells[i][j].childNodes[0].innerHTML='🏠'
                    }
                }
                if(this.matrix[i][j]>=290 && this.matrix[i][j]<500){
                    if(Math.random()<.03)
                        this.cells[i][j].innerHTML='🌳'
                }
                if(this.matrix[i][j]>=500 && this.matrix[i][j]<750){
                    if(Math.random()<.03)
                        this.cells[i][j].innerHTML='🌲'
                }
            }

        }
        let a,b
        do{
            a = Math.floor(Math.random()*30)
            b = Math.floor(Math.random()*30)
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


//UPDATERS

    updatepopUpDiv(val, rightGuesses){
        let popUpDiv = this.host.querySelector('.popUpDiv')
        let popUpDivText = this.host.querySelector('.popUpDivText')
        let popUpDivText2 = this.host.querySelector('.popUpDivText2')
        let wildButton = this.host.querySelector('.popUpDivButton')
        
        popUpDiv.style.display='flex'
        if(val == -1){//STARTING SCREEN
            popUpDiv.style.backgroundColor='#d9d29c'
            popUpDiv.style.border='4px solid rgb(57, 28, 28)'
            popUpDivText.innerHTML = "The Duck Game"
            popUpDiv.style.borderRadius = '8px'


            wildButton.style.backgroundColor='#ab8e71'
            popUpDivText2.style.display = 'none'
            wildButton.innerHTML = 'Start'
            wildButton.style.borderRadius = '5px'
            wildButton.style.marginTop = '4%'
        }
        else if(val == 0){//GAME OVER
            popUpDiv.style.backgroundColor='red'
            popUpDiv.style.border='4px solid rgb(57, 28, 28)'
            popUpDivText.innerHTML = "GAME OVER"
            popUpDiv.style.borderRadius = '8px'


            wildButton.style.backgroundColor='#c00000'
            popUpDivText2.style.display = 'none'
            wildButton.style.borderRadius = '5px'
            wildButton.innerHTML = 'Play Again'
            wildButton.style.marginTop = '4%'
        }else if (val == 1){//LEVEL COMPLETION
            popUpDiv.style.backgroundColor='#ebe581'
            popUpDiv.style.border='4px solid rgb(0, 0, 0)'
            popUpDivText.innerHTML = "Level completed"
            popUpDiv.style.borderRadius = '8px'

            let str = ''
            for(let i = 0; i < 3; i++){
                i < rightGuesses ? str+='🐣' : str+='🍗'
            }

            popUpDivText2.innerHTML = `${rightGuesses} out of 3 eggs have survived ` + str
            wildButton.style.backgroundColor='#e3d249'
            popUpDivText2.style.display = 'flex'
            wildButton.innerHTML = 'next level'
            wildButton.style.borderRadius = '5px'
            wildButton.style.marginTop = '2%'

        }
        else if (val == 2){//GAME COMPLETION
            popUpDiv.style.backgroundColor='#85c057'
            popUpDiv.style.border='4px solid rgb(0, 0, 0)'
            popUpDivText.innerHTML = "Great work!"
            popUpDiv.style.borderRadius = '8px'

            popUpDivText2.style.marginTop = '2%'
            popUpDivText2.innerHTML = `You have finished the game :)`
            wildButton.style.backgroundColor='#ffffff'
            popUpDivText2.style.display = 'flex'
            wildButton.innerHTML = 'Replay'
            wildButton.style.borderRadius = '5px'
            wildButton.style.marginTop = '2%'
        }
    }

    updateDuckInfo(val, targetCell){
        
        this.duckInfo.x += val[0];
        this.duckInfo.y += val[1];

        //Changes the direction in which duck is looking
        if(val[1] == 1){
            targetCell.childNodes[0].classList.add('flip-horizontal')
            this.duckInfo.currentDirection = 1;
        }
        else if(val[1] == -1){
            targetCell.childNodes[0].classList.remove('flip-horizontal')
            this.duckInfo.currentDirection = -1;
        }
        if(val[0] != 0){
            if(this.duckInfo.currentDirection == 1)
                targetCell.childNodes[0].classList.add('flip-horizontal')
            else
            targetCell.childNodes[0].classList.remove('flip-horizontal')
        }
    }

    updateTaskProgress(){
        let taskProgress = this.host.querySelector('.taskProgress')
        taskProgress.innerHTML = `${this.selectedIslands.length}/3 Eggs placed!`
        if(this.selectedIslands.length==3){
            taskProgress.innerHTML = `Big waves incoming, to the ship!`
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

    updateDifficulty(dif){
        this.difficulty = dif;
    }

    updateAvatar(x){
        this.avatar = x;
    }

    updateHearts(){
        let hearts = this.host.querySelector('.livesDisplay')
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

    updateLives(val){
        if(val == 'Hard') this.livesTotal = this.currentLives = 4
        if(val == 'Medium') this.livesTotal = this.currentLives = 5
        if(val == 'Easy') this.livesTotal = this.currentLives = 6
        this.updateHearts()
    }
}