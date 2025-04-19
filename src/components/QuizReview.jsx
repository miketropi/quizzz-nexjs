import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { RefreshCcw, MousePointerClick, Edit, Trash, Plus, ArrowUp, ArrowDown, Save, X, Toggle, Clock, Eye } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
 
export default function QuizReview({ quiz, updateQuiz, saveQuiz, mode }) {
  const t = useTranslations('quizCreate');
  const [editMode, setEditMode] = useState(mode === 'edit' ? true : false);
  const [editedQuiz, setEditedQuiz] = useState(quiz);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Update editedQuiz when quiz changes
  useEffect(() => {
    if (!editMode) {
      setEditedQuiz(quiz);
    }
  }, [quiz, editMode]);

  // Handler for toggling edit mode
  const toggleEditMode = () => {
    setEditMode(!editMode);
    setEditedQuiz({...quiz});
    setEditingQuestionId(null);
  };

  // Handler for saving changes
  const handleSaveChanges = () => {
    updateQuiz(editedQuiz);

    if (mode !== 'edit') {
      setEditMode(false);
    }

    toast.success(t('quizUpdatedSuccessfully'), 3000);
  };

  // Handler for updating quiz title and description
  const updateQuizDetails = (field, value) => {
    setEditedQuiz({
      ...editedQuiz,
      [field]: value
    });
  };

  // Handler for updating a question
  const updateQuestion = (questionId, field, value) => {
    setEditedQuiz({
      ...editedQuiz,
      questions: editedQuiz.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    });
  };

  // Handler for updating an option
  const updateOption = (questionId, optionKey, value) => {
    setEditedQuiz({
      ...editedQuiz,
      questions: editedQuiz.questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            options: {
              ...q.options,
              [optionKey]: value
            }
          };
        }
        return q;
      })
    });
  };

  // Handler for changing correct answer
  const updateCorrectAnswer = (questionId, optionKey) => {
    setEditedQuiz({
      ...editedQuiz,
      questions: editedQuiz.questions.map(q =>
        q.id === questionId ? { ...q, correctAnswer: optionKey } : q
      )
    });
  };

  // Handler for deleting a question
  const deleteQuestion = (questionId) => {
    setEditedQuiz({
      ...editedQuiz,
      questions: editedQuiz.questions.filter(q => q.id !== questionId)
    });
  };

  // Handler for adding a new question
  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      question: "New question",
      options: { 
        A: "Option A", 
        B: "Option B", 
        C: "Option C", 
        D: "Option D" 
      },
      correctAnswer: "A",
      explanation: "Explanation for the correct answer"
    };
    
    setEditedQuiz({
      ...editedQuiz,
      questions: [...editedQuiz.questions, newQuestion]
    });
    
    setEditingQuestionId(newQuestion.id);
  };

  // Handler for reordering questions
  const reorderQuestion = (index, direction) => {
    if (
      (direction === "up" && index === 0) || 
      (direction === "down" && index === editedQuiz.questions.length - 1)
    ) {
      return;
    }

    const newQuestions = [...editedQuiz.questions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    
    setEditedQuiz({
      ...editedQuiz,
      questions: newQuestions
    });
  };

  return (
    <div className="bg-white rounded-lg p-6 my-6 border border-gray-200">
      
      { /** document user guide for edit mode */ }
      <div className="bg-blue-100 border border-blue-300 rounded-lg p-5 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-blue-500 rounded-full p-1.5 mt-0.5">
            <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-blue-800 font-bold mb-1">{ t('editModeDocumentTitle') }</h3>
            <div className="text-blue-700 text-sm leading-relaxed">
              {isClient && (
                <div dangerouslySetInnerHTML={{ __html: t.raw('editModeDocument') }}></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Mode Toggle Banner */}
      {
        mode !== 'edit' && <>
          <div className={`mb-4 p-3 rounded-lg flex justify-between items-center ${editMode ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${editMode ? 'bg-blue-500' : 'bg-gray-400'}`}></div>
              <span className={`font-medium text-xs ${editMode ? 'text-blue-700' : 'text-gray-700'}`}>
                {editMode ? t('editModeOn') : t('editModeOff')}
              </span>
            </div>
            <button 
              type="button" 
              onClick={toggleEditMode}
              className={`px-4 py-2 text-xs rounded-lg transition-colors flex items-center ${
                editMode 
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 border border-blue-300' 
                  : 'bg-orange-100 text-orange-800 hover:bg-orange-200 border-1 border-orange-300 font-semibold'
              }`}
            >
              {editMode ? (
                <>
                  <X className="w-4 h-4 mr-2" /> 
                  { t('exitEditMode') }
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" /> 
                  { t('editQuiz') }
                </>
              )}
            </button>
          </div>
        </>
      
      }

      <div className="flex justify-between items-center mb-6">
        <div className="flex-1">
          {editMode ? (
            <div className="space-y-3">
              <input 
                type="text" 
                value={editedQuiz.title} 
                onChange={(e) => updateQuizDetails('title', e.target.value)}
                className="w-full text-2xl font-bold text-gray-800 border-b border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <textarea 
                value={editedQuiz.description} 
                onChange={(e) => updateQuizDetails('description', e.target.value)}
                className="w-full text-gray-600 border-b border-gray-300 focus:outline-none focus:border-blue-500 mt-4"
                rows={2}
              />
              
              {/* Quiz Settings Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 pt-4 border-t border-gray-200">
                {/* Status Selection */}
                <div className="flex flex-col">
                  <label htmlFor="quizStatus" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Status
                  </label>
                  <select
                    id="quizStatus"
                    value={editedQuiz.status || 'draft'}
                    onChange={(e) => updateQuizDetails('status', e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                
                {/* Time Limit */}
                <div className="flex flex-col">
                  <label htmlFor="quizTimeLimit" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Time Limit (seconds, 0 for no limit)
                  </label>
                  <input
                    id="quizTimeLimit"
                    type="number"
                    min="0"
                    value={editedQuiz.limitTime || 0}
                    onChange={(e) => updateQuizDetails('limitTime', e.target.value === '0' ? null : parseInt(e.target.value, 10) || 0)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {editedQuiz.limitTime ? `${Math.floor(editedQuiz.limitTime / 60)}m ${editedQuiz.limitTime % 60}s` : 'No time limit'}
                  </p>

                  {/** preset time limit options 5 minutes, 10 minutes, 15 minutes, 20 minutes, 25 minutes, 30 minutes */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <button 
                      type="button" 
                      onClick={() => updateQuizDetails('limitTime', 300)}
                      className={`px-3 py-1 rounded-full text-xs font-medium  ${editedQuiz.limitTime === 300 ? 'bg-blue-500 text-white' : ' bg-gray-100 text-gray-800'}`}
                    >
                      5 minutes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => updateQuizDetails('limitTime', 600)}
                      className={`px-3 py-1 rounded-full text-xs font-medium  ${editedQuiz.limitTime === 600 ? 'bg-blue-500 text-white' : ' bg-gray-100 text-gray-800'}`}
                    >
                      10 minutes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => updateQuizDetails('limitTime', 900)}
                      className={`px-3 py-1 rounded-full text-xs font-medium  ${editedQuiz.limitTime === 900 ? 'bg-blue-500 text-white' : ' bg-gray-100 text-gray-800'}`}
                    >
                      15 minutes
                    </button>
                  </div>
                  
                </div>


              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-800">{quiz.title} ({quiz.questions.length} {t('questions')})</h2>
              <p className="text-gray-600 mt-2">{quiz.description}</p>
              
              {/* Display Quiz Settings when not in edit mode */}
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Eye className="w-3 h-3 mr-1" />
                  Status: {quiz.status || 'Draft'}
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Clock className="w-3 h-3 mr-1" />
                  Time: {quiz.limitTime ? `${Math.floor(quiz.limitTime / 60)}m ${quiz.limitTime % 60}s` : 'No limit'}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="space-y-8">
        {(editMode ? editedQuiz.questions : quiz.questions).map((question, index) => (
          <div key={question.id} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${editMode ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                {editMode && editingQuestionId === question.id ? (
                  <input
                    type="text" 
                    value={question.question}
                    onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                    className="w-full text-lg font-semibold border-b border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <h3 className="text-lg font-semibold">
                    <span className={`${editMode ? 'bg-blue-500' : 'bg-blue-600'} text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2`}>
                      {index + 1}
                    </span>
                    {question.question}
                  </h3>
                )}
              </div>
              
              {editMode && (
                <div className="flex space-x-2">
                  <button 
                    type="button"
                    onClick={() => setEditingQuestionId(editingQuestionId === question.id ? null : question.id)}
                    className="p-1 rounded-full hover:bg-blue-200 bg-blue-100 text-blue-700"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => deleteQuestion(question.id)}
                    className="p-1 rounded-full hover:bg-red-200 bg-red-100 text-red-600"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => reorderQuestion(index, "up")}
                    disabled={index === 0}
                    className={`p-1 rounded-full ${index === 0 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'hover:bg-blue-200 bg-blue-100 text-blue-700'}`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => reorderQuestion(index, "down")}
                    disabled={index === editedQuiz.questions.length - 1}
                    className={`p-1 rounded-full ${index === editedQuiz.questions.length - 1 ? 'text-gray-300 bg-gray-100 cursor-not-allowed' : 'hover:bg-blue-200 bg-blue-100 text-blue-700'}`}
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {Object.entries(question.options).map(([key, value]) => (
                <div key={key} className="flex items-start">
                  <div className={`flex items-center h-5 ${editMode ? 'cursor-pointer' : ''}`}>
                    <input
                      id={`${question.id}-${key}`}
                      name={`question-${question.id}`}
                      type="radio"
                      className={`h-4 w-4 border-gray-300 ${editMode ? 'text-blue-500 focus:ring-blue-500 cursor-pointer' : 'text-blue-600 focus:ring-blue-500'}`}
                      disabled={!editMode}
                      checked={key === question.correctAnswer}
                      onChange={() => editMode && updateCorrectAnswer(question.id, key)}
                    />
                  </div>
                  {editMode && editingQuestionId === question.id ? (
                    <input 
                      type="text"
                      value={value}
                      onChange={(e) => updateOption(question.id, key, e.target.value)}
                      className="ml-2 w-full text-sm border-b border-gray-300 focus:outline-none focus:border-blue-500"
                    />
                  ) : (
                    <label 
                      htmlFor={`${question.id}-${key}`} 
                      className={`ml-2 block text-sm ${key === question.correctAnswer ? 'text-green-700 font-medium' : 'text-gray-700'}`}
                    >
                      <span className="font-medium">{key}:</span> {value}
                    </label>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="text-sm">
                <div className={`font-medium mb-2 ${editMode ? 'text-blue-700' : 'text-blue-600'}`}>
                  {t('explanation')}
                </div>
                {editMode && editingQuestionId === question.id ? (
                  <textarea
                    value={question.explanation}
                    onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                    className="w-full p-3 bg-blue-50 rounded-md text-gray-700 border border-blue-100 focus:outline-none focus:border-blue-300"
                    rows={3}
                  />
                ) : (
                  <div className="bg-blue-50 p-3 rounded-md">
                    <p className="text-gray-700">{question.explanation}</p>
                  </div>
                )}
              </div> 
            </div>
          </div> 
        ))}
      </div>
      
      {editMode && (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={addQuestion}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Question
          </button>
        </div>
      )}
      
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm shadow-lg p-4 border-t border-gray-200 z-50">
        <div className="container mx-auto max-w-[900px] flex flex-col sm:flex-row justify-between gap-3">
          {editMode ? (
            <>
              {
                mode !== 'edit' && (
                  <button 
                    type="button"
                    onClick={toggleEditMode}
                    className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer text-xs"
                    aria-label="Cancel editing"
                  >
                    <span className="mr-2">
                      <X className="w-4 h-4" />
                    </span>
                    Cancel
                  </button>
                )
              }

              <button 
                type="button"
                onClick={handleSaveChanges}
                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer text-xs ml-auto"
                aria-label="Save changes"  
              >
                <span className="mr-2">
                  <Save className="w-4 h-4" />
                </span>
                Save Changes
              </button>
            </>
          ) : (
            <>
              <button 
                type="button"
                onClick={e => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center cursor-pointer text-xs font-bold"
                aria-label="Create another quiz"
              >
                <span className="mr-2">
                  <RefreshCcw className="w-4 h-4" />
                </span>
                {t('createAnotherQuiz')}
              </button>

              <button 
                type="button"
                onClick={e => {
                  e.preventDefault();
                  saveQuiz();

                  // redirect to dashboard page
                  // router.push(`/${locale}/dashboard`);
                }}
                className="w-full sm:w-auto px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer text-xs font-bold"
                aria-label="Use this quiz data"  
              >
                <span className="mr-2">
                  <MousePointerClick className="w-4 h-4" />
                </span>
                {t('useThisQuizData')}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="pb-2">
        {/* Spacer to prevent content from being hidden behind the fixed footer */}
      </div>
    </div>
  );
} 