const QRSettings = ({ 
  fgColor, setFgColor, 
  bgColor, setBgColor, 
  frameText, setFrameText, 
  logo, setLogo, 
  fileInputRef, 
  t 
}) => {

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File too large! Max 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => setLogo(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{t('qr_color')}</label>
          <div className="flex items-center gap-3 p-2.5 rounded-2xl border bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent" />
            <span className="text-[11px] font-mono font-black text-gray-500 dark:text-gray-400">{fgColor.toUpperCase()}</span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{t('background_color')}</label>
          <div className="flex items-center gap-3 p-2.5 rounded-2xl border bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-10 rounded-xl cursor-pointer border-none bg-transparent" />
            <span className="text-[11px] font-mono font-black text-gray-500 dark:text-gray-400">{bgColor.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{t('footer_text')}</label>
        <input type="text" value={frameText} maxLength={30} onChange={(e) => setFrameText(e.target.value)} placeholder="SCAN ME" className="w-full p-4 rounded-2xl border text-sm font-bold outline-none text-gray-900 placeholder-gray-400 bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:text-white dark:placeholder-gray-500" />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500">{t('add_logo')}</label>
        <input type="file" ref={fileInputRef} onChange={handleLogoUpload} className="hidden" accept="image/*" />
        {!logo ? (
          <button type="button" onClick={() => fileInputRef.current?.click()} className="w-full py-5 border-2 border-dashed rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all bg-white border-gray-200 text-gray-400 hover:border-indigo-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500 dark:hover:border-indigo-500">
            + {t('add_logo')}
          </button>
        ) : (
          <div className="flex items-center justify-between w-full p-3 rounded-2xl border bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700">
            <img src={logo} className="w-12 h-12 rounded-xl object-contain bg-gray-50 dark:bg-gray-700" />
            <button type="button" onClick={() => {setLogo(null); if(fileInputRef.current) fileInputRef.current.value="";}} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase bg-red-50 text-red-500 dark:bg-red-900/30 dark:text-red-400">
              {t('remove_logo')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default QRSettings;