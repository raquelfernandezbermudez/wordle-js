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

// Mostrar notificación personalizada
function showNotification(type, message) {
    // Eliminar notificaciones anteriores
    const oldNotification = document.querySelector('.custom-notification');
    if (oldNotification) {
        oldNotification.remove();
    }
    
    // Crear nueva notificación
    const notification = document.createElement('div');
    notification.className = `custom-notification ${type}`;
    notification.textContent = message;
    
    // Añadir botón de cierre
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.onclick = function() {
        notification.remove();
    };
    notification.appendChild(closeBtn);
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Auto-cerrar después de 5 segundos (opcional)
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.remove();
        }
    }, 5000);
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
        showNotification('warning', '¡Debes ingresar 5 letras!');
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
        showNotification('success', '¡Felicidades! Has adivinado la palabra 🎉');
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
        showNotification('error', `¡Fin del juego! La palabra correcta era ${wordToGuess}`);
    }
}

// Inicializar el juego
document.addEventListener("DOMContentLoaded", function() {
    createGameBoard();

    // Configurar la comprobación al presionar "Enter"
    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            checkWord();
        }
    });
});

    // Botón de nuevo juego
    const newGame = document.getElementById("new-game");
    
    newGame.addEventListener("click", function() {
        currentAttempt = 0;
        createGameBoard();
    }
    );