const { SlashCommandBuilder } = require('discord.js');
const { TicTacToe, ConnectFour, RockPaperScissors } = require('discord-gamecord');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Play a mini game in the server')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Choose a game to play')
                .setRequired(true)
                .addChoices(
                    { name: 'Tic Tac Toe', value: 'tictactoe' },
                    { name: 'Connect Four', value: 'connectfour' },
                    { name: 'Rock Paper Scissors', value: 'rps' }
                )),
    async execute(interaction) {
        const gameType = interaction.options.getString('type');
        const opponent = interaction.user;

        if (gameType === 'tictactoe') {
            const Game = new TicTacToe({
                message: interaction,
                isSlashGame: true,
                opponent: opponent,
                embed: {
                    title: 'Tic Tac Toe',
                    color: '#5865F2',
                },
                emojis: {
                    x: '❌',
                    o: '⭕',
                    blank: '◼️',
                },
                mentionUser: true,
                timeoutTime: 60000,
                xButtonStyle: 'PRIMARY',
                oButtonStyle: 'SUCCESS',
            });
            Game.startGame();
        } 
        else if (gameType === 'connectfour') {
            const Game = new ConnectFour({
                message: interaction,
                isSlashGame: true,
                opponent: opponent,
                embed: {
                    title: 'Connect Four',
                    color: '#5865F2',
                },
                emojis: {
                    board: '⚪',
                    player1: '🔴',
                    player2: '🟡',
                },
                mentionUser: true,
                timeoutTime: 60000,
            });
            Game.startGame();
        }
        else if (gameType === 'rps') {
            const Game = new RockPaperScissors({
                message: interaction,
                isSlashGame: true,
                opponent: opponent,
                embed: {
                    title: 'Rock Paper Scissors',
                    color: '#5865F2',
                },
                buttons: {
                    rock: 'Rock',
                    paper: 'Paper',
                    scissors: 'Scissors',
                },
                mentionUser: true,
                timeoutTime: 60000,
            });
            Game.startGame();
        }
    },
};