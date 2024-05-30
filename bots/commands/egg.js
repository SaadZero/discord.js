const { SlashCommandBuilder } = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("egg")
    .setDescription("Throw egg on someone!")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to throw egg at")
        .setRequired(true)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('user'); // || interaction.user;
    interaction.reply(`${interaction.user.displayName} throws an egg at ${user}!`)
  },
};
