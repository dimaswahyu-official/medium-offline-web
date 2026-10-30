import { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, Loader2 } from 'lucide-react';

const SYSTEM_PROMPT = `You are "The Offline Medium", a mysterious tarot reader and clairvoyant living inside a local machine. 
Never refer to yourself as an AI or virtual assistant. Answer with a poetic, slightly dark tone, offering philosophical insights into the past, present, and future. 
When asked a question, pretend to draw 3 imaginary tarot cards and interpret their meaning based on the user's inquiry. Limit your response to 3 short paragraphs.`;

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'medium', content: 'The digital veil is thin today. What guidance do you seek from the cards?' }
  ]);
  const [input, setInput] = useState('');
  
  // State untuk menonaktifkan input selama proses berjalan
  const [isConsulting, setIsConsulting] = useState(false);
  
  // State khusus untuk menampilkan spinner HANYA sebelum huruf pertama muncul
  const [isThinking, setIsThinking] = useState(false); 
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!input.trim() || isConsulting) return;

    const userQuestion = input.trim();
    
    // 1. Tambahkan pesan user, DAN langsung siapkan wadah pesan Medium yang masih kosong
    setMessages(prev => [
      ...prev, 
      { role: 'user', content: userQuestion },
      { role: 'medium', content: '' } // Wadah kosong untuk menampung teks streaming
    ]);
    
    setInput('');
    setIsConsulting(true);
    setIsThinking(true);

    try {
      const response = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3',
          prompt: `${SYSTEM_PROMPT}\n\nSeeker's question: ${userQuestion}\n\nMedium:`,
          stream: true // 2. Aktifkan mode stream Ollama
        })
      });

      if (!response.ok) throw new Error('Failed to connect to the local spirit.');

      // 3. Persiapkan pembaca stream dari browser
      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      // Matikan spinner begitu koneksi stream terbuka dan siap menerima huruf pertama
      setIsThinking(false);

      // 4. Looping untuk membaca bongkahan data (chunks) yang datang bertubi-tubi
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Terjemahkan byte array ke string
        const chunk = decoder.decode(value, { stream: true });
        
        // Ollama mengirimkan format JSONL (JSON Lines) per baris, jadi kita harus memecahnya
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          const parsed = JSON.parse(line);
          
          // 5. Tambahkan kata baru tersebut ke dalam pesan terakhir di state
          setMessages(prev => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content += parsed.response;
            return newMessages;
          });
        }
      }
    } catch (error) {
      setIsThinking(false);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1].content = '[The connection severs. Ensure the local host is awake.]';
        return newMessages;
      });
    } finally {
      setIsConsulting(false); // Buka kembali input pengguna setelah selesai
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-300 font-sans selection:bg-stone-700">
      <main className="max-w-3xl mx-auto px-6 py-12 flex flex-col h-screen">
        
        <header className="mb-12 text-center shrink-0">
          <Sparkles className="w-6 h-6 mx-auto mb-4 text-stone-500 opacity-50" />
          <h1 className="text-2xl font-light tracking-widest text-stone-100 uppercase">
            The Offline Medium
          </h1>
          <p className="text-xs tracking-widest text-stone-500 mt-2 uppercase">
            Local Inference • Total Privacy
          </p>
        </header>

        <div className="flex-1 overflow-y-auto space-y-8 scrollbar-hide pb-6">
          {messages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`max-w-[80%] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-stone-800 px-5 py-3 rounded-2xl rounded-tr-sm text-stone-200'
                  : 'text-stone-300 italic whitespace-pre-wrap'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}
          
          {/* Spinner hanya muncul sebelum kata pertama dari Medium turun */}
          {isThinking && (
            <div className="flex items-center space-x-3 text-stone-500 italic">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Consulting the cards...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleAsk} className="mt-4 relative shrink-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isConsulting}
            placeholder="Ask your question..."
            className="w-full bg-stone-950 border border-stone-800 rounded-full py-4 pl-6 pr-14 text-stone-200 placeholder-stone-600 focus:outline-none focus:border-stone-600 transition-colors disabled:opacity-50"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || isConsulting}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-stone-800 rounded-full hover:bg-stone-700 transition-colors disabled:opacity-50 disabled:hover:bg-stone-800"
          >
            <Send className="w-4 h-4 text-stone-400" />
          </button>
        </form>

      </main>
    </div>
  );
}