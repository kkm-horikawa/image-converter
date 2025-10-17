import { useId } from 'react';
import type { ConversionSettings } from '../App';

interface ConversionOptionsProps {
  settings: ConversionSettings;
  onSettingsChange: (settings: ConversionSettings) => void;
}

function ConversionOptions({ settings, onSettingsChange }: ConversionOptionsProps) {
  const widthId = useId();
  const heightId = useId();
  const customColorId = useId();
  const presetColors = [
    { name: 'Transparent', value: 'transparent' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Black', value: '#000000' },
    { name: 'Gray', value: '#808080' },
  ];

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversion Options</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor={widthId} className="block text-sm font-medium text-gray-700 mb-2">
            Width (px)
          </label>
          <input
            id={widthId}
            type="number"
            min="1"
            max="4096"
            value={settings.width}
            onChange={(e) =>
              onSettingsChange({ ...settings, width: Number.parseInt(e.target.value, 10) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor={heightId} className="block text-sm font-medium text-gray-700 mb-2">
            Height (px)
          </label>
          <input
            id={heightId}
            type="number"
            min="1"
            max="4096"
            value={settings.height}
            onChange={(e) =>
              onSettingsChange({ ...settings, height: Number.parseInt(e.target.value, 10) })
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.maintainAspectRatio}
            onChange={(e) =>
              onSettingsChange({ ...settings, maintainAspectRatio: e.target.checked })
            }
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <span className="text-sm font-medium text-gray-700">Maintain aspect ratio</span>
        </label>
      </div>

      <div className="mt-6">
        <div className="block text-sm font-medium text-gray-700 mb-2">Background Color</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {presetColors.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => onSettingsChange({ ...settings, backgroundColor: color.value })}
              className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                settings.backgroundColor === color.value
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded border border-gray-300"
                  style={{
                    backgroundColor: color.value === 'transparent' ? 'white' : color.value,
                    backgroundImage:
                      color.value === 'transparent'
                        ? 'linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)'
                        : 'none',
                    backgroundSize: '10px 10px',
                    backgroundPosition: '0 0, 5px 5px',
                  }}
                />
                <span className="text-sm font-medium">{color.name}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-3">
          <label htmlFor={customColorId} className="block text-sm text-gray-600 mb-1">
            Custom Color
          </label>
          <input
            id={customColorId}
            type="color"
            value={
              settings.backgroundColor === 'transparent' ? '#FFFFFF' : settings.backgroundColor
            }
            onChange={(e) => onSettingsChange({ ...settings, backgroundColor: e.target.value })}
            className="h-10 w-full rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}

export default ConversionOptions;
