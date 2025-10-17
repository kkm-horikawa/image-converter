import { useState } from 'react';
import ConversionOptions from './components/ConversionOptions';
import FileUploadZone from './components/FileUploadZone';
import PreviewSection from './components/PreviewSection';
import Toast from './components/Toast';

export interface ConversionSettings {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  backgroundColor: string;
}

interface ToastState {
  message: string;
  type: 'error' | 'success' | 'info';
}

function App() {
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string>('');
  const [svgContent, setSvgContent] = useState<string>('');
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [toast, setToast] = useState<ToastState | null>(null);
  const [settings, setSettings] = useState<ConversionSettings>({
    width: 512,
    height: 512,
    maintainAspectRatio: true,
    backgroundColor: 'transparent',
  });

  const handleFileSelect = (file: File) => {
    setSvgFile(file);

    // SVGの内容をテキストとして読み込む
    const textReader = new FileReader();
    textReader.onload = (e) => {
      const content = e.target?.result as string;
      setSvgContent(content);
    };
    textReader.readAsText(file);

    // data URLとしても読み込む（プレビュー用）
    const dataUrlReader = new FileReader();
    dataUrlReader.onload = (e) => {
      const result = e.target?.result as string;
      setSvgDataUrl(result);

      // SVGのサイズを取得してデフォルト値に設定
      const img = new Image();
      img.onload = () => {
        const maxSize = 2048;
        let width = img.width;
        let height = img.height;

        // 元のサイズが大きすぎる場合はスケールダウン
        if (width > maxSize || height > maxSize) {
          const scale = Math.min(maxSize / width, maxSize / height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        setSettings((prev) => ({
          ...prev,
          width,
          height,
        }));
      };
      img.src = result;
    };
    dataUrlReader.readAsDataURL(file);
  };

  const handleConvert = async () => {
    if (!svgContent) return;

    // SVGのサイズを取得
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.querySelector('svg');
    if (!svgElement) return;

    // viewBoxまたはwidth/height属性からサイズを取得
    const viewBox = svgElement.getAttribute('viewBox');
    let originalWidth: number;
    let originalHeight: number;

    if (viewBox) {
      const [, , w, h] = viewBox.split(' ').map(Number);
      originalWidth = w;
      originalHeight = h;
    } else {
      originalWidth = Number.parseFloat(svgElement.getAttribute('width') || '0');
      originalHeight = Number.parseFloat(svgElement.getAttribute('height') || '0');
    }

    let { width, height } = settings;

    if (settings.maintainAspectRatio && originalWidth && originalHeight) {
      const aspectRatio = originalWidth / originalHeight;
      if (width / height > aspectRatio) {
        width = height * aspectRatio;
      } else {
        height = width / aspectRatio;
      }
    }

    // Ensure width and height are integers
    width = Math.round(width);
    height = Math.round(height);
    // SVGをBlobに変換してからImageに読み込む
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(url);
        return;
      }

      canvas.width = width;
      canvas.height = height;

      if (settings.backgroundColor !== 'transparent') {
        ctx.fillStyle = settings.backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      ctx.drawImage(img, 0, 0, width, height);
      const pngUrl = canvas.toDataURL('image/png');
      setPngDataUrl(pngUrl);
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      setToast({
        message: 'SVG の変換に失敗しました。ファイルの形式を確認してください。',
        type: 'error',
      });
    };

    img.src = url;
  };

  const handleDownload = () => {
    if (!pngDataUrl) return;

    const link = document.createElement('a');
    link.download = svgFile?.name.replace('.svg', '.png') || 'converted.png';
    link.href = pngDataUrl;
    link.click();
  };

  const handleReset = () => {
    setSvgFile(null);
    setSvgDataUrl('');
    setPngDataUrl('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">SVG to PNG Converter</h1>
          <p className="text-gray-600">Convert your SVG files to PNG images with custom settings</p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <FileUploadZone onFileSelect={handleFileSelect} currentFile={svgFile} />
        </div>

        {svgDataUrl && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <ConversionOptions settings={settings} onSettingsChange={setSettings} />
              <div className="flex gap-4 mt-6">
                <button
                  type="button"
                  onClick={handleConvert}
                  className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Convert to PNG
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <PreviewSection
                svgDataUrl={svgDataUrl}
                pngDataUrl={pngDataUrl}
                onDownload={handleDownload}
              />
            </div>
          </>
        )}
      </div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}

export default App;
