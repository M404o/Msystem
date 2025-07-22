import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Calendar, Mail, Clock, CheckCircle, XCircle, AlertCircle, Eye, ChevronLeft, Copy, Target, MessageSquare, CalendarDays } from 'lucide-react';

const EmailTracker = () => {
  const [companies, setCompanies] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '',
    sentDate: '',
    emailCount: 1,
    status: 'waiting',
    lastResponse: '',
    notes: '',
    strategy: '',
    emails: [],
    nextAction: '',
    nextActionDate: ''
  });

  // ローカルストレージからデータを読み込み
  useEffect(() => {
    const saved = localStorage.getItem('emailTracker');
    if (saved) {
      setCompanies(JSON.parse(saved));
    } else {
      // サンプルデータ
      const sampleData = [
        {
          id: 1,
          name: 'CultureAmp',
          sentDate: '2025-07-15',
          emailCount: 1,
          status: 'replied',
          lastResponse: 'サポート担当に伝えますの返事あり',
          notes: '',
          strategy: 'エンゲージメント測定の分野でトップ企業。従業員体験の改善に注力している。',
          emails: [
            {
              id: 1,
              date: '2025-07-15',
              subject: 'Proactive wellbeing signals you can\'t see in engagement scores',
              content: 'Hi Culture Amp team,\n\nI\'ve developed a diagnostic tool called Mindscape that surfaces "pre-burnout" signals...',
              response: 'サポート担当に伝えます'
            }
          ],
          nextAction: 'フォローアップメールを送信',
          nextActionDate: '2025-07-25'
        },
        {
          id: 2,
          name: 'Greenhouse',
          sentDate: '2025-07-16',
          emailCount: 1,
          status: 'waiting',
          lastResponse: '',
          notes: '',
          strategy: '採用プロセス最適化のリーディングカンパニー。候補者体験の向上に注力。',
          emails: [
            {
              id: 1,
              date: '2025-07-16',
              subject: 'Enhanced candidate assessment for better hiring decisions',
              content: 'Hello Greenhouse team,\n\nI wanted to share an innovative diagnostic solution...',
              response: ''
            }
          ],
          nextAction: 'フォローアップを検討',
          nextActionDate: '2025-07-23'
        },
        {
          id: 3,
          name: '15Five',
          sentDate: '2025-07-17',
          emailCount: 1,
          status: 'no_response',
          lastResponse: '',
          notes: '',
          strategy: '継続的なフィードバックとパフォーマンス管理に特化。チーム成長支援が強み。',
          emails: [
            {
              id: 1,
              date: '2025-07-17',
              subject: 'Continuous team insights beyond weekly check-ins',
              content: 'Hi 15Five team,\n\nI\'ve created a diagnostic that complements your continuous feedback approach...',
              response: ''
            }
          ],
          nextAction: '1週間後に再送信',
          nextActionDate: '2025-07-24'
        }
      ];
      setCompanies(sampleData);
      localStorage.setItem('emailTracker', JSON.stringify(sampleData));
    }
  }, []);

  // データをローカルストレージに保存
  const saveData = (data) => {
    localStorage.setItem('emailTracker', JSON.stringify(data));
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.sentDate) return;
    
    if (editingId) {
      const updated = companies.map(company => 
        company.id === editingId ? { ...formData, id: editingId } : company
      );
      setCompanies(updated);
      saveData(updated);
    } else {
      const newCompany = {
        ...formData,
        id: Date.now(),
        emails: []
      };
      const updated = [...companies, newCompany];
      setCompanies(updated);
      saveData(updated);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sentDate: '',
      emailCount: 1,
      status: 'waiting',
      lastResponse: '',
      notes: '',
      strategy: '',
      emails: [],
      nextAction: '',
      nextActionDate: ''
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (company) => {
    setFormData(company);
    setEditingId(company.id);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    const updated = companies.filter(company => company.id !== id);
    setCompanies(updated);
    saveData(updated);
    setSelectedCompany(null);
  };

  const handleViewDetails = (company) => {
    setSelectedCompany(company);
    setActiveTab('basic');
  };

  const addEmail = (companyId, email) => {
    const updated = companies.map(company => {
      if (company.id === companyId) {
        return {
          ...company,
          emails: [...(company.emails || []), { ...email, id: Date.now() }]
        };
      }
      return company;
    });
    setCompanies(updated);
    saveData(updated);
    if (selectedCompany && selectedCompany.id === companyId) {
      setSelectedCompany(updated.find(c => c.id === companyId));
    }
  };

  const updateCompany = (companyId, updates) => {
    const updated = companies.map(company => 
      company.id === companyId ? { ...company, ...updates } : company
    );
    setCompanies(updated);
    saveData(updated);
    if (selectedCompany && selectedCompany.id === companyId) {
      setSelectedCompany(updated.find(c => c.id === companyId));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'replied': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'waiting': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'no_response': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'follow_up': return <AlertCircle className="w-5 h-5 text-blue-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'replied': return '返事あり';
      case 'waiting': return '待機中';
      case 'no_response': return '未返信';
      case 'follow_up': return 'フォローアップ予定';
      default: return '不明';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'replied': return 'bg-green-100 border-green-300';
      case 'waiting': return 'bg-yellow-100 border-yellow-300';
      case 'no_response': return 'bg-red-100 border-red-300';
      case 'follow_up': return 'bg-blue-100 border-blue-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  // 詳細画面の表示
  if (selectedCompany) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <button
              onClick={() => setSelectedCompany(null)}
              className="flex items-center gap-2 text-purple-600 hover:text-purple-800 font-medium mb-4"
            >
              <ChevronLeft className="w-5 h-5" />
              ダッシュボードに戻る
            </button>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{selectedCompany.name}</h1>
            <div className="flex items-center gap-2">
              {getStatusIcon(selectedCompany.status)}
              <span className="font-medium">{getStatusText(selectedCompany.status)}</span>
            </div>
          </div>

          {/* タブナビ */}
          <div className="bg-white rounded-lg shadow-md border border-purple-200 mb-6">
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('basic')}
                className={`px-6 py-3 font-medium ${activeTab === 'basic' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                基本情報
              </button>
              <button
                onClick={() => setActiveTab('strategy')}
                className={`px-6 py-3 font-medium ${activeTab === 'strategy' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                戦略メモ
              </button>
              <button
                onClick={() => setActiveTab('emails')}
                className={`px-6 py-3 font-medium ${activeTab === 'emails' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                メール履歴
              </button>
              <button
                onClick={() => setActiveTab('actions')}
                className={`px-6 py-3 font-medium ${activeTab === 'actions' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600'}`}
              >
                次のアクション
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">送信日</label>
                      <input
                        type="date"
                        value={selectedCompany.sentDate}
                        onChange={(e) => updateCompany(selectedCompany.id, { sentDate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">メール回数</label>
                      <input
                        type="number"
                        value={selectedCompany.emailCount}
                        onChange={(e) => updateCompany(selectedCompany.id, { emailCount: parseInt(e.target.value) || 1 })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        min="1"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">現在の状態</label>
                    <select
                      value={selectedCompany.status}
                      onChange={(e) => updateCompany(selectedCompany.id, { status: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    >
                      <option value="waiting">待機中</option>
                      <option value="replied">返事あり</option>
                      <option value="no_response">未返信</option>
                      <option value="follow_up">フォローアップ予定</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">最後の返事内容</label>
                    <textarea
                      value={selectedCompany.lastResponse}
                      onChange={(e) => updateCompany(selectedCompany.id, { lastResponse: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows="3"
                      placeholder="最後に受け取った返事の内容..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">メモ</label>
                    <textarea
                      value={selectedCompany.notes || ''}
                      onChange={(e) => updateCompany(selectedCompany.id, { notes: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg"
                      rows="3"
                      placeholder="その他のメモ..."
                    />
                  </div>
                </div>
              )}

              {activeTab === 'strategy' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">企業戦略・アプローチ方法</h3>
                  </div>
                  <textarea
                    value={selectedCompany.strategy || ''}
                    onChange={(e) => updateCompany(selectedCompany.id, { strategy: e.target.value })}
                    className="w-full p-4 border border-gray-300 rounded-lg"
                    rows="8"
                    placeholder="なぜこの企業を選んだか、どんなアプローチをするか、企業の特徴、狙い目のポイントなど..."
                  />
                </div>
              )}

              {activeTab === 'emails' && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-purple-500" />
                      <h3 className="text-lg font-semibold">メール履歴</h3>
                    </div>
                    <button
                      onClick={() => {
                        const subject = prompt('件名を入力してください:');
                        const content = prompt('メール内容を入力してください:');
                        if (subject && content) {
                          addEmail(selectedCompany.id, {
                            date: new Date().toISOString().split('T')[0],
                            subject,
                            content,
                            response: ''
                          });
                        }
                      }}
                      className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      メール追加
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {(selectedCompany.emails || []).map((email, index) => (
                      <div key={email.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-800">#{index + 1} - {email.date}</h4>
                          <button
                            onClick={() => copyToClipboard(email.content)}
                            className="text-gray-500 hover:text-purple-600"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="font-medium text-sm text-gray-700 mb-2">件名: {email.subject}</p>
                        <div className="bg-gray-50 p-3 rounded-lg mb-3">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700">{email.content}</pre>
                        </div>
                        {email.response && (
                          <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-sm font-medium text-green-800 mb-1">返事:</p>
                            <p className="text-sm text-green-700">{email.response}</p>
                          </div>
                        )}
                      </div>
                    ))}
                    
                    {(!selectedCompany.emails || selectedCompany.emails.length === 0) && (
                      <p className="text-gray-500 text-center py-8">まだメールが記録されていません</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'actions' && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <CalendarDays className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold">次のアクション</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">予定しているアクション</label>
                      <textarea
                        value={selectedCompany.nextAction || ''}
                        onChange={(e) => updateCompany(selectedCompany.id, { nextAction: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                        rows="3"
                        placeholder="次に何をするか（フォローアップメール送信、電話、など）"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">実行予定日</label>
                      <input
                        type="date"
                        value={selectedCompany.nextActionDate || ''}
                        onChange={(e) => updateCompany(selectedCompany.id, { nextActionDate: e.target.value })}
                        className="w-full p-3 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => handleDelete(selectedCompany.id)}
              className="text-red-500 hover:text-red-700 font-medium"
            >
              この企業を削除
            </button>
          </div>
        </div>
      </div>
    );
  }

  // メインダッシュボード
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📧 企業メール追跡ダッシュボード</h1>
          <p className="text-gray-600">診断システムの提案状況を一目で管理✨</p>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-md border border-purple-200">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-purple-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">総企業数</p>
                <p className="text-2xl font-bold text-gray-800">{companies.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border border-green-200">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">返事あり</p>
                <p className="text-2xl font-bold text-gray-800">
                  {companies.filter(c => c.status === 'replied').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border border-yellow-200">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-yellow-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">待機中</p>
                <p className="text-2xl font-bold text-gray-800">
                  {companies.filter(c => c.status === 'waiting').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4 shadow-md border border-red-200">
            <div className="flex items-center">
              <XCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">未返信</p>
                <p className="text-2xl font-bold text-gray-800">
                  {companies.filter(c => c.status === 'no_response').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 追加ボタン */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            新しい企業を追加
          </button>
        </div>

        {/* フォーム */}
        {showForm && (
          <div className="bg-white rounded-lg p-6 shadow-md mb-6 border border-purple-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              {editingId ? '企業情報を編集' : '新しい企業を追加'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">企業名</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="CultureAmp"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">送信日</label>
                <input
                  type="date"
                  value={formData.sentDate}
                  onChange={(e) => setFormData({...formData, sentDate: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">現在の状態</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="waiting">待機中</option>
                  <option value="replied">返事あり</option>
                  <option value="no_response">未返信</option>
                  <option value="follow_up">フォローアップ予定</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">最後の返事内容</label>
                <input
                  type="text"
                  value={formData.lastResponse}
                  onChange={(e) => setFormData({...formData, lastResponse: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="サポート担当に伝えますの返事あり"
                />
              </div>
              
              <div className="md:col-span-2 flex gap-3">
                <button
                  onClick={handleSubmit}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  {editingId ? '更新' : '追加'}
                </button>
                <button
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 企業リスト */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company.id}
              className={`bg-white rounded-lg p-6 shadow-md border-2 ${getStatusColor(company.status)} transition-all hover:shadow-lg`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getStatusIcon(company.status)}
                  <h3 className="text-lg font-semibold text-gray-800">{company.name}</h3>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(company)}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEdit(company)}
                    className="text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">送信日: {company.sentDate}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">{company.emailCount}回目のメール</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {getStatusIcon(company.status)}
                  <span className="font-medium">{getStatusText(company.status)}</span>
                </div>
                
                {company.lastResponse && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{company.lastResponse}</p>
                  </div>
                )}
                
                {company.nextAction && company.nextActionDate && (
                  <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                    <p className="font-medium text-blue-800">次のアクション:</p>
                    <p className="text-blue-700">{company.nextAction}</p>
                    <p className="text-blue-600">{company.nextActionDate}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">まだ企業が追加されていません</p>
            <p className="text-gray-400">上の「新しい企業を追加」ボタンから始めましょう！</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailTracker;
