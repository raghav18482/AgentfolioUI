import { describe, expect, it } from 'vitest'
import { buildFeedbackBody, parseWhatsappReply } from './feedback'

const input = { name: 'Asha', phone: '+91 00000 00000', feedback: 'Love it', website: '' }

describe('parseWhatsappReply', () => {
  it('is on only for an explicit true', () => {
    expect(parseWhatsappReply({ token: 't', whatsapp_reply: true })).toBe(true)
    for (const data of [{ token: 't', whatsapp_reply: false }, { token: 't' }, undefined]) {
      expect(parseWhatsappReply(data)).toBe(false)
    }
    // A server that sends something odd is treated as off, never on.
    expect(parseWhatsappReply({ token: 't', whatsapp_reply: 'yes' as unknown as boolean })).toBe(false)
  })
})

describe('buildFeedbackBody', () => {
  it('never sends a phone number or name when replies are off', () => {
    const body = buildFeedbackBody(input, false, 'tok')
    expect(body).toEqual({ feedback: 'Love it', website: '', channel: 'react', token: 'tok' })
    expect(JSON.stringify(body)).not.toContain('00000')
  })

  it('sends them in reply mode', () => {
    expect(buildFeedbackBody(input, true, 'tok')).toMatchObject({
      phone: '+91 00000 00000',
      name: 'Asha',
      channel: 'react',
    })
  })
})
