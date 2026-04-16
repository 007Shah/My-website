import React from 'react';
import { Phone } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const phoneNumber = '03347801011';
  const message = 'I would like to inquire about a premium booking at Aurelian Slate.';
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 magnetic"
      title="Direct-to-Chef"
    >
      <Phone size={24} />
    </a>
  );
};

export default WhatsAppButton;
