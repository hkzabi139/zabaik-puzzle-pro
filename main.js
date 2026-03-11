const imageUpload = document.getElementById('imageUpload');
const gridSizeSelect = document.getElementById('gridSize');
const startBtn = document.getElementById('startBtn');
const board = document.getElementById('puzzle-board');
const refImage = document.getElementById('refImage');
const placeholder = document.getElementById('placeholderText');
const message = document.getElementById('message');

let pieces = [];
let imgUrl = "";
let dragSrcEl = null;

imageUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        if (imgUrl) URL.revokeObjectURL(imgUrl);
        imgUrl = URL.createObjectURL(file);
        refImage.src = imgUrl;
        refImage.classList.add('active');
        placeholder.style.display = "none";
        startBtn.disabled = false;
        message.innerText = "Image Loaded. Click Start!";
    }
});

function createPuzzle() {
    const size = parseInt(gridSizeSelect.value);
    const boardWidth = board.offsetWidth;
    board.innerHTML = "";
    board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    pieces = [];

    for (let i = 0; i < size * size; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.setAttribute('draggable', 'true');
        piece.style.backgroundImage = `url(${imgUrl})`;
        piece.style.backgroundSize = `${boardWidth}px ${boardWidth}px`;

        const row = Math.floor(i / size);
        const col = i % size;
        const xPos = (col * (boardWidth / size));
        const yPos = (row * (boardWidth / size));

        piece.style.backgroundPosition = `-${xPos}px -${yPos}px`;
        piece.setAttribute('data-correct-index', i);

        addEvents(piece);
        pieces.push(piece);
    }
    shufflePieces();
}

function shufflePieces() {
    pieces.sort(() => Math.random() - 0.5);
    renderBoard();
}

function renderBoard() {
    board.innerHTML = "";
    pieces.forEach(p => board.appendChild(p));
}

function addEvents(item) {
    item.addEventListener('dragstart', e => { dragSrcEl = item; item.classList.add('dragging'); });
    item.addEventListener('dragover', e => e.preventDefault());
    item.addEventListener('drop', handleDrop);
    item.addEventListener('dragend', () => item.classList.remove('dragging'));

    item.addEventListener('touchstart', handleTouchStart, { passive: false });
    item.addEventListener('touchend', handleTouchEnd);
}

function handleDrop(e) {
    if (dragSrcEl !== this) {
        let tempIndex = this.getAttribute('data-correct-index');
        let tempBg = this.style.backgroundPosition;

        this.setAttribute('data-correct-index', dragSrcEl.getAttribute('data-correct-index'));
        this.style.backgroundPosition = dragSrcEl.style.backgroundPosition;

        dragSrcEl.setAttribute('data-correct-index', tempIndex);
        dragSrcEl.style.backgroundPosition = tempBg;

        checkWin();
    }
}

function handleTouchStart(e) { touchSrcEl = this; }
function handleTouchEnd(e) {
    let touch = e.changedTouches[0];
    let target = document.elementFromPoint(touch.clientX, touch.clientY);
    if (target && target.classList.contains('puzzle-piece') && target !== touchSrcEl) {
        let tempIndex = target.getAttribute('data-correct-index');
        let tempBg = target.style.backgroundPosition;
        target.setAttribute('data-correct-index', touchSrcEl.getAttribute('data-correct-index'));
        target.style.backgroundPosition = touchSrcEl.style.backgroundPosition;
        touchSrcEl.setAttribute('data-correct-index', tempIndex);
        touchSrcEl.style.backgroundPosition = tempBg;
        checkWin();
    }
}

function checkWin() {
    const currentPieces = Array.from(board.children);
    const win = currentPieces.every((p, i) => parseInt(p.getAttribute('data-correct-index')) === i);

    if (win) {
 
        message.innerText = "";

        Swal.fire({
            title: '🎉 Mubarak Ho, Zabihullah!',
            text: 'Aapne puzzle solve kar liya! Aap waqayi ek "Super League" Developer hain. 🔥',
            icon: 'success',
            background: '#16213e', 
            color: '#ffffff',
            confirmButtonColor: '#00e1ff', 
            confirmButtonText: 'Shukriya!',
            backdrop: `rgba(0,0,0,0.7)` 
        });

        board.style.pointerEvents = "none";
    }
}

startBtn.onclick = createPuzzle;
document.getElementById('restartBtn').onclick = createPuzzle;