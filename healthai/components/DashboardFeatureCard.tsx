"use client";

import React from 'react';

interface DashboardFeatureCardProps {
  title: string;
  description: string;
  link: string;
  imageUrl: string;
  buttonText: string;
}

const DashboardFeatureCard: React.FC<DashboardFeatureCardProps> = ({
  title,
  description,
  link,
  imageUrl,
  buttonText,
}) => {
  return (
    <div className="p-4 @container">
      <div className="flex flex-col items-stretch justify-start rounded-lg @xl:flex-row @xl:items-start">
        {/* Image Section */}
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
          style={{ backgroundImage: `url("${imageUrl}")` }}
        ></div>
        
        {/* Content Section */}
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-1 py-4 @xl:px-4">
          <p className="text-[#131712] text-lg font-bold leading-tight tracking-[-0.015em]">{title}</p>
          <div className="flex items-end gap-3 justify-between">
            <p className="text-[#6d8566] text-base font-normal leading-normal">{description}</p>
            {/* Button linked to the feature */}
            <a
              href={link}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-8 px-4 bg-[#53d22c] text-[#131712] text-sm font-medium leading-normal hover:bg-green-600 hover:text-white transition-colors"
            >
              <span className="truncate">{buttonText}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardFeatureCard;
