import React from 'react';

export const DailyLifeTimeline: React.FC = () => {
  const schedule = [
    {
      time: '08:00 AM',
      icon: 'wb_sunny',
      title: 'Meadow Romp & Sniffs',
      desc: 'Wake up to fresh air on our fenced green turf meadow. Handlers supervise stretching, exercise, and potty breaks.',
    },
    {
      time: '09:30 AM',
      icon: 'restaurant',
      title: 'Farm-to-Bowl Nutrition',
      desc: 'Gourmet meal prepared strictly according to your home instructions — fresh chicken broth, kibble, or raw diet.',
    },
    {
      time: '11:30 AM',
      icon: 'psychology',
      title: 'Cognitive Puzzles & Cuddles',
      desc: 'Mental enrichment games, snuffle mats, interactive treat toys, and 1-on-1 affection in our climate-controlled lounge.',
    },
    {
      time: '01:00 PM',
      icon: 'bedtime',
      title: 'Deep AC Rest & Calm',
      desc: 'Quiet siesta time on our clean climate-controlled boarding floor. Dimmed ambient lights, 22°C AC, and peaceful atmosphere.',
    },
    {
      time: '04:30 PM',
      icon: 'sports_tennis',
      title: 'Evening Agility & Play',
      desc: 'Second energetic play session! Supervised social ball-chasing with size-matched playmates on green turf.',
    },
    {
      time: '08:30 PM',
      icon: 'video_camera_front',
      title: 'Daily WhatsApp Video Journal',
      desc: 'Our signature touch. A personalized video reel and photo journal sent straight to your phone showing your happy pet.',
    },
  ];

  return (
    <section
      id="routine"
      className="min-h-screen lg:h-screen lg:max-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-6 bg-white relative overflow-hidden border-t border-black/5 text-left"
    >
      <div className="max-w-7xl mx-auto w-full space-y-4">
        
        {/* Compact Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-2 border-b border-black/5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-sanctuary-moss/10 text-sanctuary-moss text-[10px] font-black uppercase tracking-wider mb-1">
              <span className="material-symbols-outlined text-xs">schedule</span>
              <span>The Sanctuary Routine</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-sanctuary-dark">
              A Day in the Life at The Sanctuary
            </h2>
          </div>
          <p className="text-xs text-sanctuary-dark/70 font-medium max-w-sm">
            Balancing outdoor exercise, wholesome nutrition, cognitive agility, and restorative private AC rest.
          </p>
        </div>

        {/* 6-Card Grid that fits in 1 screen */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-sanctuary-sand/40 border border-black/5 space-y-2 hover:bg-sanctuary-sand transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="size-9 rounded-xl bg-sanctuary-moss/10 text-sanctuary-moss flex items-center justify-center group-hover:scale-105 transition-transform">
                  <span className="material-symbols-outlined text-lg">{item.icon}</span>
                </div>
                <span className="text-[11px] font-mono font-black text-sanctuary-gold bg-sanctuary-gold/15 px-2 py-0.5 rounded-full">
                  {item.time}
                </span>
              </div>
              <h3 className="text-sm font-black text-sanctuary-dark">{item.title}</h3>
              <p className="text-xs text-sanctuary-dark/70 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Video Promise Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-sanctuary-forest text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-xl">videocam</span>
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-black text-white">Twice-Daily WhatsApp Video Updates</h4>
              <p className="text-[11px] text-white/70">Watch your companion playing on the meadow and eating breakfast in real time.</p>
            </div>
          </div>

          <button
            onClick={() => {
              window.dispatchEvent(new CustomEvent('snip_open_booking'));
            }}
            className="py-2.5 px-5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm shrink-0 flex items-center gap-1.5"
          >
            <span>Book Boarding Stay</span>
            <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
          </button>
        </div>

      </div>
    </section>
  );
};

export default DailyLifeTimeline;
