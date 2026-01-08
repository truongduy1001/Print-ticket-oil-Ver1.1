
import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Printer, Settings, FileText, LayoutGrid, Eye, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Coupon from './components/Coupon';
import { CouponConfig, FUEL_TYPES, VOLUME_OPTIONS, FONT_OPTIONS } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<CouponConfig>({
    fromNumber: "01",
    toNumber: "10",
    fuelType: 'E5',
    volume: '04',
    volumeText: 'Bốn Lít',
    companyName: 'CÔNG TY XĂNG DẦU CHÂU THÀNH',
    signatory: 'P.Giám đốc',
    fontFamily: "'Times New Roman', Times, serif"
  });

  const [zoom, setZoom] = useState(0.8);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Cập nhật đồng hồ mỗi giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pages = useMemo(() => {
    const fromVal = parseInt(config.fromNumber) || 0;
    const toVal = parseInt(config.toNumber) || 0;
    const start = Math.min(fromVal, toVal);
    const end = Math.max(fromVal, toVal);
    const targetLength = config.fromNumber.length;

    const allFormattedNumbers: string[] = [];
    for (let i = start; i <= end; i++) {
      allFormattedNumbers.push(i.toString().padStart(targetLength, '0'));
    }

    const chunks = [];
    const pageSize = 10;
    for (let i = 0; i < allFormattedNumbers.length; i += pageSize) {
      chunks.push(allFormattedNumbers.slice(i, i + pageSize));
    }
    return chunks;
  }, [config.fromNumber, config.toNumber]);

  useEffect(() => {
    if (currentPageIndex >= pages.length) setCurrentPageIndex(0);
  }, [pages.length, currentPageIndex]);

  const totalCoupons = useMemo(() => {
    const fromVal = parseInt(config.fromNumber) || 0;
    const toVal = parseInt(config.toNumber) || 0;
    return Math.abs(toVal - fromVal) + 1;
  }, [config.fromNumber, config.toNumber]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'volume') {
      const selected = VOLUME_OPTIONS.find(v => v.value === value);
      if (selected) setConfig(prev => ({ ...prev, volume: selected.value, volumeText: selected.text }));
    } else {
      setConfig(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    const printArea = document.getElementById('print-area-hidden');
    if (!printArea) {
      setIsPrinting(false);
      return;
    }

    const printWindow = window.open('', '_blank', 'width=1100,height=800');
    if (!printWindow) {
      alert('Trình duyệt đã chặn cửa sổ bật lên. Vui lòng cho phép popup để thực hiện in.');
      setIsPrinting(false);
      return;
    }

    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(s => s.outerHTML)
      .join('\n');

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="UTF-8">
          <title>In Phiếu Xăng Dầu</title>
          ${styles}
          <style>
            @media print {
              @page { size: A4 portrait; margin: 0 !important; }
              html, body { margin: 0 !important; padding: 0 !important; height: 100%; background: white; }
              .print-page { display: block !important; page-break-after: always; page-break-inside: avoid; }
              .print-page:last-child { page-break-after: auto !important; }
            }
            body { margin: 0; padding: 0; background: white; }
            .print-page { 
              width: 210mm; 
              height: 296.5mm; 
              padding: 15mm 10mm; 
              box-sizing: border-box; 
              background: white;
              margin: 0 auto;
              overflow: hidden;
              position: relative;
            }
          </style>
        </head>
        <body>
          <div id="print-content">${printArea.innerHTML}</div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.onafterprint = function() { window.close(); };
                setTimeout(function() { window.close(); }, 1000);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setIsPrinting(false);
  }, [pages]);

  const goToNextPage = () => { if (currentPageIndex < pages.length - 1) setCurrentPageIndex(currentPageIndex + 1); };
  const goToPrevPage = () => { if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1); };

  const timeString = currentTime.toLocaleTimeString('vi-VN', { hour12: false });
  const dateString = currentTime.toLocaleDateString('vi-VN');

  return (
    <div className="min-h-screen bg-white overflow-hidden flex flex-col lg:flex-row">
      {/* SIDEBAR */}
      <aside className="w-full lg:w-96 bg-white shadow-xl p-6 overflow-y-auto z-20 shrink-0 border-r border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-black rounded-xl shadow-lg">
            <Printer className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-blue-600 leading-none">In Phiếu Xăng</h1>
            <p className="text-[10px] text-black font-bold uppercase mt-1 tracking-wider">Hệ thống chuyên nghiệp</p>
            <p className="text-[9px] text-black font-medium mt-0.5 opacity-80">{timeString} - {dateString}</p>
          </div>
        </div>

        <div className="space-y-6 pb-10">
          <section className="bg-white p-4 rounded-xl border border-slate-300">
            <h3 className="flex items-center gap-2 text-[11px] font-bold text-black uppercase mb-4 tracking-tighter">
              <Eye className="w-4 h-4" /> Mẫu phiếu hiện tại
            </h3>
            <div className="flex justify-center overflow-hidden scale-[0.7] origin-top bg-white border border-slate-200 shadow-sm">
              <Coupon config={config} serialNumber={config.fromNumber} />
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-widest">
              <Settings className="w-4 h-4" /> Cấu hình số nhảy
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">Từ số</label>
                <input 
                  type="text" 
                  name="fromNumber" 
                  value={config.fromNumber} 
                  onChange={handleInputChange} 
                  placeholder="001"
                  className="w-full px-3 py-2 border border-black rounded-lg font-bold text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-black uppercase">Đến số</label>
                <input 
                  type="text" 
                  name="toNumber" 
                  value={config.toNumber} 
                  onChange={handleInputChange} 
                  placeholder="010"
                  className="w-full px-3 py-2 border border-black rounded-lg font-bold text-black focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" 
                />
              </div>
            </div>
            <p className="text-[10px] text-black italic font-medium">* Gõ bao nhiêu số 0 thì hệ thống sẽ giữ bấy nhiêu chữ số.</p>
          </section>

          <section className="space-y-4">
            <h3 className="flex items-center gap-2 text-[11px] font-bold text-black uppercase tracking-widest">
              <LayoutGrid className="w-4 h-4" /> Nội dung in
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-black uppercase mb-1">Loại xăng</label>
                <select name="fuelType" value={config.fuelType} onChange={handleInputChange} className="w-full px-3 py-2 border border-black rounded-lg font-bold bg-white text-black">
                  {FUEL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-black uppercase mb-1">Định mức</label>
                <select name="volume" value={config.volume} onChange={handleInputChange} className="w-full px-3 py-2 border border-black rounded-lg font-bold bg-white text-black">
                  {VOLUME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-black uppercase mb-1">Kiểu chữ</label>
                <select name="fontFamily" value={config.fontFamily} onChange={handleInputChange} className="w-full px-3 py-2 border border-black rounded-lg font-bold bg-white text-black">
                  {FONT_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
            </div>
          </section>

          <div className="space-y-3">
            <button
              onClick={handlePrint}
              disabled={isPrinting}
              className={`w-full flex items-center justify-center gap-3 font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 ${
                isPrinting ? 'bg-slate-400' : 'bg-black hover:bg-zinc-800 text-white'
              }`}
            >
              {isPrinting ? <Loader2 className="w-6 h-6 animate-spin" /> : <Printer className="w-6 h-6" />}
              <div className="text-left">
                <div className="text-sm uppercase">{isPrinting ? 'Đang tải...' : 'IN TOÀN BỘ'}</div>
                <div className="text-[9px] opacity-70">Tổng {totalCoupons} phiếu ({pages.length} trang)</div>
              </div>
            </button>
            <p className="text-[10px] text-black text-center italic font-medium opacity-70 leading-relaxed px-2">
              Hệ thống được tích hợp Model AI phiên bản Unlimited, được viết riêng dựa trên Metadata of D-IT
            </p>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto flex flex-col items-center bg-white">
        <div className="w-full max-w-[210mm] flex flex-col gap-4 mb-8">
          <div className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-md rounded-full border border-slate-300">
            <div className="flex items-center gap-3 text-black font-bold text-xs uppercase tracking-tight">
              <FileText className="w-4 h-4 text-black" />
              <span>Trang {currentPageIndex + 1} / {pages.length}</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 pr-4 border-r border-slate-300">
                <button onClick={() => setZoom(z => Math.max(0.4, z - 0.1))} className="p-1.5 hover:bg-slate-100 rounded-full"><ZoomOut className="w-5 h-5 text-black" /></button>
                <span className="text-xs font-bold w-12 text-center text-black">{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(z => Math.min(1.5, z + 0.1))} className="p-1.5 hover:bg-slate-100 rounded-full"><ZoomIn className="w-5 h-5 text-black" /></button>
              </div>
              <button 
                onClick={handlePrint} 
                className="bg-black text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-zinc-800 transition-all active:scale-95 shadow-md flex items-center gap-2"
              >
                {isPrinting && <Loader2 className="w-3 h-3 animate-spin" />}
                MỞ LỆNH IN
              </button>
            </div>
          </div>

          {pages.length > 1 && (
            <div className="flex justify-center gap-1 bg-white p-1.5 rounded-xl shadow-md border border-slate-300 w-fit mx-auto">
              <button onClick={goToPrevPage} disabled={currentPageIndex === 0} className="p-2 disabled:opacity-20"><ChevronLeft className="w-5 h-5 text-black" /></button>
              <div className="flex items-center gap-1 max-w-[300px] overflow-x-auto px-1">
                {pages.map((_, idx) => (
                  <button key={idx} onClick={() => setCurrentPageIndex(idx)} className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-colors ${currentPageIndex === idx ? 'bg-black text-white' : 'text-black hover:bg-slate-100'}`}>{idx + 1}</button>
                ))}
              </div>
              <button onClick={goToNextPage} disabled={currentPageIndex === pages.length - 1} className="p-2 disabled:opacity-20"><ChevronRight className="w-5 h-5 text-black" /></button>
            </div>
          )}
        </div>

        {/* Trang in xem trước */}
        <div 
          className="bg-white shadow-2xl origin-top transition-transform border border-slate-300" 
          style={{ width: '210mm', height: '296.5mm', padding: '15mm 10mm', transform: `scale(${zoom})`, marginBottom: `calc(${zoom * 296.5}mm - 296.5mm + 50px)` }}
        >
          <div className="grid grid-cols-2 gap-x-[10mm] gap-y-[6mm] justify-center">
            {pages[currentPageIndex]?.map((num) => <Coupon key={num} config={config} serialNumber={num} />)}
          </div>
        </div>
      </main>

      {/* VÙNG CHỨA DỮ LIỆU IN ẨN */}
      <div id="print-area-hidden" className="hidden">
        {pages.map((pageCoupons, idx) => (
          <div key={idx} className="print-page">
            <div className="grid grid-cols-2 gap-x-[10mm] gap-y-[6mm] justify-center">
              {pageCoupons.map((num) => (
                <Coupon key={num} config={config} serialNumber={num} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
