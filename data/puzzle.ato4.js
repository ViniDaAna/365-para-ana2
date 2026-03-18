window.ATO4_PUZZLE = {
  key: "projeto365_puzzle_ato4",
  image: "assets/fotos/ato4.jpg",
  gridSize: 4,

  dias: [151, 156, 162, 168, 173, 179, 185, 191, 196, 202, 208, 214, 220, 226, 233, 240],

  titulo: "Uma parte de nós.",
  hintAntes: "toque para revelar",
  hintDepois: "mais uma peça guardada da nossa história.",
  fraseFinal: "Peça por peça, fomos construindo algo que hoje eu chamo de nós.",

  /**
   * Ordem das 16 peças no grid 4x4.
   * row e col são zero-based.
   * index = posição da peça dentro do grid final.
   */
  pecas: [
    { index: 0,  row: 0, col: 0 },
    { index: 1,  row: 0, col: 1 },
    { index: 2,  row: 0, col: 2 },
    { index: 3,  row: 0, col: 3 },

    { index: 4,  row: 1, col: 0 },
    { index: 5,  row: 1, col: 1 },
    { index: 6,  row: 1, col: 2 },
    { index: 7,  row: 1, col: 3 },

    { index: 8,  row: 2, col: 0 },
    { index: 9,  row: 2, col: 1 },
    { index: 10, row: 2, col: 2 },
    { index: 11, row: 2, col: 3 },

    { index: 12, row: 3, col: 0 },
    { index: 13, row: 3, col: 1 },
    { index: 14, row: 3, col: 2 },
    { index: 15, row: 3, col: 3 }
  ]
};

function getAto4PuzzleConfig() {
  return window.ATO4_PUZZLE;
}

function isAto4PuzzleDay(dia) {
  const cfg = getAto4PuzzleConfig();
  return cfg.dias.includes(Number(dia));
}

function getAto4PuzzlePieceIndexByDay(dia) {
  const cfg = getAto4PuzzleConfig();
  return cfg.dias.indexOf(Number(dia));
}

function getAto4PuzzleState() {
  const cfg = getAto4PuzzleConfig();

  try {
    const raw = localStorage.getItem(cfg.key);
    if (!raw) return new Array(cfg.pecas.length).fill(0);

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Array(cfg.pecas.length).fill(0);

    const safe = new Array(cfg.pecas.length).fill(0);
    for (let i = 0; i < cfg.pecas.length; i++) {
      safe[i] = parsed[i] ? 1 : 0;
    }
    return safe;
  } catch (err) {
    return new Array(cfg.pecas.length).fill(0);
  }
}

function setAto4PuzzleState(state) {
  const cfg = getAto4PuzzleConfig();
  const safe = new Array(cfg.pecas.length).fill(0);

  for (let i = 0; i < cfg.pecas.length; i++) {
    safe[i] = state && state[i] ? 1 : 0;
  }

  localStorage.setItem(cfg.key, JSON.stringify(safe));
  return safe;
}

function revealAto4PuzzlePiece(pieceIndex) {
  const cfg = getAto4PuzzleConfig();
  if (pieceIndex < 0 || pieceIndex >= cfg.pecas.length) return getAto4PuzzleState();

  const state = getAto4PuzzleState();
  state[pieceIndex] = 1;
  return setAto4PuzzleState(state);
}

function isAto4PuzzleComplete() {
  const state = getAto4PuzzleState();
  return state.every(Boolean);
}

function countAto4PuzzleRevealed() {
  const state = getAto4PuzzleState();
  return state.filter(Boolean).length;
}
