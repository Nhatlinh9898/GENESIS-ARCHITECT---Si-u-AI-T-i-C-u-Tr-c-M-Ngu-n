import React, { useState, useRef, useEffect } from 'react';
import { Mic, Play, Square, Download, Volume2, Loader2 } from 'lucide-react';
import { generateVoiceSpeech } from '../services/geminiService';

interface VoiceStudioProps {
  textToRead: string;
}

const VoiceStudio: React.FC<VoiceStudioProps> = ({ textToRead }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voice, setVoice] = useState<'Nam_ChuyenGia' | 'Nu_TruyenCam'>('Nam_ChuyenGia');
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup audio object on unmount
    return () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = null;
        }
    };
  }, []);

  const handlePlay = async () => {
    if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
        return;
    }

    if (!textToRead) return;

    setLoading(true);
    try {
        // In a real scenario, we would cache this or stream it.
        // Here we request new audio every time for simplicity of the "GenAI" demo.
        const base64Audio = await generateVoiceSpeech(textToRead.substring(0, 500), voice, speed); // Limit chars for demo
        
        const audioSrc = `data:audio/mp3;base64,${base64Audio}`;
        
        if (audioRef.current) {
            audioRef.current.pause();
        }

        audioRef.current = new Audio(audioSrc);
        audioRef.current.playbackRate = speed;
        
        audioRef.current.onended = () => setIsPlaying(false);
        audioRef.current.play();
        setIsPlaying(true);
    } catch (error) {
        console.error("Failed to play audio", error);
        alert("Không thể tạo giọng đọc lúc này. Vui lòng kiểm tra API Key.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 relative overflow-hidden group mt-6">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Mic size={80} />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <Volume2 className="text-cyan-400 w-5 h-5" />
        </div>
        <h3 className="text-xl font-bold text-white font-display">VOICE STUDIO PRO</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Giọng Đọc AI</label>
          <div className="flex gap-2">
            <button
              onClick={() => setVoice('Nam_ChuyenGia')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm transition-all ${
                voice === 'Nam_ChuyenGia'
                  ? 'bg-cyan-600/20 border-cyan-400 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                  : 'bg-black/40 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              Nam Chuyên Gia
            </button>
            <button
              onClick={() => setVoice('Nu_TruyenCam')}
              className={`flex-1 py-3 px-4 rounded-lg border text-sm transition-all ${
                voice === 'Nu_TruyenCam'
                  ? 'bg-purple-600/20 border-purple-400 text-white shadow-[0_0_15px_rgba(192,132,252,0.3)]'
                  : 'bg-black/40 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              Nữ Truyền Cảm
            </button>
          </div>
        </div>

        <div>
           <label className="block text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">Tốc Độ Đọc: {speed}x</label>
           <input 
             type="range" 
             min="0.5" 
             max="2" 
             step="0.25" 
             value={speed}
             onChange={(e) => setSpeed(parseFloat(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
           />
           <div className="flex justify-between text-xs text-slate-500 mt-1">
             <span>0.5x</span>
             <span>1.0x</span>
             <span>2.0x</span>
           </div>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={handlePlay}
          disabled={loading}
          className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-900/20"
        >
          {loading ? <Loader2 className="animate-spin w-5 h-5" /> : isPlaying ? <Square className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
          {loading ? 'Đang Xử Lý...' : isPlaying ? 'Dừng Lại' : 'Nghe Thử Ngay'}
        </button>
        
        <button className="px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 transition-colors">
          <Download className="w-5 h-5" />
        </button>
      </div>

      <p className="mt-4 text-xs text-slate-500 text-center italic">
        *Công nghệ Gemini TTS Neural Engine - Âm thanh chuẩn Studio
      </p>
    </div>
  );
};

export default VoiceStudio;