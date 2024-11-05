export class Game{


    constructor(matrix){
        this.matrix = matrix;
        this.canvas
        this.ctx
        this.cellSize
    }

    begin(){
        this.createCanvas(600,600)
        this.cellSize = 600/30
        this.drawMap()
    }

    createCanvas(width,height){
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add('canva')
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
    }
    
    drawMap(){
        // this.ctx.fillStyle = 'lightblue';
        // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
    for (let r = 0; r < this.matrix.length; r++) {
        for (let c = 0; c < this.matrix[r].length; c++) {
            const value = this.matrix[r][c];
            let color;

            // Postavi boje na osnovu vrednosti
            if (value == 0) {
                color = 'blue'; // Kopno
            }else{
                color='green'
            }
            this.ctx.fillStyle = color;
            let radius = 10;
        
            this.ctx.beginPath();

            // Gore levo zaobljeno (prva ivica zaobljena)
            this.ctx.moveTo(c * this.cellSize + radius, r * this.cellSize); // Početna tačka
            this.ctx.arcTo(c * this.cellSize + this.cellSize, r * this.cellSize, c * this.cellSize + this.cellSize, r * this.cellSize + this.cellSize, radius); // Gornji desni ugao
            this.ctx.lineTo(c * this.cellSize + this.cellSize, r * this.cellSize + this.cellSize); // Desna strana
            this.ctx.lineTo(c * this.cellSize, r * this.cellSize + this.cellSize); // Donji desni ugao
            this.ctx.lineTo(c * this.cellSize, r * this.cellSize); // Leva strana
            this.ctx.closePath();
            this.ctx.fill(); // Ispuni kvadrat ako želiš boju
            this.ctx.stroke(); // Nacrtaj linije (ako želiš samo ivice)
        }
    }
    
}

// Crtaj zaobljeni pravougaonik
// this.ctx.fillStyle = color;
// this.ctx.beginPath();
// this.ctx.rect(c * this.cellSize, r * this.cellSize, this.cellSize, this.cellSize)
// this.ctx.stroke();
// this.ctx.fill();

// for (let r = 0; r < this.matrix.length; r++) {
    //     for (let c = 0; c < this.matrix[r].length; c++) {
    //         const value = this.matrix[r][c];
    //         let color;

    //         // Postavi boje na osnovu vrednosti
    //         if (value == 0) {
    //             color = 'blue'; // Voda
    //         } else {
    //             color = 'green'; // Kopno
    //         }

    //         // Crtaj zaobljeni pravougaonik
    //         this.ctx.fillStyle = color;
    //         this.ctx.beginPath();
    //         this.ctx.arc(c * this.cellSize + this.cellSize / 2, r * this.cellSize + this.cellSize / 2, this.cellSize / 2, 0, Math.PI * 2);
    //         //this.ctx.rect(c * this.cellSize + this.cellSize / 2, r * this.cellSize + this.cellSize / 2, this.cellSize, this.cellSize)
    //         this.ctx.fill();
    //     }
    // }






}