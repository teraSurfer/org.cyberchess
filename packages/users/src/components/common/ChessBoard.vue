<template>
  <div class="wood merida">
    <div ref="board" class="cg-board-wrap"></div>
  </div>
</template>
<script>
import Chess from 'chess.js'
import {Chessground} from 'chessground'
import {uniques} from './Util.js'
export default {
  name: 'chessboard',
  props: {
    fen: {
      type: String,
      default: ''
    },
    free: {
      type: Boolean,
      default: true
    },
    showThreats: {
      type: Boolean,
      default: false
    },
    onPromotion: {
      type: Function,
      default: () => 'q'
    },
    orientation: {
      type: String,
      default: 'white'
    },
    pgn: {
      type: String,
      default: ''
    }
  },
  watch: {
    fen: function (newFen) {
      this.fen = newFen
      this.loadPosition()
    },
    orientation: function (newOrientation) {
      this.orientation = newOrientation
      this.loadPosition()
    },
    showThreats: function (st) {
      this.showThreats = st
      if (this.showThreats) {
        this.paintThreats()
      }
    },
    pgn: function (pgn) {
      this.pgn = pgn
      this.loadPosition()
    }
  },
  methods: {
    possibleMoves () {
      const dests = {}
      this.game.SQUARES.forEach(s => {
        const ms = this.game.moves({square: s, verbose: true})
        if (ms.length) dests[s] = ms.map(m => m.to)
      })
      return dests
    },
    opponentMoves () {
      let originalPGN = this.game.pgn()
      let tokens = this.game.fen().split(' ')
      tokens[1] = tokens[1] === 'w' ? 'b' : 'w'
      tokens = tokens.join(' ')
      let valid = this.game.load(tokens)
      if (valid) {
        let moves = this.game.moves({verbose: true})
        this.game.load_pgn(originalPGN)
        return moves
      } else {
        return []
      }
    },
    toColor () {
      return (this.game.turn() === 'w') ? 'white' : 'black'
    },
    paintThreats () {
      let moves = this.game.moves({verbose: true})
      let threats = []
      moves.forEach(function (move) {
        threats.push({orig: move.to, brush: 'yellow'})
        if (move['captured']) {
          threats.push({orig: move.from, dest: move.to, brush: 'red'})
        }
        if (move['san'].includes('+')) {
          threats.push({orig: move.from, dest: move.to, brush: 'blue'})
        }
      })
      this.board.setShapes(threats)
    },
    calculatePromotions () {
      let moves = this.game.moves({verbose: true})
      this.promotions = []
      for (let move of moves) {
        if (move.promotion) {
          this.promotions.push(move)
        }
      }
    },
    isPromotion   (orig, dest) {
      let filteredPromotions = this.promotions.filter(move => move.from === orig && move.to === dest)
      return filteredPromotions.length > 0 // The current movement is a promotion
    },
    changeTurn () {
      return (orig, dest, metadata) => {
          console.log(metadata)
        if (this.isPromotion(orig, dest)) {
          this.promoteTo = this.onPromotion()
        }
        this.game.move({from: orig, to: dest, promotion: this.promoteTo}) // promote to queen for simplicity
        this.board.set({
          fen: this.game.fen(),
          turnColor: this.toColor(),
          movable: {
            color: this.toColor(),
            dests: this.possibleMoves()
          }
        })
        this.calculatePromotions()
        this.afterMove()
      }
    },
    afterMove () {
      if (this.showThreats) {
        this.paintThreats()
      }
      let threats = this.countThreats(this.toColor())
      threats['history'] = this.game.history()
      threats['fen'] = this.game.fen()
      this.$emit('onMove', threats)
    },
    countThreats (color) {
      let threats = {}
      let captures = 0
      let checks = 0
      let moves = this.game.moves({verbose: true})
      if (color !== this.toColor()) {
        moves = this.opponentMoves()
      }
      if (moves.length === 0) {
        return null // It´s an invalid position
      }
      moves.forEach(function (move) {
        if (move['captured']) {
          captures++
        }
        if (move['san'].includes('+')) {
          checks++
        }
      })
      threats[`legal_${color}`] = uniques(moves.map(x => x.from + x.to)).length // promotions count as 4 moves. This remove those duplicates moves.
      threats[`checks_${color}`] = checks
      threats[`threat_${color}`] = captures
      threats[`turn`] = color
      return threats
    },
    loadPosition () { // set a default value for the configuration object itself to allow call to loadPosition()
      this.game.load(this.fen)
      this.game.load_pgn(this.pgn, {sloppy: true})
      this.board = Chessground(this.$refs.board, {
        fen: this.game.fen(),
        orientation: this.orientation,
        turnColor: this.toColor(),
        movable: {
          color: this.toColor(),
          free: this.free,
          dests: this.possibleMoves()
        },
      })
      this.board.set({
        movable: { events: { after: this.changeTurn() } }
      })
      console.log(this.board, this.game.turn())
      this.afterMove()
    }
  },
  mounted () {
    this.loadPosition()
  },
  created () {
    this.game = new Chess()
    console.log(this.game)
    this.board = null
    this.promotions = []
    this.promoteTo = 'q'
  }
}
</script>

