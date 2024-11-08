const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const resetScoreBtn = document.getElementById('resetScore');
const timeLimitInput = document.getElementById('timeLimit');
const timerDisplay = document.getElementById('timeLeft');
const xScoreDisplay = document.getElementById('xScore');
const oScoreDisplay = document.getElementById('oScore');
const toggleThemeBtn = document.getElementById('toggleTheme');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let timer; // Para controlar o tempo
let timeLeft; // Tempo restante
let xScore = 0; // Placar do jogador X
let oScore = 0; // Placar do jogador O
let currentTheme = 'light'; // Tema inicial

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Função para carregar o tema armazenado
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.classList.toggle('dark', currentTheme === 'dark');
    }
}

// Função para iniciar o temporizador
function startTimer() {
    timeLeft = parseInt(timeLimitInput.value); // Pega o tempo definido
    timerDisplay.textContent = timeLeft; // Atualiza a exibição do timer
    clearInterval(timer); // Limpa qualquer timer existente

    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert(`O jogador ${currentPlayer} não jogou a tempo!`);
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X'; // Troca o jogador
            statusText.textContent = `Vez do jogador: ${currentPlayer}`;
            startTimer(); // Reinicia o temporizador
        }
    }, 1000);
}

// Função para atualizar a célula
function handleCellClick(e) {
    const cell = e.target;
    const index = cell.getAttribute('data-index');

    if (board[index] !== '' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    checkResult();
}

// Verifica se há vencedor ou empate
function checkResult() {
    let roundWon = false;

    for (let i = 0; i < winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            break;
        }
    }

    if (roundWon) {
        clearInterval(timer); // Para o timer ao terminar o jogo
        statusText.textContent = `Jogador ${currentPlayer} venceu!`;
        if (currentPlayer === 'X') {
            xScore++;
            xScoreDisplay.textContent = xScore;
        } else {
            oScore++;
            oScoreDisplay.textContent = oScore;
        }
        gameActive = false;
        return;
    }

    if (!board.includes('')) {
        clearInterval(timer); // Para o timer ao terminar o jogo
        statusText.textContent = 'Empate!';
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Vez do jogador: ${currentPlayer}`;
    startTimer(); // Reinicia o temporizador para o próximo jogador
}

// Função para reiniciar o jogo
function restartGame() {
    currentPlayer = 'X';
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    statusText.textContent = `Vez do jogador: ${currentPlayer}`;
    cells.forEach(cell => (cell.textContent = ''));
    clearInterval(timer); // Para o timer ao reiniciar
    timerDisplay.textContent = timeLimitInput.value; // Reseta o timer para o valor inicial
    startTimer(); // Inicia o temporizador
}

// Função para zerar o placar
function resetScore() {
    xScore = 0;
    oScore = 0;
    xScoreDisplay.textContent = xScore;
    oScoreDisplay.textContent = oScore;
}

// Função para alternar o tema
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.classList.toggle('dark', currentTheme === 'dark');
    localStorage.setItem('theme', currentTheme);
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
resetScoreBtn.addEventListener('click', resetScore);
toggleThemeBtn.addEventListener('click', toggleTheme);

loadTheme(); // Carrega o tema ao iniciar o jogo
startTimer(); // Inicia o temporizador ao carregar o jogo
