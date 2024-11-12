import { Game2 } from "./Game2.js";

export class FullGame{


    constructor(){
        this.fullDisplay
        this.cont;
        this.matrix 

        this.currentLevel = 1;
        

        this.game;
        this.livesTotal = 5;
        this.currentLives = 5;
    }
    
    drawEverything(){

        this.fullDisplay = document.createElement('div')
        this.fullDisplay.classList.add('fullDisplay')
        document.body.appendChild(this.fullDisplay)



        this.cont = document.createElement('div')
        this.cont.classList.add('mainCont')

        

        this.fullDisplay.appendChild(this.cont)

        this.drawForm(this.cont)
        this.drawLevels()

        self = this
        this.fetchMatrix().then(()=>{
            this.game = new Game2(this.cont, this)
            this.game.begin()
        })
        
    }
    
    drawForm(host){
        //GAME FORM 


        let formWrapper = document.createElement('div')
        formWrapper.classList.add('formWrapper')
        host.appendChild(formWrapper)

        let form = document.createElement('div')
        form.classList.add('form')
        formWrapper.appendChild(form)

        //GAME DESCRIPTION
        let gameDescWrapper = document.createElement('div')
        gameDescWrapper.classList.add('gameDescWrapper')
        form.appendChild(gameDescWrapper)

        let gameDesc = document.createElement('div')
        gameDesc.classList.add('gameDesc')
        gameDescWrapper.appendChild(gameDesc)

        // gameDesc.innerHTML ="The goal of the game is to pick 3 islands with highest average altitude and lay eggs on them so the chances of offspring surviving high floods are highest :) To move the duck use arrow buttons and to lay eggs use spacebar. For the information on each tiles possible altitude consult the legend below"
        // gameDesc.innerHTML = "❤️ ❤️ ❤️ ❤️ 🖤"
        gameDesc.innerHTML = "❤️ ❤️ ❤️ ❤️ ❤️ "


        // //Lifes
        // let lifeCount = document.createElement('div')
        // lifeCount.classList.add('lifeCount')
        // lifeCount.innerHTML = 'would it be too much to keep the explanation here :investigateprime:'
        // form.appendChild(lifeCount)

        //AVATAR

        let avatarWrapper = document.createElement('div')
        avatarWrapper.classList.add('avatarWrapper')
        form.appendChild(avatarWrapper)

        let label = document.createElement('label')
        label.innerHTML = "Pick your avatar"
        label.classList.add('avatarLabel')
        avatarWrapper.appendChild(label)


        let avatarForm = document.createElement('div')
        avatarForm.classList.add('avatarForm')
        avatarWrapper.appendChild(avatarForm)

        let avatars = ['🦆', '🦢', '🐦', '🦚', '🦅', '🦃']
        avatars.forEach(e=>{
            let avatar = document.createElement('button')
            avatar.classList.add('avatarButton')
            avatar.innerHTML = e
            avatarForm.appendChild(avatar)
            if(e == '🦚'){
                avatar.classList.add('selected')
            }
            
            avatar.onclick = (ev) =>{
                avatarForm.childNodes.forEach(e=>{
                    ev.target.classList.add('selected')
                    if(e !== ev.target)
                    e.classList.remove('selected')
                })
                console.log(ev.target.innerHTML)
                this.game.updateAvatar(ev.target.innerHTML)
            }

        })

        //SELEKT

        let selectForm = document.createElement('div')
        selectForm.classList.add('selectForm')
        form.appendChild(selectForm)

        label = document.createElement('label')
        label.innerHTML = "Select difficulty"
        label.classList.add('avatarLabel')
        selectForm.appendChild(label)

        // let selectWrapper = document.createElement('div')
        // selectWrapper.classList.add('selectWrapper')


        let select = document.createElement('select')
        select.classList.add('select1')
        let op
        let options = ['Easy', 'Medium', 'Hard']
        options.forEach((e,index)=>{
            op = document.createElement('option')
            op.textContent = options[index]
            select.appendChild(op)
        })
        // selectWrapper.appendChild(select)
        selectForm.appendChild(select)

        select.onchange = (ev) =>{
            console.log(ev.target.value)
            this.updateLegend(ev.target.value)
        }

        //FORM LEGEND
        let gameLegendWrapper = document.createElement('div')
        gameLegendWrapper.classList.add('gameLegendWrapper')
        form.appendChild(gameLegendWrapper)

        let gameLegend = document.createElement('div')
        gameLegend.classList.add('gameLegend')
        gameLegendWrapper.appendChild(gameLegend)

        //OPCIJE
        let colors = ['rgb(0 246 0)', 'rgb(3 220 3)', 'rgb(20 206 20)', 'rgb(253 221 120)', 'rgb(233 198 105)', 'rgb(222 218 210)', 'rgb(240, 240, 240)']
        let descs = ['0 - 350', '350 - 450', '450 - 550', '550 - 650', '650 - 750', '750 - 880', '880 - 1000']

        let legendItem;
        let colorItem
        let labelItem
        colors.forEach((e, index)=>{
            legendItem = document.createElement('div')
            legendItem.classList.add('legendItem')

            colorItem = document.createElement('div')
            colorItem.classList.add('colorItem')
            colorItem.style.backgroundColor = colors[index]
            legendItem.appendChild(colorItem)

            labelItem = document.createElement('label')
            labelItem.classList.add('labelItem')
            labelItem.innerHTML = descs[index]
            legendItem.appendChild(labelItem)

            gameLegend.appendChild(legendItem)
        })
        //SUBMIT BUTTON
        let submitButtonWrapper = document.createElement('div')
        submitButtonWrapper.classList.add('submitButtonWrapper')
        form.appendChild(submitButtonWrapper)

        let submitButton = document.createElement('button')
        submitButton.classList.add('submitButton')
        submitButtonWrapper.appendChild(submitButton);

        submitButton.innerHTML = "..."

    }

