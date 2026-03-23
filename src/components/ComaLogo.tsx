interface ComaLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const ComaLogo = ({ size = 'md' }: ComaLogoProps) => {
  const sizeConfig = {
    sm: { container: 'w-10 h-10 rounded-lg', text: 'text-[10px]', inset: 'inset-[4px] rounded-[4px]' },
    md: { container: 'w-[88px] h-[88px] rounded-[20px]', text: 'text-[20px]', inset: 'inset-[10px] rounded-[12px]' },
    lg: { container: 'w-[120px] h-[120px] rounded-[24px]', text: 'text-[28px]', inset: 'inset-[12px] rounded-[14px]' },
  };

  const config = sizeConfig[size];

  return (
    <div 
      className={`${config.container} flex items-center justify-center relative`}
      style={{ backgroundColor: '#40C095' }}
    >
      <div 
        className={`absolute ${config.inset}`}
        style={{ border: '2px dashed rgba(255,255,255,0.5)' }}
      />
      <div className={`text-white text-center leading-tight z-10 font-bold ${config.text}`}>
        <div className="tracking-[0.15em]">CO</div>
        <div className="tracking-[0.15em]">MA</div>
      </div>
    </div>
  );
};

export default ComaLogo;
