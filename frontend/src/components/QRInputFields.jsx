import React from "react";
import { useTranslation } from "react-i18next";

const QRInputFields = ({ fields, inputs, setInputs }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-5 mb-8">
      {fields.map((f) => (
        <div key={f.name} className="flex flex-col animate-in fade-in duration-300">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
            {t(f.name)}
          </label>
          
          {f.name.includes("message") || f.name.includes("text") ? (
            <textarea
              placeholder={t(f.placeholder)}
              value={inputs[f.name] || ""}
              onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all font-medium min-h-[120px] shadow-sm"
            />
          ) : f.name.includes("encryption") ? (
            <select
              value={inputs[f.name] || "WPA"}
              onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all font-medium appearance-none shadow-sm cursor-pointer"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          ) : (
            <input
              type="text"
              placeholder={t(f.placeholder)}
              value={inputs[f.name] || ""}
              onChange={(e) => setInputs({ ...inputs, [f.name]: e.target.value })}
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-indigo-500 focus:bg-white transition-all font-medium shadow-sm"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default QRInputFields;