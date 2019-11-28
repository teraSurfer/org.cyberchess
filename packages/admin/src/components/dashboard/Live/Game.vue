<template>
    <chess-board :fen="'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'" />
</template>

<script>
import ChessBoard from '@/components/common/ChessBoard.vue';
export default {
    components: {
        ChessBoard
    }
}
</script>