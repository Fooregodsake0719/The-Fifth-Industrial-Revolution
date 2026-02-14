
import React, { useState } from 'react';
import { View, GalleryItem } from '../types';

interface GalleryProps {
  onNavigate: (view: View) => void;
}

const Gallery: React.FC<GalleryProps> = ({ onNavigate }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  /**
   * 📘 如何添加更多图片和内容？
   * 
   * 你只需要在下面的 [ ] 数组中，按照格式复制粘贴 `{ ... }` 块。
   * 注意事项：
   * 1. id: 确保每个作品的 id 是唯一的（比如 001, 002, 003...）。
   * 2. images: 数组里的第一个路径是“封面”，点击进去后，所有的路径都会显示在顶部的切换区域。
   * 3. detailedText: 支持 \n 换行，适合写你的长篇感悟。
   */
  const items: GalleryItem[] = [
    { 
      id: '001',
      title: "Yerkes Observatory-20250716", 
      description: "Observation is a singular pilgrimage to the stars.",
      detailedText: "19世纪末建成的天文台，连旋转楼梯扶手上的污渍都是庄严神圣的。整个观测站非常豪华，坐落于威斯康星郊区。听教授说，它一个很有钱的人捐给Uchi的礼物，但是建成之后这个人就来过一两次。里面用的天文望远镜是比较原始的折射望远镜，这一架是折射望远镜家族中最大的也是最后建成的，划分了天文观测的新时代和旧时代。\n\n当时阳光非常充沛，灰尘暴露在阳关下时间长了会散发出那种庄严的气息，窗外的草坪像猫的眼睛。所有人都抬起头注视着那架近在咫尺的庞然大物。整个平台都是木头做的，吊索也是那种老电影里最原始的机械结构。据说建成后的没几年，平台上莫名出现的一块石头把平台拦腰折断，如此荒谬。我始终觉得人们在抬起头观测的时候很像在对星空进行独特的朝圣，这种朝圣从最原始的“抬头看”逐渐变成一架架指向星空的机械产物，延续了一个世纪又一个世纪。可是原始崇拜始终是原始崇拜，无论人类拿肉眼面对宇宙还是拿镜片面对宇宙。\n\n角落里蜷缩着的旋转楼梯；地下室堆满各种稀奇古怪的航天器材；洗胶卷的暗房摆放着几十年前的工作平台；储存室内遗忘着从未观测过星空的小望远镜；过道上斜着一个荧光黄大垃圾箱上面贴着“not trash”的标签；走道尽头一坨电线和金属管子缠绕在一起，我只能通过推测得出它们的下面有一张不堪重负的桌子。\n\n档案室塞满档案册，里面放满了像毛毛虫一样的恒星光谱。教授如数家珍地跟我们介绍这个介绍那个，而我们竟然真的在学习。天文学家分析的数据是观测来的，观测技术真的很难评。至今为止我们甚至无法看清稍微远一点点的恒星的清晰的样子，仅限于一个模糊的小闪光点。但是这片宇宙中的闪光点到底有多少？我只知道多到大家无法想象。天文学家分析的数据到底是对是错？没有人知道，也不可能有人知道。所以谁制定了这套规则谁就是正确答案。它比其他基础科学更加荒谬的点在于：我们可以通过苹果落地来“证明”重力的存在，但是我们无法通过任何实际的可触及的东西证明大质量恒星最终会坍缩成黑洞。\n\n一切的一切都在我踏进这块区域的那一刻使我觉得这里很容易发生谋杀案，正如它平静的表面下暗藏着时光的涌动，庄严神圣的背后透露出一种邪教组织特有的未知所带来的危险，以及一切看似科学合理却又有些荒谬的诡异感。\n\n吃完饭后我们各自去了不同的选修课，然后一起坐车回学校。当时正好日落，马路和草坪之间没有栏杆。就这样渐渐看着大片的植物矮下去，慢慢稀疏了，从面变成线。然后水泥和涂鸦就多了起来。有一个瞬间 我忽然意识到我根本不在乎事物的真实性。作为一个非常固执的唯心主义者，我坚信人类的意识投射成整个世界，我要做的也是一直在做的就是选择一个喜欢的相信。这世界平等地荒谬，人们试图探索世界的行为平等的愚蠢。我感觉我在车上睡着了，天文台的一切其实是我做的梦；或者我在天文台睡着了，车上的一切其实是我做的梦。",
      images: [
        "https://cdn.mos.cms.futurecdn.net/U78yCdSLVr6MCzWUqsymhW.jpg", 
        "https://picsum.photos/1200/800?random=102",
        "https://picsum.photos/1200/800?random=103"
      ]
    },
    { 
      id: '002',
      title: "Industrial Reverie", 
      description: "A dream captured in cold steel.",
      detailedText: "这是关于 002 号作品的长篇文字说明。\n\n在深夜的工厂里，机器的嗡嗡声听起来像是某种古老的圣咏。这个作品试图捕捉那种冷冰冰的诗意。",
      images: [
        "https://picsum.photos/1200/800?random=201",
        "https://picsum.photos/1200/800?random=202"
      ]
    },
    { 
      id: '003',
      title: "The Clockwork Eye", 
      description: "Observation without bias.",
      detailedText: "精密设计的镜头组，能够过滤掉一切感性的色彩。它只记录数据，不记录情感。在机械社团中，这被视为最高的美德。",
      images: [
        "https://picsum.photos/1200/800?random=301",
        "https://picsum.photos/1200/800?random=302",
        "https://picsum.photos/1200/800?random=303"
      ]
    },
    { 
      id: '004',
      title: "Pressure Valve G-7", 
      description: "Managing the inner explosive force.",
      detailedText: "当压力达到临界值时，阀门会自动开启。这既是物理法则，也是社会法则。如果不学会释放，系统最终会从内部崩溃。",
      images: [
        "https://picsum.photos/1200/800?random=401"
      ]
    },
    { 
      id: '005',
      title: "Chromed Neural Link", 
      description: "Bridging the gap between code and soul.",
      detailedText: "这是最后的连接。一旦插入，你将不再属于你自己，而是成为了整体的一部分。这是进化的代价。",
      images: [
        "https://picsum.photos/1200/800?random=501",
        "https://picsum.photos/1200/800?random=502"
      ]
    },
    // 💡 你可以在这里继续粘贴更多的 {} 块...
  ];

  const handleSelectItem = (item: GalleryItem) => {
    setSelectedItem(item);
    setCurrentImgIdx(0);
  };

  const nextImage = () => {
    if (!selectedItem) return;
    setCurrentImgIdx((prev) => (prev + 1) % selectedItem.images.length);
  };

  const prevImage = () => {
    if (!selectedItem) return;
    setCurrentImgIdx((prev) => (prev - 1 + selectedItem.images.length) % selectedItem.images.length);
  };

  // --- 详情页试图 (Detail View) ---
  if (selectedItem) {
    return (
      <div className="min-h-screen bg-zinc-950 p-4 md:p-8 flex flex-col animate-in fade-in duration-500">
        <header className="flex justify-between items-center mb-8 border-b border-zinc-800 pb-4">
          <div>
            <p className="text-[10px] text-amber-700 font-mono uppercase tracking-[0.3em]">Project_Detail // Archive_{selectedItem.id}</p>
            <h2 className="text-2xl md:text-3xl font-bold text-amber-600 tracking-widest uppercase italic">
              {selectedItem.title}
            </h2>
          </div>
          <button 
            onClick={() => setSelectedItem(null)} 
            className="btn-industrial text-[10px] py-2 px-4 border-amber-900/50 hover:border-amber-500"
          >
            [ BACK_TO_ARCHIVE ]
          </button>
        </header>

        <main className="flex-1 flex flex-col items-center">
          {/* 上方图片显示区 */}
          <div className="relative w-full max-w-5xl group">
            <div className="aspect-video bg-black border-4 border-zinc-900 overflow-hidden relative shadow-[0_0_50px_rgba(0,0,0,1)]">
              <img 
                src={selectedItem.images[currentImgIdx]} 
                alt={`${selectedItem.title} slide ${currentImgIdx}`}
                className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700"
              />
              
              {/* 图片计数器 */}
              <div className="absolute top-4 right-4 bg-black/80 px-3 py-1 border border-zinc-800 text-[10px] font-mono text-zinc-500">
                FRAME_{currentImgIdx + 1} / {selectedItem.images.length}
              </div>

              {/* 左右切换控制 */}
              {selectedItem.images.length > 1 && (
                <>
                  <button 
                    onClick={prevImage}
                    className="absolute left-0 top-0 bottom-0 w-20 flex items-center justify-center bg-gradient-to-r from-black/60 to-transparent hover:from-amber-600/10 text-amber-500 text-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    &lt;
                  </button>
                  <button 
                    onClick={nextImage}
                    className="absolute right-0 top-0 bottom-0 w-20 flex items-center justify-center bg-gradient-to-l from-black/60 to-transparent hover:from-amber-600/10 text-amber-500 text-2xl transition-all opacity-0 group-hover:opacity-100"
                  >
                    &gt;
                  </button>
                </>
              )}
            </div>

            {/* 下方缩略指示条 */}
            <div className="flex justify-center mt-4 space-x-2">
              {selectedItem.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIdx(idx)}
                  className={`h-1 transition-all duration-300 ${currentImgIdx === idx ? 'bg-amber-600 w-12' : 'bg-zinc-800 w-4 hover:bg-zinc-600'}`}
                />
              ))}
            </div>
          </div>

          {/* 下方文字说明区 */}
          <div className="w-full max-w-4xl mt-12 bg-zinc-900/30 p-8 border-l-4 border-amber-900 relative">
            <div className="absolute -top-3 left-6 bg-zinc-950 px-4 text-[10px] text-zinc-600 font-mono tracking-tighter">
              LOG_ENTRY: TEXT_RECORD
            </div>
            <p className="text-zinc-300 font-mono text-base md:text-lg leading-relaxed whitespace-pre-wrap selection:bg-amber-500 selection:text-black">
              {selectedItem.detailedText}
            </p>
          </div>
        </main>

        <footer className="mt-12 text-center text-zinc-800 text-[9px] uppercase tracking-[1em]">
          Classified Information // Mechanical Archive Access Restricted
        </footer>
      </div>
    );
  }

  // --- 列表页视图 (List View) ---
  return (
    <div className="min-h-screen bg-zinc-950 p-8 flex flex-col">
      <header className="flex justify-between items-center mb-12">
        <h2 className="text-3xl font-bold text-amber-600 tracking-widest uppercase">
          Reverie Gallery
        </h2>
        <button onClick={() => onNavigate(View.HOME)} className="btn-industrial text-xs">
          Home
        </button>
      </header>

      {/* 横向滚动容器 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden flex items-center space-x-8 pb-12 snap-x custom-scrollbar">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleSelectItem(item)}
            className="flex-shrink-0 w-80 md:w-96 snap-center group cursor-pointer"
          >
            <div className="relative border-4 border-zinc-800 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-amber-900">
              {/* 封面图展示 */}
              <img src={item.images[0]} alt={item.title} className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4">
                <p className="text-[10px] text-amber-500 font-mono">ARCHIVE_ID: {item.id}</p>
                <h3 className="text-xl font-bold text-white group-hover:text-amber-500 transition-colors">{item.title}</h3>
              </div>
              {/* 交互提示 */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <span className="text-amber-500 font-mono text-xs border border-amber-500 px-3 py-1 bg-black/80">
                  [ ANALYZE_ENTRY ]
                </span>
              </div>
            </div>
            <p className="mt-4 text-zinc-500 text-sm italic leading-snug">
              {item.description}
            </p>
          </div>
        ))}
        {/* 一个占位块，确保最后一张图能滚动到中间 */}
        <div className="flex-shrink-0 w-24"></div>
      </div>
      
      <div className="text-center text-zinc-700 text-[10px] uppercase tracking-[0.5em] animate-pulse mt-4">
        Scroll horizontally // Click an entry to expand data
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #451a03;
          border-radius: 0;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #09090b;
        }
      `}</style>
    </div>
  );
};

export default Gallery;
