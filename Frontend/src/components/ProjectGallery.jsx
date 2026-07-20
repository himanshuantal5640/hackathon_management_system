import React, { useState } from 'react';
import { Image as ImageIcon, X } from 'lucide-react';

const ProjectGallery = ({ screenshots = [] }) => {
  const [selectedImg, setSelectedImg] = useState(null);

  if (!screenshots || screenshots.length === 0) return null;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
        <ImageIcon className="w-4 h-4 text-purple-400" />
        Project Screenshots ({screenshots.length})
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {screenshots.map((img, idx) => (
          <div
            key={idx}
            onClick={() => setSelectedImg(img)}
            className="group relative h-28 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 cursor-pointer"
          >
            <img
              src={img}
              alt={`Screenshot ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold text-white bg-slate-900/80 px-2 py-1 rounded-md">
                Enlarge
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          onClick={() => setSelectedImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute -top-10 right-0 p-2 rounded-full bg-slate-900 text-slate-300 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImg}
              alt="Enlarged screenshot"
              className="max-h-[85vh] w-auto rounded-2xl border border-slate-800 object-contain shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectGallery;
