/* 이름 -> 이*
닉네임 -> 닉*임
홍길동 -> 홍*동
홍길길동 -> 홍**동
6+Nickname -> 6+******me
*/

/**
 * 닉네임을 모자이크 처리합니다.
 * @example nick('홍길동') // 홍*동
 * @example nick('홍길길동') // 홍**동
 * @example nick('6+Nickname') // 6+******me
 * @param nickname 닉네임
 * @returns 모자이크 처리된 닉네임
 */
export const mosaicNick = (nickname: string) => {
  if (nickname.length <= 1) return nickname
  if (nickname.length === 2) return nickname[0] + '*'
  if (nickname.length === 3) return nickname[0] + '*' + nickname[2]
  if (nickname.length === 4) return nickname[0] + '**' + nickname[3]
  if (nickname.length === 5) return nickname[0] + '***' + nickname[4]

  const head = nickname.slice(0, 2)
  const tail = nickname.slice(-2)
  return head + '*'.repeat(nickname.length - 4) + tail
}
