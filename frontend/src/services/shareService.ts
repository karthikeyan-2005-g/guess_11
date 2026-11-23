import { Share } from '@capacitor/share';

export interface ShareOptions {
  roomCode: string;
  roomUrl: string;
}

export const shareService = {
  getMessage(roomCode: string, roomUrl: string): string {
    return `JOIN MY GUESS THE ELEVEN GAME!\n\nRoom Code: ${roomCode}\n\nJoin here:\n${roomUrl}\n\nLet's play and see who gets 11 points!`;
  },

  async copyToClipboard(text: string): Promise<boolean> {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    } catch (e) {
      return false;
    }
  },

  async shareNative(options: ShareOptions): Promise<boolean> {
    const text = this.getMessage(options.roomCode, options.roomUrl);
    try {
      // Capacitor Share
      const canShare = await Share.canShare().catch(() => ({ value: false }));
      if (canShare.value) {
        await Share.share({
          title: 'Guess The Eleven Game Invite',
          text,
          url: options.roomUrl,
          dialogTitle: 'Invite friends to Guess The Eleven',
        });
        return true;
      }

      // Web Share API fallback
      if (navigator.share) {
        await navigator.share({
          title: 'Guess The Eleven Game Invite',
          text,
          url: options.roomUrl,
        });
        return true;
      }

      // Clipboard fallback
      return await this.copyToClipboard(text);
    } catch (err) {
      return false;
    }
  },

  shareWhatsApp(options: ShareOptions): void {
    const text = encodeURIComponent(this.getMessage(options.roomCode, options.roomUrl));
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  },

  shareTelegram(options: ShareOptions): void {
    const text = encodeURIComponent(this.getMessage(options.roomCode, options.roomUrl));
    window.open(`https://t.me/share/url?url=${encodeURIComponent(options.roomUrl)}&text=${text}`, '_blank');
  },

  shareSMS(options: ShareOptions): void {
    const text = encodeURIComponent(this.getMessage(options.roomCode, options.roomUrl));
    window.open(`sms:?body=${text}`, '_blank');
  },
};