<style lang="scss">
/*
 * Chessground base css properties.
 *
 * You need to include the css files in themes folder in order to have the
 * board and pieces displayed!
 */

 .cg-board-wrap {
  width: 512px;
  height: 512px;
  position: relative;
  display: block;
}
.cg-board {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  line-height: 0;
  background-size: cover;
  cursor: pointer;
}
.cg-board square {
  position: absolute;
  top: 0;
  left: 0;
  width: 12.5%;
  height: 12.5%;
}
.cg-board square.move-dest {
  background: radial-gradient(rgba(20, 85, 30, 0.5) 22%, #208530 0, rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 0);
}
.cg-board square.premove-dest {
  background: radial-gradient(rgba(20, 30, 85, 0.5) 22%, #203085 0, rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0) 0);
}
.cg-board square.oc.move-dest {
  background: radial-gradient(transparent 0%, transparent 80%, rgba(20, 85, 0, 0.3) 80%);
}
.cg-board square.oc.premove-dest {
  background: radial-gradient(transparent 0%, transparent 80%, rgba(20, 30, 85, 0.2) 80%);
}
.cg-board .cg-square.move-dest.drag-over,
.cg-board .cg-square.premove-dest.drag-over {
  box-shadow: inset 0 0 10px 2px rgba(216, 85, 0, 0.9);
}
.cg-board square.last-move {
  will-change: transform;
  background-color: rgba(226, 241, 6, 0.41);
}
.cg-board square.selected {
  background-color: rgba(20, 85, 30, 0.5);
}
.cg-board square.check {
  background: radial-gradient(ellipse at center, rgba(255, 0, 0, 1) 0%, rgba(231, 0, 0, 1) 25%, rgba(169, 0, 0, 0) 89%, rgba(158, 0, 0, 0) 100%);
}
.cg-board square.current-premove {
  background-color: rgba(20, 30, 85, 0.5);
}
.cg-board-wrap piece {
  position: absolute;
  top: 0;
  left: 0;
  width: 12.5%;
  height: 12.5%;
  background-size: cover;
  z-index: 2;
  will-change: transform;
  pointer-events: none;
}
.cg-board piece.dragging {
  cursor: move;
  z-index: 9;
}
.cg-board piece.anim {
  z-index: 8;
}
.cg-board piece.fading {
  z-index: 1;
  opacity: 0.5;
}
.cg-board-wrap square.move-dest:hover {
  background-color: rgba(20, 85, 30, 0.3);
}
.cg-board-wrap piece.ghost {
  opacity: 0.3;
}
.cg-board-wrap svg {
  overflow: hidden;
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 2;
  opacity: 0.6;
}
.cg-board-wrap svg image {
  opacity: 0.5;
}
.cg-board-wrap coords {
  position: absolute;
  display: flex;
  pointer-events: none;
  opacity: 0.8;
  font-size: 9px;
}
.cg-board-wrap coords.ranks {
  right: -15px;
  top: 0;
  flex-flow: column-reverse;
  height: 100%;
  width: 12px;
}
.cg-board-wrap coords.ranks.black {
  flex-flow: column;
}
.cg-board-wrap coords.files {
  bottom: -16px;
  left: 0;
  flex-flow: row;
  width: 100%;
  height: 16px;
  text-transform: uppercase;
  text-align: center;
}
.cg-board-wrap coords.files.black {
  flex-flow: row-reverse;
}
.cg-board-wrap coords coord {
  flex: 1 1 auto;
}
.cg-board-wrap coords.ranks coord {
  transform: translateY(39%);
}
.wood .cg-board-wrap {
  background-image: url('/img/board/wood1.png');
  background-size: 512px 512px;
}

.merida .cg-board-wrap piece.pawn.white {
  background-image: url('/img/pieces/merida/wP.svg');
}
.merida .cg-board-wrap piece.bishop.white {
  background-image: url('/img/pieces/merida/wB.svg');
}
.merida .cg-board-wrap piece.knight.white {
  background-image: url('/img/pieces/merida/wN.svg');
}
.merida .cg-board-wrap piece.rook.white {
  background-image: url('/img/pieces/merida/wR.svg');
}
.merida .cg-board-wrap piece.queen.white {
  background-image: url('/img/pieces/merida/wQ.svg');
}
.merida .cg-board-wrap piece.king.white {
  background-image: url('/img/pieces/merida/wK.svg');
}
.merida .cg-board-wrap piece.pawn.black {
  background-image: url('/img/pieces/merida/bP.svg');
}
.merida .cg-board-wrap piece.bishop.black {
  background-image: url('/img/pieces/merida/bB.svg');
}
.merida .cg-board-wrap piece.knight.black {
  background-image: url('/img/pieces/merida/bN.svg');
}
.merida .cg-board-wrap piece.rook.black {
  background-image: url('/img/pieces/merida/bR.svg');
}
.merida .cg-board-wrap piece.queen.black {
  background-image: url('/img/pieces/merida/bQ.svg');
}
.merida .cg-board-wrap piece.king.black {
  background-image: url('/img/pieces/merida/bK.svg');
}
</style>