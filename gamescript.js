var canvas;
var canvasContext;
var ballX = 50;
//Determina a cuántos cuadros se moverá de manera horizontal.

var ballY = 50;
//Determina a cuántos cuadros se moverá de manera vertical.

var ballSpeedX = 10;
//Determina la velocidad de la bola de forma horizontal.

var ballSpeedY = 4;
//Determina la velocidad de la bola de forma vertical.

var player1Score = 0;
var player2Score = 0;
//Con estas variables, determinaremos la puntuación al iniciar cada partida, y luego podremos mejorar la visualización de los scores de cada jugador.

const WINNING_SCORE = 3;
//Esta constante es nuestra puntuación límite para determinar un ganador.

var showingWinScreen = false;
//Esta variable nos sirve para pausar el juego una vez se haya alcanzado la puntuación límite por parte de cualquiera de los 2 jugadores.

var paddle1Y = 250;
var paddle2Y = 250;

const PADDLE_THICKNESS = 5; //Esta constante sirve para determinar el grosor que tendrán las paddles.
const PADDLE_HEIGHT = 100; //Mientras que esta constante sirve para determinar el tamaño de los paddles verticalmente.

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
    //Toda esta función sirve para poder calcular la posición de nuestro cursor dentro del canvas.
    //Para eventualmente poder lograr que nuestro paddle se mueva hacia donde está nuestro ratón.
    //(El movimiento del paddle será SOLO es vertical, pero la posición X es para que detecte el movimiento horizontal del cursor).
}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function() {
//El evento window.onload, sirve para cuando queremos dejar en claro que se dispare únicamente cuando todos los elementos de nuestra página, e incluso nuestros recursos.
//Como imágenes, o scripts hayan terminado de cargarse.
    
    canvas = document.getElementById('gameCanvas');
    //Aquí le estamos diciendo a nuestro script, que la variable global canvas, manipule nuestro elemento HTML cuyo id es gameCanvas.
    canvasContext = canvas.getContext('2d');
    //El método getContext('2d'); sirve para retornar un objeto, el cuál representa un contexto de dibujo para un canva específico, en este caso, es 2D.
    
    var framesPerSecond = 30;
    setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', 
        function(evt) {
            var mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });
    //Este eventListener sirve para poder mover el centro de nuestro paddle, en paralelo a la posición de nuestro cursor siempre que este se encuentre DENTRO de nuestro espacio del canva.
}

function ballReset() {
    
    if (player1Score >= WINNING_SCORE || //Así como existe el && (AND) para determinar una condición doble, también existe el || (OR).
        player2Score >= WINNING_SCORE) {
            showingWinScreen = true;
        }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.width/2;
}
//Esta función sirve para resetear la bola cuando esta toque un extremo de la pantalla, y esta no haya llegado a tocar ninguno de los paddles (Ni el paddle del jugador, ni el paddle de la máquina).

function computerMovement() {

    var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT/2);
    //Esta línea del código sirve para que el paddle de la IA no vibre al moverse, para que su movimiento se vea más fluido.

    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    }
    else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}
//Esta función sirve para que la IA controle el paddle de la derecha

function moveEverything() {

    if (showingWinScreen == true) {
        return;
    } 
    computerMovement();
    
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    if (ballX < 0) {
        if (ballY > paddle1Y && 
            ballY < paddle1Y+PADDLE_HEIGHT) { 
                ballSpeedX = -ballSpeedX;
                
                var deltaY = ballY
                        -(paddle1Y+PADDLE_HEIGHT/2);
                //Esta variable sirve para que la pelota no rebote simplemente como si el paddle fuera un muro, sino que dependiendo de dónde golpee
                //La bola tendrá una trayectoria diferente al momento de rebotar. 
                ballSpeedY = deltaY * 0.35;
        }       
        else {
            player2Score += 1;
            ballReset();
            //Escribir +=, -=, *=, /=, sirve para no tener que escribir la variable es igual a la variable (operación matemática) Num.
            //Es decir, para no tener que escribir player2Score = player2Score +,-,*,/ 1;
        }
    //Este if - else sirve para que la pelote rebote, en caso de que llegue a ser bloqueada por la raqueta del jugador.
    //En caso de que no se logre llegar a bloquearla, irá por el else, y reseteará la pelota con la función de ballReset.
    }

    if (ballX > canvas.width) {
        if (ballY > paddle2Y && 
            ballY < paddle2Y+PADDLE_HEIGHT) { 
                ballSpeedX = -ballSpeedX;

                var deltaY = ballY
                        -(paddle2Y+PADDLE_HEIGHT/2);
                //Esta variable sirve para que la pelota no rebote simplemente como si el paddle fuera un muro, sino que dependiendo de dónde golpee
                //La bola tendrá una trayectoria diferente al momento de rebotar. 
                ballSpeedY = deltaY * 0.35;
        }
        else {
            player1Score++; //Nota del video: De preferencia, siempre escribir la suma de la puntuación, antes que el reset de la pelota.
            ballReset();
            //También se puede escribir simplemente el nombre de la variable++ para que de esta manera, en caso de cumplirse la condición.
            //Se le aumente en 1 el valor de la variable.
        }
    }

    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    //Esto sirve para, cuando la bola llegue hasta el límite superior e inferior, rebote hacia abajo y arriba respectivamente.
}

function drawNet() {
    for (var i = 0; i < canvas.height; i+=40) {
        colorRect(canvas.width/2-1, i, 2, 20, 'gray');
    }
}
//Esta función, junto al loop for, son escenciales para dibujar la red en nuestro juego, de manera centrada.

function drawEverything() {
    
    colorRect(0, 0, canvas.width, canvas.height, 'black');
    //Aquí estamos dando los parámetros que contiene nuestra función colorRect (o colorRectangle), en la cuál le especificamos las dimensiones de nuestro canva.
    //Recordando siempre que los 2 primeros valores equivalen a los ejes del plano cartesianos: "X" e "Y" pero estos empiezan desde la esquina izquierda de nuestro navegador.
    //Haciendo que el valor de 'X' se mueva hacia la derecha, y el de 'Y' se mueva hacia abajo.
    
    if (showingWinScreen) {

        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText('Left player WON!', 350, 200);
        }
        else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillStyle = 'white';
            canvasContext.fillText('Right player WON!', 350, 200);
        }


        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Click to continue', 350, 500);
        return;
    }

    drawNet();

    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //Esta linea es para crear nuestro paddle (lado izquierdo).
    
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //Esta linea es para crear la raqueta de la IA (lado derecho).
    
    colorCircle(ballX, ballY, 10, 'white');
    //Con esto le damos las dimensiones y el color a la pelota.

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.width-100, 100);
    //Aquí se programa la puntuación de cada lado.
} 

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
    //Estas línea son la que crean la pelota y les da su forma circular.
    //la línea 0, Math.PI*2 son las que le dan el tamaño y la circunferencia a la pelota.
    //Ya que Math.PI nos daría solo la mitad de una circunferencia, y al multiplicar pi * 2, nos daría la circunferencia entera.
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height)
}