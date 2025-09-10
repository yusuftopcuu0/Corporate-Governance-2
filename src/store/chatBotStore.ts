import { create } from "zustand";

interface BotMessage {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: Date;
}

interface ChatBotState {
  messages: BotMessage[];
  sendMessage: (text: string) => void;
}

export const useChatBotStore = create<ChatBotState>((set) => ({
  messages: [],
  sendMessage: (text: string) => {
    const userMsg: BotMessage = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date(),
    };

    const lowerText = text.toLowerCase();
    let botReply = "Destek ekibimiz size en kısa zamanda dönüş yapacaktır.";

    if (
      lowerText.includes("merhaba") ||
      lowerText.includes("selam") ||
      lowerText === "slm" ||
      lowerText === "selam" ||
      lowerText.includes("iyi günler") ||
      lowerText.includes("günaydın") ||
      lowerText.includes("iyi akşamlar")
    ) {
      botReply = "Merhaba! Size nasıl yardımcı olabilirim?";
    }

    if (
      lowerText.includes("şirket") ||
      lowerText.includes("firma") ||
      lowerText.includes("kuruluş")
    ) {
      botReply =
        "Şirketimiz Corporate Governance olarak bilinir. Kurumsal yönetim danışmanlığı hizmeti sunmaktayız.";
    }

    if (
      lowerText.includes("teşekkür") ||
      lowerText.includes("sağol") ||
      lowerText.includes("eyvallah") ||
      lowerText.includes("müteşekkir")
    ) {
      botReply =
        "Rica ederiz, size yardımcı olmaktan mutluluk duyarız. Başka bir konuda yardımcı olabilir miyim?";
    }

    if (
      lowerText.includes("görüş") ||
      lowerText.includes("hoşça kal") ||
      lowerText.includes("bay bay") ||
      lowerText.includes("güle güle")
    ) {
      botReply = "Görüşmek üzere! İyi günler dileriz.";
    }

    if (
      lowerText.includes("yardım") ||
      lowerText.includes("destek") ||
      lowerText.includes("bilgi") ||
      lowerText === "?" ||
      lowerText === "yardim"
    ) {
      botReply =
        "Şu konularda bilgi verebilirim: şirket bilgileri, hizmetlerimiz, iletişim bilgileri. Size nasıl yardımcı olabilirim?";
    }

    if (
      lowerText.includes("iletişim") ||
      lowerText.includes("telefon") ||
      lowerText.includes("mail") ||
      lowerText.includes("adres")
    ) {
      botReply =
        "İletişim bilgilerimiz: Telefon: 0538 252 51 38, E-posta: yusuf@gmail.com, Adres: İstanbul, Türkiye";
    }

    if (
      lowerText.includes("hizmet") ||
      lowerText.includes("servis") ||
      lowerText.includes("ne yapıyorsunuz") ||
      lowerText.includes("ne iş yapıyorsunuz")
    ) {
      botReply =
        "Kurumsal yönetişim, uyum yönetimi, risk yönetimi ve sürdürülebilirlik alanlarında danışmanlık hizmetleri sunmaktayız.";
    }

    if (
      lowerText.includes("çalışma saatleri") ||
      lowerText.includes("ne zaman açıksınız") ||
      lowerText.includes("mesai")
    ) {
      botReply =
        "Çalışma saatlerimiz: Hafta içi 09:00 - 18:00 arasındayız. Hafta sonları kapalıyız.";
    }

    const botMsg: BotMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: botReply,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg, botMsg],
    }));
  },
}));
