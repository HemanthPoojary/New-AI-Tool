'use client'

import { useState } from 'react'
import { PlayCircle, Download, RefreshCw } from 'lucide-react'
import Image from 'next/image'

export default function PunchlineGenerator() {
  const [input, setInput] = useState('')
  const [length, setLength] = useState('short')
  const [language, setLanguage] = useState('english')
  const [punchline, setPunchline] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, length, language }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setPunchline(data.punchline);
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePlayAudio = async () => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: punchline }),
      });

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  const handleDownloadAudio = async () => {
    try {
      const response = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: punchline }),
      });
  
      const audioBlob = await response.blob();
      const url = window.URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'punchline-audio.mp3';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading audio:', error);
    }
  };
  
  const handleRegenerate = async () => {
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input, length, language }),
      });
  
      const data = await response.json();
      setPunchline(data.punchline);
      setImageUrl(data.imageUrl);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const handleDownloadImage = () => {
    if (imageUrl) {
      const a = document.createElement('a');
      a.href = imageUrl;
      a.download = 'generated-comic.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-xl p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700">Your Input</label>
          <textarea
            id="input"
            placeholder="Enter a word, sentence, or paragraph"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 bg-[#ecf39e]"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700">Punchline Length</label>
            <select
              id="length"
              value={length}
              onChange={(e) => setLength(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="very-short">Very Short (1-2 lines)</option>
              <option value="short">Short (3-4 lines)</option>
              <option value="long">Long (5-7 lines)</option>
            </select>
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700">Language</label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="kannada">Kannada</option>
            </select>
          </div>
        </div>
        <button type="submit" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
          Generate Punchline
        </button>
      </form>

      {punchline && (
        <div className="mt-8 space-y-6">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Generated Punchline:</h2>
            <p>{punchline}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">Generated Comic:</h2>
            <Image 
              src={imageUrl}
              alt="Generated Comic"
              width={500}
              height={300}
              className="rounded-lg shadow-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={handlePlayAudio}
              className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md px-4 py-3 text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md"
            >
              <PlayCircle className="mr-2 h-5 w-5" /> Play Audio
            </button>
            <button 
              onClick={handleDownloadAudio}
              className="flex items-center justify-center bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md px-4 py-3 text-sm font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-md"
            >
              <Download className="mr-2 h-5 w-5" /> Download Audio
            </button>
            <button 
              onClick={handleDownloadImage}
              className="flex items-center justify-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-md px-4 py-3 text-sm font-medium hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md"
            >
              <Download className="mr-2 h-5 w-5" /> Download Image
            </button>
            <button 
              onClick={handleRegenerate}
              className="flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-md px-4 py-3 text-sm font-medium hover:from-amber-600 hover:to-amber-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 shadow-md"
            >
              <RefreshCw className="mr-2 h-5 w-5" /> Regenerate
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

