import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronUp, Copy, Check, Calculator, BookOpen, FileSpreadsheet, Palette, Code, Lightbulb, Home } from 'lucide-react';

export default function ExcelMasterclass() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeSection, setActiveSection] = useState('intro');

  const toggleSection = (id) => {
    setExpandedSections(prev => ({...prev, [id]: !prev[id]}));
  };

  const evaluateExpression = () => {
    try {
      let safe = expression.replace(/,/g, '.');
      safe = safe.replace(/(\d+(\.\d+)?)\s*%/g, '($1/100)');
      safe = safe.replace(/\^/g, '**');
      
      if (!/^[0-9+\-*/^().%\s,]+$/.test(expression)) {
        setResult('Invalid expression - use only numbers and + - * / ^ ( ) %');
        return;
      }
      
      const fn = new Function('return (' + safe + ')');
      const value = fn();
      setResult(`Result: ${Number.isFinite(value) ? value.toFixed(4) : String(value)}`);
    } catch (e) {
      setResult(`Error: ${e.message}`);
    }
  };

  const copyFormula = async (formula, index) => {
    try {
      await navigator.clipboard.writeText(formula);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (e) {
      alert('Copy failed');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'workbooks', 'data', 'formatting', 'formulas', 'lab', 'tester', 'resources'];
      const current = sections.find(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
        }
        return false;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = window.innerWidth < 768 ? 80 : 20;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  const formulas = [
    { name: 'Basic Sum', code: '=SUM(A1:A10)', desc: 'Add range of cells' },
    { name: 'Average', code: '=AVERAGE(B1:B20)', desc: 'Calculate mean' },
    { name: 'IF Statement', code: '=IF(A1>100, "High", "Low")', desc: 'Conditional logic' },
    { name: 'VLOOKUP', code: '=VLOOKUP(E2, A2:B10, 2, FALSE)', desc: 'Vertical lookup' },
    { name: 'Tax Calc', code: '=B2 * 0.17', desc: '17% tax calculation' },
    { name: 'Percentage', code: '=A1 * 10%', desc: '10% of value' }
  ];

  const navItems = [
    { id: 'intro', icon: BookOpen, label: 'Introduction', color: 'emerald' },
    { id: 'workbooks', icon: FileSpreadsheet, label: 'Workbooks', color: 'blue' },
    { id: 'data', icon: Code, label: 'Data Management', color: 'purple' },
    { id: 'formatting', icon: Palette, label: 'Formatting', color: 'pink' },
    { id: 'formulas', icon: Calculator, label: 'Formulas', color: 'orange' },
    { id: 'lab', icon: Lightbulb, label: 'Practical Lab', color: 'red' },
    { id: 'tester', icon: Calculator, label: 'Formula Tester', color: 'teal' },
    { id: 'resources', icon: BookOpen, label: 'Resources', color: 'indigo' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          overflow-x: hidden;
        }
        .sticky-header { position: sticky; top: 0; z-index: 100; backdrop-filter: blur(10px); }
        @media (min-width: 1024px) {
          .desktop-sidebar { position: sticky; top: 100px; height: calc(100vh - 120px); overflow-y: auto; }
          .desktop-sidebar::-webkit-scrollbar { width: 6px; }
          .desktop-sidebar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        }
        .smooth-transition { transition: all 0.3s ease; }
        .card-hover:hover { transform: translateY(-2px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
      `}</style>

      {/* Header */}
      <header className="sticky-header bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 text-white shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="lg:hidden flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-8 h-8" />
              <div>
                <h1 className="text-lg font-bold">Excel Masterclass</h1>
                <p className="text-xs opacity-90">UMKB ICT</p>
              </div>
            </div>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-white/20 rounded-lg">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <div className="hidden lg:block py-8 text-center">
            <FileSpreadsheet className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-2">Excel — Masterclass</h1>
            <p className="text-lg opacity-95"><strong>Instructor:</strong> Zineb Djihane Agli</p>
            <p className="text-sm opacity-90">UMKB ICT Module | L1 English</p>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden bg-white text-gray-800 shadow-2xl max-h-96 overflow-y-auto">
            <nav className="p-4 space-y-2">
              {navItems.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg smooth-transition ${
                    activeSection === id ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Main Layout */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block lg:col-span-3">
            <nav className="desktop-sidebar bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Contents</h3>
              <div className="space-y-2">
                {navItems.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-sm smooth-transition ${
                      activeSection === id ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9 space-y-6">
            
            {/* Introduction */}
            <section id="intro" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-emerald-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <BookOpen className="w-6 h-6 text-emerald-600" />
                    Introduction & Interface
                  </h2>
                  <p className="text-gray-600">Master Excel workspace fundamentals</p>
                </div>
                <button onClick={() => toggleSection('intro')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.intro ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.intro && (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-5 rounded-xl">
                      <h3 className="font-semibold text-blue-900 mb-3">🎯 Key Elements</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Ribbon:</strong> Tabs with tools (Home, Insert, Data)</li>
                        <li><strong>Quick Access:</strong> Save, Undo, Redo shortcuts</li>
                        <li><strong>Formula Bar:</strong> View/edit cell contents</li>
                        <li><strong>Status Bar:</strong> Quick calculations</li>
                      </ul>
                    </div>
                    <div className="bg-emerald-50 p-5 rounded-xl">
                      <h3 className="font-semibold text-emerald-900 mb-3">📝 Cell References</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li><strong>Columns:</strong> A, B, C...Z, AA, AB</li>
                        <li><strong>Rows:</strong> 1, 2, 3...1,048,576</li>
                        <li><strong>Cells:</strong> A1, B2, Z100</li>
                        <li><strong>Ranges:</strong> A1:B10</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Workbooks */}
            <section id="workbooks" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <FileSpreadsheet className="w-6 h-6 text-blue-600" />
                    Workbooks & Worksheets
                  </h2>
                  <p className="text-gray-600">Organize multiple sheets effectively</p>
                </div>
                <button onClick={() => toggleSection('workbooks')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.workbooks ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.workbooks && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-5 rounded-xl">
                    <h3 className="font-semibold text-blue-900 mb-3">🗂️ Best Practices</h3>
                    <ul className="space-y-2 text-sm">
                      <li>✅ Separate data from calculations</li>
                      <li>✅ Use index sheet for navigation</li>
                      <li>✅ Lock formulas with protection</li>
                      <li>✅ Version files (grades_v1.xlsx)</li>
                    </ul>
                  </div>
                  <div className="bg-emerald-50 p-5 rounded-xl">
                    <h3 className="font-semibold text-emerald-900 mb-3">📚 Organization</h3>
                    <ul className="space-y-2 text-sm">
                      <li>📊 Sheet 1: Raw data</li>
                      <li>🔧 Sheet 2: Calculations</li>
                      <li>📈 Sheet 3: Charts</li>
                      <li>📝 Sheet 4: Documentation</li>
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* Data Management */}
            <section id="data" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Code className="w-6 h-6 text-purple-600" />
                    Data Management
                  </h2>
                  <p className="text-gray-600">Foundation of reliable analysis</p>
                </div>
                <button onClick={() => toggleSection('data')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.data ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.data && (
                <div className="space-y-4">
                  <div className="bg-purple-50 p-5 rounded-xl">
                    <h3 className="font-semibold text-purple-900 mb-3">🎯 Cleaning Workflow</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Keep original raw data tab</li>
                      <li>Create cleaned copy</li>
                      <li>Remove blanks, trim spaces</li>
                      <li>Normalize formats</li>
                      <li>Document assumptions</li>
                    </ol>
                  </div>
                </div>
              )}
            </section>

            {/* Formatting */}
            <section id="formatting" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-pink-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Palette className="w-6 h-6 text-pink-600" />
                    Formatting & Visualization
                  </h2>
                  <p className="text-gray-600">Transform numbers into insights</p>
                </div>
                <button onClick={() => toggleSection('formatting')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.formatting ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.formatting && (
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-pink-900 mb-2">💰 Numbers</h3>
                    <ul className="space-y-1 text-xs">
                      <li>Currency: $1,234.56</li>
                      <li>Percent: 45.2%</li>
                      <li>Custom: 0.0,"M"</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-blue-900 mb-2">🎨 Conditional</h3>
                    <ul className="space-y-1 text-xs">
                      <li>Color scales</li>
                      <li>Data bars</li>
                      <li>Icon sets</li>
                    </ul>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-purple-900 mb-2">📊 Charts</h3>
                    <ul className="space-y-1 text-xs">
                      <li>Line: Trends</li>
                      <li>Column: Compare</li>
                      <li>Pie: Parts</li>
                    </ul>
                  </div>
                </div>
              )}
            </section>

            {/* Formulas */}
            <section id="formulas" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-orange-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Calculator className="w-6 h-6 text-orange-600" />
                    Formulas & Functions
                  </h2>
                  <p className="text-gray-600">Master Excel calculations</p>
                </div>
                <button onClick={() => toggleSection('formulas')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.formulas ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.formulas && (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-orange-600 text-white">
                          <th className="border p-3 text-left">Operation</th>
                          <th className="border p-3 text-center">Symbol</th>
                          <th className="border p-3 text-left">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-gray-50">
                          <td className="border p-3">Addition</td>
                          <td className="border p-3 text-center font-bold text-lg">+</td>
                          <td className="border p-3 font-mono text-xs">=A1 + B1</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Subtraction</td>
                          <td className="border p-3 text-center font-bold text-lg">-</td>
                          <td className="border p-3 font-mono text-xs">=A1 - B1</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border p-3">Multiplication</td>
                          <td className="border p-3 text-center font-bold text-lg">*</td>
                          <td className="border p-3 font-mono text-xs">=A1 * B1</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Division</td>
                          <td className="border p-3 text-center font-bold text-lg">/</td>
                          <td className="border p-3 font-mono text-xs">=A1 / B1</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border p-3">Exponent</td>
                          <td className="border p-3 text-center font-bold text-lg">^</td>
                          <td className="border p-3 font-mono text-xs">=A1 ^ 2</td>
                        </tr>
                        <tr>
                          <td className="border p-3">Percentage</td>
                          <td className="border p-3 text-center font-bold text-lg">%</td>
                          <td className="border p-3 font-mono text-xs">=A1 * 10%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {formulas.map((f, i) => (
                      <div key={i} className="bg-slate-50 p-4 rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-sm">{f.name}</h4>
                          <button onClick={() => copyFormula(f.code, i)} className="p-1 hover:bg-white rounded">
                            {copiedIndex === i ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <code className="block bg-slate-800 text-green-400 px-2 py-1 rounded text-xs mb-2">{f.code}</code>
                        <p className="text-xs text-gray-600">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Formula Tester */}
            <section id="tester" className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-6 border-l-4 border-teal-500">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                <Calculator className="w-6 h-6 text-teal-600" />
                Interactive Formula Tester
              </h2>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={expression}
                  onChange={(e) => setExpression(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && evaluateExpression()}
                  placeholder="(100 + 50) * 10% + 20"
                  className="w-full p-3 border-2 rounded-lg focus:border-teal-500 outline-none"
                />
                
                <div className="flex gap-3">
                  <button onClick={evaluateExpression} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-lg">
                    Calculate
                  </button>
                  <button onClick={() => { setExpression(''); setResult(null); }} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg">
                    Clear
                  </button>
                </div>

                {result && (
                  <div className="bg-teal-100 border-l-4 border-teal-600 p-4 rounded-lg">
                    <p className="font-bold text-teal-900">{result}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Practical Lab */}
            <section id="lab" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Lightbulb className="w-6 h-6 text-red-600" />
                    Practical Lab — TP1
                  </h2>
                  <p className="text-gray-600">Hands-on assignment</p>
                </div>
                <button onClick={() => toggleSection('lab')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.lab ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.lab && (
                <div className="space-y-4">
                  <div className="bg-red-50 p-5 rounded-xl">
                    <h3 className="font-semibold text-red-900 mb-3">📋 Tasks</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm">
                      <li>Create workbook: TP Excel (sheets: TP1-4)</li>
                      <li>Build 5×5 table with proper headers</li>
                      <li>Apply formatting (currency, percent)</li>
                      <li>Use conditional formatting</li>
                      <li>Create chart with SUM totals</li>
                    </ol>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold">Formulas</span>
                        <span className="text-lg font-bold text-purple-600">40%</span>
                      </div>
                      <p className="text-xs text-gray-600">Correct calculations</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold">Formatting</span>
                        <span className="text-lg font-bold text-pink-600">30%</span>
                      </div>
                      <p className="text-xs text-gray-600">Visual quality</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold">Validation</span>
                        <span className="text-lg font-bold text-blue-600">20%</span>
                      </div>
                      <p className="text-xs text-gray-600">Robustness</p>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm border">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-semibold">Documentation</span>
                        <span className="text-lg font-bold text-green-600">10%</span>
                      </div>
                      <p className="text-xs text-gray-600">Comments</p>
                    </div>
                  </div>
                </div>
              )}
            </section>

            {/* Resources */}
            <section id="resources" className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-indigo-500">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <BookOpen className="w-6 h-6 text-indigo-600" />
                    Resources
                  </h2>
                  <p className="text-gray-600">Essential links</p>
                </div>
                <button onClick={() => toggleSection('resources')} className="p-2 hover:bg-gray-100 rounded-lg">
                  {expandedSections.resources ? <ChevronUp /> : <ChevronDown />}
                </button>
              </div>

              {!expandedSections.resources && (
                <div className="space-y-3">
                  <a href="https://www.geeksforgeeks.org/excel/introduction-to-ms-excel/" target="_blank" rel="noopener noreferrer" 
                     className="block bg-indigo-50 p-4 rounded-lg hover:shadow-md border border-indigo-200">
                    <h3 className="font-semibold text-indigo-900 mb-1">GeeksforGeeks — Excel Intro</h3>
                    <p className="text-sm text-gray-600">Comprehensive tutorials</p>
                  </a>
                  <a href="https://support.microsoft.com/excel" target="_blank" rel="noopener noreferrer"
                     className="block bg-blue-50 p-4 rounded-lg hover:shadow-md border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-1">Microsoft Excel Support</h3>
                    <p className="text-sm text-gray-600">Official documentation</p>
                  </a>
                </div>
              )}
            </section>

            {/* Footer */}
            <div className="text-center py-8 border-t-4 border-emerald-500">
              <p className="text-gray-600 mb-2">© 2025 Excel Masterclass</p>
              <p className="text-sm text-gray-500">UMKB ICT Module | Instructor: Dr. Zineb Djihane Agli</p>
              <p className="text-xs text-gray-400 mt-2">Designed for 500+ L1 English students</p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
