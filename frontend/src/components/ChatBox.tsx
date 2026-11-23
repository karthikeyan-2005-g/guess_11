import React, { useRef, useEffect } from 'react';
import { ChatMessage } from '../types/game';
import { MessageSquare, Sparkles } from 'lucide-react';

interface ChatBoxProps {
  messages: ChatMessage[];
  currentUserId?: string;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ messages, currentUserId }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-slate-800">
      <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
          <MessageSquare className="w-4 h-4 text-cyan-400" />
          <span>Live Chat & Guesses</span>
        </div>
        <span className="text-[10px] text-slate-500">{messages.length} messages</span>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-2 min-h-[160px] max-h-[300px]">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 text-xs text-center italic py-8">
            No guesses yet! Type your guess below!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUserId;

            if (msg.type === 'correct') {
              return (
                <div
                  key={msg.id}
                  className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 p-2 rounded-xl text-xs flex items-center justify-between font-semibold animate-pop-in"
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>
                      <strong className="text-white">{msg.senderName}</strong> {msg.text}
                    </span>
                  </div>
                  {msg.pointsEarned && (
                    <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                      +{msg.pointsEarned} PTS
                    </span>
                  )}
                </div>
              );
            }

            if (msg.type === 'close') {
              return (
                <div
                  key={msg.id}
                  className="bg-amber-950/40 border border-amber-500/40 text-amber-300 p-2 rounded-xl text-xs font-semibold animate-pulse-fast"
                >
                  🔥 {msg.text}
                </div>
              );
            }

            if (msg.type === 'join' || msg.type === 'leave') {
              return (
                <div key={msg.id} className="text-center text-[10px] font-medium text-slate-500 my-1">
                  — {msg.text} —
                </div>
              );
            }

            // Normal guess / chat message
            return (
              <div
                key={msg.id}
                className={`flex flex-col text-xs rounded-xl p-2 ${
                  isMe
                    ? 'bg-purple-950/40 border border-purple-500/30 ml-4'
                    : 'bg-slate-900/40 border border-slate-800 mr-4'
                }`}
              >
                <span className="font-bold text-slate-400 text-[10px]">
                  {isMe ? 'You' : msg.senderName}
                </span>
                <span className="text-slate-100 font-medium break-words mt-0.5">{msg.text}</span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
