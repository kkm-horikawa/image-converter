interface PreviewSectionProps {
  svgDataUrl: string;
  pngDataUrl: string;
  onDownload: () => void;
}

function PreviewSection({ svgDataUrl, pngDataUrl, onDownload }: PreviewSectionProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Preview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Original SVG</h3>
          <div
            className="border border-gray-300 rounded-lg p-4 bg-white flex items-center justify-center min-h-[300px]"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
            }}
          >
            <img src={svgDataUrl} alt="SVG preview" className="max-w-full max-h-[300px]" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Converted PNG</h3>
          <div
            className="border border-gray-300 rounded-lg p-4 bg-white flex items-center justify-center min-h-[300px]"
            style={{
              backgroundImage:
                'linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0), linear-gradient(45deg, #f0f0f0 25%, transparent 25%, transparent 75%, #f0f0f0 75%, #f0f0f0)',
              backgroundSize: '20px 20px',
              backgroundPosition: '0 0, 10px 10px',
            }}
          >
            {pngDataUrl ? (
              <img src={pngDataUrl} alt="PNG preview" className="max-w-full max-h-[300px]" />
            ) : (
              <p className="text-gray-400 text-sm">Click "Convert to PNG" to see preview</p>
            )}
          </div>
        </div>
      </div>

      {pngDataUrl && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onDownload}
            className="w-full bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              role="img"
              aria-label="Download icon"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            Download PNG
          </button>
        </div>
      )}
    </div>
  );
}

export default PreviewSection;
