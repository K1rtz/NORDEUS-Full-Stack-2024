import {Game} from './Game.js'
import {Game2} from './Game2.js'
import { FullGame } from './FullGame.js';


async function fetchMatrix() {
    const url = 'https://jobfair.nordeus.com/jf24-fullstack-challenge/test';

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const text = await response.text();
        
        //console.log('Response Text:', text);


        const rows = text.trim().split('\n');
        const matrix = rows.map(row => 
            row.split(' ').map(Number) // Podeli svaki red na vrednosti i konvertuj u broj
        );
        const gam = new Game2(matrix);
        gam.begin()
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

}
//fetchMatrix()
// let mat = fetchMatrix();
// console.log(mat)
const fg = new FullGame()
fg.drawEverything()
