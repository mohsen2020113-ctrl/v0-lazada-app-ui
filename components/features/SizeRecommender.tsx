'use client';
import React, { useState } from 'react';
import { Ruler } from 'lucide-react';

const SizeRecommender = ({ productId }: { productId: string }) => {
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [recommendation, setRecommendation] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleRecommend = async () => {
          setLoading(true);
          try {
                  const response = await fetch('/api/ai/size-recommend', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ productId, height: parseInt(height), weight: parseInt(weight) }),
                  });
                  const data = await response.json();
                  setRecommendation(data.recommendedSize);
          } catch (error) {
                  console.error('Error getting recommendation:', error);
                  setRecommendation('L');
          } finally {
                  setLoading(false);
          }
    };

    return (
          <div className="bg-slate-800 rounded-lg p-6 max-w-md">
                <div className="flex items-center gap-2 mb-4">
                        <Ruler className="w-5 h-5 text-pink-400" />
                        <h3 className="text-xl font-bold text-white">Size Recommender</h3>h3>
                </div>div>
                <p className="text-slate-300 text-sm mb-4">Tell us your measurements for a perfect fit</p>p>
                <div className="space-y-4">
                        <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">Height (cm)</label>label>
                                  <input
                                                type="number"
                                                value={height}
                                                onChange={(e) => setHeight(e.target.value)}
                                                placeholder="170"
                                                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-pink-500 outline-none"
                                              />
                        </div>div>
                        <div>
                                  <label className="block text-sm font-medium text-slate-300 mb-2">Weight (kg)</label>label>
                                  <input
                                                type="number"
                                                value={weight}
                                                onChange={(e) => setWeight(e.target.value)}
                                                placeholder="70"
                                                className="w-full bg-slate-700 text-white px-3 py-2 rounded border border-slate-600 focus:border-pink-500 outline-none"
                                              />
                        </div>div>
                        <button
                                    onClick={handleRecommend}
                                    disabled={loading || !height || !weight}
                                    className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded transition"
                                  >
                          {loading ? 'Getting recommendation...' : 'Get Size'}
                        </button>button>
                  {recommendation && (
                      <div className="bg-slate-700 p-4 rounded mt-4">
                                  <p className="text-slate-400 text-sm mb-2">Recommended Size:</p>p>
                                  <p className="text-2xl font-bold text-pink-400">{recommendation}</p>p>
                      </div>div>
                        )}
                </div>div>
          </div>div>
        );
};
export default SizeRecommender;</div>
