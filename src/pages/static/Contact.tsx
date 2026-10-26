import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Mail, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

export const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Editorial Question');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useApp();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (data.success) {
        setIsSent(true);
        showToast('Your message has been sent to our editorial desk!', 'success');
      }
    } catch {
      showToast('Could not send message. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-left">
      <div className="space-y-3">
        <span className="text-xs font-bold text-[#2D7D46] uppercase tracking-wider">Get in Touch</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1C2B20]">
          Contact Editorial & Support
        </h1>
        <p className="text-sm text-[#5A7060]">
          Have a recipe suggestion, editorial inquiry, or question about our nutritional evidence? We would love to hear from you.
        </p>
      </div>

      {isSent ? (
        <div className="bg-[#E8F5EC] border border-[#2D7D46] rounded-3xl p-8 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-[#2D7D46] mx-auto" />
          <h3 className="font-serif text-2xl font-bold text-[#1C2B20]">Message Received!</h3>
          <p className="text-sm text-[#5A7060] max-w-md mx-auto">
            Thank you for reaching out to HealthWise USA. Our editorial team reviews every message and will respond within 1–2 business days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-[#D4E6D9] rounded-3xl p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Sarah Johnson"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="sarah@example.com"
                className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20]"
            >
              <option value="Editorial Question">Editorial / Recipe Correction</option>
              <option value="AI Tool Feedback">AI Tool Feedback / Idea</option>
              <option value="Media Inquiry">Media / Press Inquiry</option>
              <option value="General Support">General Support</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-[#1C2B20]">Your Message</label>
            <textarea
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="How can we assist your health journey?..."
              className="w-full px-4 py-2.5 text-sm bg-white border border-[#D4E6D9] rounded-xl text-[#1C2B20] focus:ring-2 focus:ring-[#2D7D46]"
            />
          </div>

          <div className="pt-2">
            <Button variant="primary" size="lg" type="submit" disabled={isSubmitting} icon={<Send className="w-4 h-4" />}>
              {isSubmitting ? 'Sending Message...' : 'Send Message'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
