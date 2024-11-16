import { Game } from "./Game.js";

export class FullGame{


    constructor(){
        this.gameContainer
        this.game;
    }
    
    drawEverything(){

        this.gameContainer = document.createElement('div')
        this.gameContainer.classList.add('gameContainer')
        document.body.appendChild(this.gameContainer)

        const formAndDisplayWrapper = document.createElement('div')
        formAndDisplayWrapper.classList.add('formAndDisplayWrapper')
        this.gameContainer.appendChild(formAndDisplayWrapper)

        this.drawForm(formAndDisplayWrapper)
        this.drawLevels()


        this.game = new Game(formAndDisplayWrapper, this)
        this.game.begin()
        
    }
    
    drawForm(host){
        //GAME FORM 

        let formWrapper = document.createElement('div')
        formWrapper.classList.add('formWrapper')
        host.appendChild(formWrapper)

        let form = document.createElement('div')
        form.classList.add('form')
        formWrapper.appendChild(form)

        //livesDisplay
        let livesDisplayWrapper = document.createElement('div')
        livesDisplayWrapper.classList.add('livesDisplayWrapper')
        form.appendChild(livesDisplayWrapper)

        let livesDisplay = document.createElement('div')
        livesDisplay.classList.add('livesDisplay')
        livesDisplayWrapper.appendChild(livesDisplay)

        livesDisplay.innerHTML = "❤️ ❤️ ❤️ ❤️ ❤️ ❤️ "


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
            if(e == '🦆'){
                avatar.classList.add('selected')
            }
            
            avatar.onclick = (ev) =>{
                if(!this.game.gameActive){

                    avatarForm.childNodes.forEach(e=>{
                        ev.target.classList.add('selected')
                        if(e !== ev.target){
                            e.classList.remove('selected')
                        }
                    })
                    this.game.updateAvatar(ev.target.innerHTML)
                }
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



        let select = document.createElement('select')
        select.classList.add('select1')
        let op
        let options = ['Easy', 'Medium', 'Hard']
        options.forEach((e,index)=>{
            op = document.createElement('option')
            op.textContent = options[index]
            select.appendChild(op)
        })
        selectForm.appendChild(select)

        select.onchange = (ev) =>{
            this.updateLegend(ev.target.value)
            this.game.updateLives(ev.target.value)
            this.game.updateDifficulty(ev.target.value)
        }

        //FORM LEGEND
        let gameLegendWrapper = document.createElement('div')
        gameLegendWrapper.classList.add('gameLegendWrapper')
        form.appendChild(gameLegendWrapper)

        let gameLegend = document.createElement('div')
        gameLegend.classList.add('gameLegend')
        gameLegendWrapper.appendChild(gameLegend)

        //OPCIJE
        this.updateLegend('Easy')


        //SUBMIT BUTTON
        let taskProgressWrapper = document.createElement('div')
        taskProgressWrapper.classList.add('taskProgressWrapper')
        form.appendChild(taskProgressWrapper)

        let taskProgress = document.createElement('button')
        taskProgress.classList.add('taskProgress')
        taskProgressWrapper.appendChild(taskProgress);

        taskProgress.innerHTML = "..."

    }

    

    updateLegend(val){
        let legend = this.gameContainer.querySelector('.gameLegend')
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
                colors = ['rgb(0 246 0)', 'rgb(3 220 3)', 'rgb(20 206 20)', 'rgb(253 221 120)', 'rgb(233 198 105)']
                descs = ['0 - 350', '350 - 500', '500 - 650', '650 - 750', '750 - 1000']
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
        this.gameContainer.appendChild(levelsFormWrapper)

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
}