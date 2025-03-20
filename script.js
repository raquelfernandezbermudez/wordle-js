const wordToGuess = "PLATA";
const maxAttempts = 6; // Número máximo de intentos
let currentAttempt = 0; // Intento actual (fila)

// Crear el tablero dinámicamente
function createGameBoard() {
    const gameBoard = document.getElementById("game-board");
    gameBoard.innerHTML = ''; // Limpiar el contenido actual
    
    // Crear filas para los intentos
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
        const row = document.createElement('div');
        row.className = `attempt-row attempt-${attempt}`;
        row.style.display = 'flex';
        row.style.justifyContent = 'center';
        row.style.gap = '10px';
        row.style.margin = '10px 0';
        
        // Crear inputs para cada letra
        for (let i = 0; i < 5; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.maxLength = 1;
            input.className = `letter-input row-${attempt} col-${i}`;
            input.disabled = attempt !== 0; // Solo habilitar la primera fila al inicio
            row.appendChild(input);
        }
        
        gameBoard.appendChild(row);
    }
    
    // Configurar eventos para los inputs de la primera fila
    setupRowInputEvents(0);
}

// Configurar eventos para los inputs de una fila específica
function setupRowInputEvents(rowIndex) {
    const rowInputs = document.querySelectorAll(`.letter-input.row-${rowIndex}`);
    
    rowInputs.forEach((input, index) => {
        // Auto-focus al siguiente input al escribir
        input.addEventListener("input", function(e) {
            if (this.value.length === 1 && index < 4) {
                rowInputs[index + 1].focus();
            }
            this.value = this.value.toUpperCase(); // Convertir a mayúsculas
        });
        
        // Manejar la tecla Backspace
        input.addEventListener("keydown", function(e) {
            if (e.key === "Backspace") {
                if (this.value === "" && index > 0) {
                    rowInputs[index - 1].focus();
                }
            }
        });
    });
}

// Comprobar la palabra ingresada
function checkWord() {
    const currentRowInputs = document.querySelectorAll(`.letter-input.row-${currentAttempt}`);
    let userWord = "";
    
    // Construir la palabra del usuario
    currentRowInputs.forEach(input => {
        userWord += input.value.toUpperCase();
    });
    
    // Verificar que se hayan ingresado 5 letras
    if (userWord.length !== 5) {
        Swal.fire({
            icon: "warning",
            title: "¡Atención!",
            text: "Debes ingresar 5 letras.",
            confirmButtonColor: "#f39c12",
        });
        return;
    }
    
    // Comprobar palabra y cambiar colores
    let correctLetters = 0;
    for (let i = 0; i < 5; i++) {
        if (userWord[i] === wordToGuess[i]) {
            currentRowInputs[i].classList.add("correct");
            correctLetters++;
        } else if (wordToGuess.includes(userWord[i])) {
            currentRowInputs[i].classList.add("present");
        } else {
            currentRowInputs[i].classList.add("absent");
        }
        
        // Deshabilitar el input después de comprobar
        currentRowInputs[i].disabled = true;
    }
    
    // Si acierta la palabra, mostrar mensaje de éxito
    if (correctLetters === 5) {
        Swal.fire({
            icon: "success",
            title: "¡Felicidades!",
            text: "Has adivinado la palabra 🎉",
            confirmButtonColor: "#28a745",
        });
        // Fin del juego
        return;
    }
    
    // Si no ha acertado y quedan intentos, pasar al siguiente intento
    currentAttempt++;
    if (currentAttempt < maxAttempts) {
        // Habilitar la siguiente fila
        const nextRowInputs = document.querySelectorAll(`.letter-input.row-${currentAttempt}`);
        nextRowInputs.forEach(input => {
            input.disabled = false;
        });
        
        // Configurar eventos para la nueva fila
        setupRowInputEvents(currentAttempt);
        
        // Enfocar el primer input de la nueva fila
        nextRowInputs[0].focus();
    } else {
        // Se acabaron los intentos
        Swal.fire({
            icon: "error",
            title: "¡Fin del juego!",
            text: `La palabra correcta era ${wordToGuess}`,
            confirmButtonColor: "#dc3545",
        });
    }
}

// Inicializar el juego
document.addEventListener("DOMContentLoaded", function() {
    createGameBoard();
    
    // Configurar el botón de comprobación
    const checkButton = document.getElementById("check-word");
    checkButton.addEventListener("click", checkWord);
});