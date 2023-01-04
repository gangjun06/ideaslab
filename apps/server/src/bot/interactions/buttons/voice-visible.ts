import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  Client,
  Collection,
  GuildMember,
  ModalBuilder,
  PermissionOverwrites,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js'

import { Button } from '~/bot/base/interaction'
import config from '~/config'
import { voiceChannelVisibleState } from '~/service/voice-channel'
import { Embed } from '~/utils/embed'

export const visibleSettingMessageContent = (
  client: Client,
  isPrivate: boolean,
  members: GuildMember[],
) => {
  let memberList = members.map((item) => item.displayName).join(', ')
  if (memberList.length < 1) {
    memberList = '추가된 맴버 목록이 존재하지 않습니다.'
  }

  const embed = new Embed(client, 'info')
    .setTitle('음성채팅방 공개설정')
    .setDescription(
      `채널을 사람들에게 보이게 할 건지, 감출지 설정할 수 있어요.
      프로젝트 회의 / 중요한 대화 등을 할 때 유용해요.
      단, 지나치게 친목하는 경우 제제 받을 수 있습니다.`,
    )
    .setFields(
      { name: '현재 설정', value: isPrivate ? '비공개' : '공개' },
      { name: '접근가능 맴버', value: memberList },
    )

  const setButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setLabel(isPrivate ? '공개로 변경' : '비공개로 변경')
    .setCustomId('voice-visible-setting')

  const addButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel('맴버 추가하기')
    .setCustomId('voice-visible-add')

  const removeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Primary)
    .setLabel('맴버 추가하기')
    .setCustomId('voice-visible-remove')

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    setButton,
    addButton,
    removeButton,
  )
  return { embed, row }
}

export default new Button(['voice-visible'], async (client, interaction) => {
  if (!interaction.channel || interaction.channel.type !== ChannelType.GuildVoice) return

  const { isPrivate, members } = await voiceChannelVisibleState(interaction.channel)

  const { embed, row } = visibleSettingMessageContent(client, isPrivate, members)

  await interaction.reply({ embeds: [embed], ephemeral: true, components: [row] })
})
