"use client";
import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent } from 'react';
import { Star, Quote, Building2, ArrowRight } from 'lucide-react';

export function InteractiveProofSection() {
  // eslint-disable-next-line
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const testimonials = [
    {
      company: 'A 반도체 부품',
      name: '김**',
      role: '품질보증팀 팀장',
      quote: '종이로 관리하던 수많은 검사 성적서가 100% 디지털화되었습니다. 이전에는 부적합 발생 시 원인 추적에 며칠이 걸렸지만, 이제는 10분이면 충분합니다.',
      stats: '부적합 추적 시간 90% 단축'
    },
    {
      company: 'T 정밀 가공',
      name: '이**',
      role: '공장장',
      quote: 'COPQ(품질비용)를 실시간으로 확인할 수 있게 된 것이 가장 큰 변화입니다. 보이지 않던 비용이 시각화되니, 현장의 개선 활동이 자발적으로 일어나기 시작했습니다.',
      stats: 'COPQ 35% 감소'
    },
    {
      company: 'K 자동차 부품',
      name: '박**',
      role: '대표이사',
      quote: '대기업 고객사의 까다로운 품질 감사(Audit) 대비가 매우 수월해졌습니다. 시스템에 모든 이력이 투명하게 기록되어 있어 고객사의 신뢰도가 크게 상승했습니다.',
      stats: '고객사 클레임 60% 감소'
    },
    {
      company: 'S 스마트 팩토리',
      name: '정**',
      role: '생산기술팀',
      quote: '이전에는 품질 이슈를 이메일과 메신저로 주고받아 누락이 잦았습니다. PRO ALI SMART 도입 후에는 모든 부서가 같은 데이터를 보고 소통하여 오류가 사라졌습니다.',
      stats: '업무 소통 오류 제로화'
    }
  ];

  // Auto-scroll logic
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const animateScroll = (time: number) => {
      if (!isDragging && scrollRef.current) {
        const delta = time - lastTime;
        // Scroll 1 pixel every ~16ms (approx 60fps)
        if (delta > 16) {
          scrollRef.current.scrollLeft += 1;

          // Reset scroll to 0 if we reached the end
          if (
            scrollRef.current.scrollLeft >=
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 1
          ) {
            scrollRef.current.scrollLeft = 0;
          }
          lastTime = time;
        }
      } else {
        lastTime = time;
      }
      animationFrameId = requestAnimationFrame(animateScroll);
    };

    animationFrameId = requestAnimationFrame(animateScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, [isDragging]);

  const handleMouseDown = (e: ReactMouseEvent) => {
    setIsDragging(true);
    if (scrollRef.current) {
      setStartX(e.pageX - scrollRef.current.offsetLeft);
      setScrollLeft(scrollRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: ReactMouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollRef.current) {
      const x = e.pageX - scrollRef.current.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      scrollRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -skew-x-12 translate-x-32" />

      <div className="relative max-w-7xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-blue-100 text-blue-600 text-sm font-semibold mb-4 shadow-sm">
              <Star className="w-4 h-4 fill-blue-600" />
              고객 성공 사례
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              이미 많은 기업이<br />
              품질 혁신을 경험하고 있습니다
            </h2>
          </div>
          <div className="text-slate-500 font-medium hidden md:flex items-center">
            마우스로 드래그하여 더 보기
            <ArrowRight className="inline-block w-5 h-5 ml-2 animate-bounce-x" />
          </div>
        </div>
      </div>

      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className={`relative max-w-7xl mx-auto px-6 flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-12 cursor-${isDragging ? 'grabbing' : 'grab'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {testimonials.map((testi, idx) => (
          <div
            key={idx}
            className="snap-center shrink-0 w-[85vw] sm:w-[400px] md:w-[450px] bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50 select-none transition-transform duration-300 hover:-translate-y-2"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{testi.company}</h4>
                <p className="text-sm text-slate-500">{testi.role} • {testi.name}</p>
              </div>
            </div>

            <div className="relative mb-8">
              <Quote className="absolute -top-2 -left-2 w-8 h-8 text-blue-100 rotate-180" />
              <p className="relative z-10 text-slate-700 leading-relaxed pl-6 text-lg">
                &quot;{testi.quote}&quot;
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 text-cyan-700 font-semibold text-sm">
                <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                {testi.stats}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Global CSS to hide scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        @keyframes bounce-x {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(25%); }
        }
        .animate-bounce-x {
          animation: bounce-x 1s infinite;
        }
      `}} />
    </section>
  );
}