    updateLegend(val){
        let legend = this.cont.querySelector('.gameLegend')
        legend.replaceChildren()

        let legendItem;
        let colorItem
        let labelItem

        let colors;
        let descs;

        switch(val){
            case 'Easy':
                colors = ['rgb(0 246 0)', 'rgb(3 220 3)', 'rgb(20 206 20)', 'rgb(253 221 120)', 'rgb(233 198 105)', 'rgb(222 218 210)', 'rgb(240, 240, 240)']
                descs = ['0 - 350', '350 - 450', '450 - 550', '550 - 650', '650 - 750', '750 - 880', '880 - 1000']
                break
            case 'Medium':
                colors = ['rgb(0 246 0)', 'rgb(3 220 3)', 'rgb(20 206 20)', 'rgb(253 221 120)', 'rgb(233 198 105)', 'rgb(222 218 210)', 'rgb(240, 240, 240)']
                descs = ['0 - 280', '280 - 500', '500 - 750', '750 - 1000', 'test', 'test', 'test']
                break
            case 'Hard':
                colors = ['rgb(0, 230, 0)', 'rgb(0, 200, 0)', 'rgb(253 221 120)', 'rgb(233 198 105)']
                descs = ['0 - 280', '280 - 500', '500 - 750', '750 - 1000']
                break
        }       

        colors.forEach((e, index)=>{
            legendItem = document.createElement('div')
            legendItem.classList.add('legendItem')

            colorItem = document.createElement('div')
            colorItem.classList.add('colorItem')
            colorItem.style.backgroundColor = colors[index]
            legendItem.appendChild(colorItem)

            labelItem = document.createElement('label')
            labelItem.classList.add('labelItem')
            labelItem.innerHTML = descs[index]
            legendItem.appendChild(labelItem)

            legend.appendChild(legendItem)
        })

    }

    drawLevels(){
        let levelsFormWrapper = document.createElement('div')
        levelsFormWrapper.classList.add('levelsFormWrapper')
        this.fullDisplay.appendChild(levelsFormWrapper)

        let levelsForm = document.createElement('div')
        levelsForm.classList.add('levelsForm')
        levelsFormWrapper.appendChild(levelsForm)

        let level;
        for(let i  = 1; i <= 12; i++){
            level = document.createElement('div')
            level.innerHTML = i
            level.classList.add('level')
            levelsForm.appendChild(level)
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
            
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        }

    }




}