
import React from 'react';
import { CouponConfig } from '../types';

interface CouponProps {
  config: CouponConfig;
  serialNumber: string;
}

const Coupon: React.FC<CouponProps> = ({ config, serialNumber }) => {
  return (
    <div 
      className="border-[2px] border-double border-black p-[0.5mm] bg-white flex flex-col overflow-hidden box-border text-black"
      style={{ 
        width: '8.47cm', 
        height: '4.76cm',
        fontFamily: config.fontFamily 
      }}
    >
      <div className="border border-black flex-1 flex flex-col items-center justify-between py-1 px-2">
        {/* Nhóm phần trên và phần nội dung chính */}
        <div className="text-center w-full flex flex-col items-center">
          {/* Tên công ty */}
          <h2 className="font-bold text-[14px] uppercase tracking-tight leading-tight mb-0.5">
            {config.companyName}
          </h2>
          
          {/* Số thứ tự - Hiển thị trực tiếp chuỗi số đã format */}
          <div className="text-[13px] font-bold mb-1">
            Số: {serialNumber}
          </div>

          {/* Tiêu đề phiếu và Loại xăng - Chuyển về màu đen theo yêu cầu mới nhất */}
          <div className="mt-0">
            <h1 className="font-bold text-[19px] uppercase tracking-wide leading-tight text-black">
              PHIẾU xăng {config.fuelType}
            </h1>
            <p className="text-[14px] font-bold leading-tight">
              LOẠI: {config.volume} Lít ({config.volumeText})
            </p>
          </div>

          {/* Dòng ngày tháng - Căn giữa */}
          <div className="w-full text-center mt-1 text-[11px] italic">
            Ngày .........................
          </div>
        </div>

        {/* Phần chân: Chức danh ký */}
        <div className="w-full flex justify-end items-end mb-20 px-1">
          <div className="text-center min-w-[140px]">
            <p className="text-[13px] font-bold uppercase leading-tight">{config.signatory}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupon;
