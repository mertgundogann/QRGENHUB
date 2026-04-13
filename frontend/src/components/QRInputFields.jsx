import { useTranslation } from "react-i18next";

const QRInputFields = ({ fields, inputs, setInputs }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 mb-8">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col animate-in fade-in duration-300 group">
          
          {/* ETİKET */}
          <label className="text-[11px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2 ml-1 transition-colors">
            {t(f.name)}
          </label>
          
          {/* DURUM 1: TEXTAREA */}
          {f.name.includes("message") || f.name.includes("text") ? (
            <textarea
              placeholder={t(f.placeholder)}
              value={inputs[f.name] || ""}
              onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })}
              className="w-full p-4 rounded-2xl outline-none transition-all font-medium min-h-[120px] shadow-inner
                bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                dark:bg-gray-900/60 dark:border-gray-700 dark:focus:border-indigo-500/50 dark:focus:bg-gray-900 dark:focus:ring-indigo-500/10
                placeholder-gray-400 dark:placeholder-gray-500 
                text-gray-700 dark:text-white"
            />
          
          /* DURUM 2: SELECT (Wi-Fi Encryption) - BURASI GÜNCELLENDİ */
          ) : f.name.includes("encryption") ? (
            <div className="relative">
              <select
                value={inputs[f.name] || "WPA"}
                onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })}
                // 👇 DÜZELTME: 
                // 1. 'focus:bg-white' light mod için kaldı.
                // 2. 'dark:focus:bg-gray-900' EKLENDİ (Tıklayınca beyaz olmasını engeller).
                // 3. 'dark:bg-gray-900' yapıldı (Arka plan şeffaf değil tam siyah olsun ki çakışmasın).
                className="w-full p-4 rounded-2xl outline-none transition-all font-medium appearance-none cursor-pointer shadow-sm
                  bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500
                  dark:bg-gray-900 dark:border-gray-700 dark:focus:bg-gray-900 dark:focus:border-indigo-500/50
                  text-gray-700 dark:text-white"
              >
                <option value="WPA" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">WPA/WPA2</option>
                <option value="WEP" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">WEP</option>
                <option value="nopass" className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">None</option>
              </select>
              
              {/* Ok İkonu */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

          /* DURUM 3: STANDART INPUT */
          ) : (
            <input
              type="text"
              placeholder={t(f.placeholder)}
              value={inputs[f.name] || ""}
              onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })}
              className="w-full p-4 rounded-2xl outline-none transition-all font-medium shadow-inner
                bg-gray-50 border-2 border-transparent focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10
                dark:bg-gray-900/60 dark:border-gray-700 dark:focus:border-indigo-500/50 dark:focus:bg-gray-900 dark:focus:ring-indigo-500/10
                placeholder-gray-400 dark:placeholder-gray-500 
                text-gray-700 dark:text-white"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default QRInputFields;