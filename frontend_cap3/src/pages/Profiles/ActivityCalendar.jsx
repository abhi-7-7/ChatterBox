import React, { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Flame, Search, X, Save, FileText } from "lucide-react";
import { notesAPI } from "../../services/api";

const ActivityCalendar = ({ loginDays = [], currentStreak = 0, currentTheme = {} }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteContent, setNoteContent] = useState('');
  const [notes, setNotes] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const textareaRef = useRef(null);
  const saveTimeoutRef = useRef(null);

  const calendarData = useMemo(() => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const weeks = [];
    let currentWeek = new Array(7).fill(null);

    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (startingDayOfWeek + day - 1) % 7;
      if (dayOfWeek === 0 && day !== 1) {
        weeks.push(currentWeek);
        currentWeek = new Array(7).fill(null);
      }
      currentWeek[dayOfWeek] = day;
    }
    weeks.push(currentWeek);
    return weeks;
  }, [selectedMonth]);

  const loggedSet = useMemo(() => {
    const s = new Set();
    (loginDays || []).forEach((d) => {
      try { s.add(new Date(d).toDateString()); } catch { /* empty */ }
    });
    return s;
  }, [loginDays]);

  const isLoggedIn = (day) => {
    if (!day) return false;
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const dateStr = new Date(year, month, day).toDateString();
    return loggedSet.has(dateStr);
  };

  const isToday = (day) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedMonth.getMonth() === today.getMonth() &&
      selectedMonth.getFullYear() === today.getFullYear()
    );
  };

  const nextMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
  const prevMonth = () => setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));

  const monthName = selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  // Load notes for current month
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const year = selectedMonth.getFullYear();
        const month = selectedMonth.getMonth() + 1;
        const res = await notesAPI.getNotesByMonth(year, month);
        
        const notesMap = {};
        res.data.notes.forEach(note => {
          const dateKey = new Date(note.date).toDateString();
          notesMap[dateKey] = note.content;
        });
        setNotes(notesMap);
      } catch (error) {
        console.error('Failed to load notes:', error);
      }
    };
    
    loadNotes();
  }, [selectedMonth]);

  // Autosave with debouncing
  const autoSave = useCallback(async (date, content) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        setSaveStatus('Saving...');
        
        const year = new Date(date).getFullYear();
        const month = new Date(date).getMonth();
        const day = new Date(date).getDate();
        const noteDate = new Date(year, month, day);
        
        await notesAPI.upsertNote({
          date: noteDate.toISOString(),
          content
        });
        
        // Update local notes
        const dateKey = noteDate.toDateString();
        setNotes(prev => ({
          ...prev,
          [dateKey]: content
        }));
        
        setSaveStatus('Saved');
        setTimeout(() => setSaveStatus(''), 2000);
      } catch (error) {
        console.error('Failed to save note:', error);
        setSaveStatus('Error saving');
      } finally {
        setIsSaving(false);
      }
    }, 1000); // 1 second debounce
  }, []);

  // Handle note change
  const handleNoteChange = (e) => {
    const content = e.target.value;
    setNoteContent(content);
    if (selectedDate) {
      autoSave(selectedDate, content);
    }
  };

  // Open note for a specific date
  const openNote = async (day) => {
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const noteDate = new Date(year, month, day);
    setSelectedDate(noteDate);
    
    const dateKey = noteDate.toDateString();
    setNoteContent(notes[dateKey] || '');
    
    // Focus textarea
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  // Close note panel
  const closeNote = () => {
    setSelectedDate(null);
    setNoteContent('');
  };

  // Manual save (Ctrl/Cmd + S)
  const handleManualSave = async () => {
    if (selectedDate && noteContent) {
      await autoSave(selectedDate, noteContent);
    }
  };

  // Delete note
  const handleDeleteNote = async () => {
    if (!selectedDate) return;
    
    try {
      const year = selectedDate.getFullYear();
      const month = selectedDate.getMonth();
      const day = selectedDate.getDate();
      const noteDate = new Date(year, month, day);
      
      await notesAPI.deleteNote(noteDate.toISOString().split('T')[0]);
      
      const dateKey = noteDate.toDateString();
      setNotes(prev => {
        const newNotes = { ...prev };
        delete newNotes[dateKey];
        return newNotes;
      });
      
      closeNote();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  // Search notes
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const res = await notesAPI.searchNotes(query);
      setSearchResults(res.data.notes || []);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  // Jump to searched date
  const jumpToDate = (note) => {
    const noteDate = new Date(note.date);
    setSelectedMonth(new Date(noteDate.getFullYear(), noteDate.getMonth()));
    setShowSearch(false);
    setSearchQuery('');
    setSearchResults([]);
    
    setTimeout(() => {
      openNote(noteDate.getDate());
    }, 100);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e) => {
      // Escape - close notes or search
      if (e.key === 'Escape') {
        if (showSearch) {
          setShowSearch(false);
          setSearchQuery('');
          setSearchResults([]);
        } else if (selectedDate) {
          closeNote();
        }
      }
      
      // Ctrl/Cmd + S - save
      if ((e.ctrlKey || e.metaKey) && e.key === 's' && selectedDate) {
        e.preventDefault();
        handleManualSave();
      }
      
      // Ctrl/Cmd + F - search
      if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
        e.preventDefault();
        setShowSearch(true);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [selectedDate, showSearch, handleManualSave]);

  // Check if date has notes
  const hasNotes = (day) => {
    if (!day) return false;
    const year = selectedMonth.getFullYear();
    const month = selectedMonth.getMonth();
    const dateKey = new Date(year, month, day).toDateString();
    return !!notes[dateKey];
  };

  return (
    <div className="relative">
      <div className={`${currentTheme.surface} rounded-[20px] border ${currentTheme.border} shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] h-full flex flex-col p-8`}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`text-lg font-bold tracking-tight ${currentTheme.text}`}>Activity Log</h3>
            <p className="text-xs font-medium text-slate-400 mt-1">Daily login history & notes</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
              aria-label="Search notes"
              title="Search notes (Ctrl+F)"
            >
              <Search className="w-4 h-4" />
            </button>
            
            <div className="flex items-center gap-1">
              <button 
                onClick={prevMonth} 
                className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-slate-600 transition-all"
                aria-label="Previous month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold text-slate-600 w-[100px] text-center uppercase tracking-wider">{monthName}</span>
              <button 
                onClick={nextMonth} 
                className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-slate-600 transition-all"
                aria-label="Next month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Panel */}
        {showSearch && (
          <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-blue-600" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search notes..."
                className="flex-1 px-3 py-2 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <button
                onClick={() => {
                  setShowSearch(false);
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                className="p-2 hover:bg-blue-100 rounded-lg text-blue-600"
                aria-label="Close search"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {searchResults.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {searchResults.map((note) => (
                  <button
                    key={note.id}
                    onClick={() => jumpToDate(note)}
                    className="w-full text-left p-2 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <div className="text-xs font-bold text-blue-800">
                      {new Date(note.date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </div>
                    <div className="text-xs text-blue-600 truncate">{note.content}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-7 mb-3">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center font-bold text-slate-400 uppercase tracking-widest py-2" style={{ fontSize: '14px' }}>
                {d}
              </div>
            ))}
          </div>

          <div className="space-y-2">
            {calendarData.map((week, wi) => (
              <div key={wi} className="grid grid-cols-7 gap-2">
                {week.map((day, di) => {
                  if (!day) return <div key={di} className="aspect-square" />;
                  
                  const logged = isLoggedIn(day);
                  const today = isToday(day);
                  const hasNote = hasNotes(day);
                  
                  let cellClass = "bg-slate-50/50 text-slate-300"; // Inactive
                  
                  if (logged) {
                    cellClass = "bg-emerald-500 text-white shadow-sm shadow-emerald-200 ring-2 ring-emerald-500 ring-offset-1";
                  } else if (today) {
                    cellClass = "bg-white text-blue-600 ring-2 ring-blue-500 ring-offset-2 font-bold z-10 shadow-lg shadow-blue-100";
                  }

                  return (
                    <div key={di} className="aspect-square flex items-center justify-center relative">
                      {today && (
                        <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse" 
                             style={{ 
                               animation: 'pulse 2s cubic-bezier(0, 0, 0.6, 1) infinite',
                               boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)'
                             }} 
                        />
                      )}
                      <button
                        onClick={() => openNote(day)}
                        className={`
                          w-9 h-9 flex items-center justify-center 
                          rounded-lg font-bold 
                          transition-all duration-200 cursor-pointer
                          hover:scale-110 hover:shadow-md
                          relative z-10
                          ${cellClass}
                        `}
                        style={{ fontSize: '18px' }}
                        aria-label={`${day}${hasNote ? ' (has note)' : ''}`}
                        title={hasNote ? 'Has note - click to view' : 'Click to add note'}
                      >
                        {day}
                        {hasNote && (
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full border border-white animate-pulse" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded bg-emerald-500" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Active</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2.5 h-2.5 rounded bg-slate-100" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Inactive</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-500 border border-white" />
                 <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Has Note</span>
               </div>
             </div>

             <div className="flex items-center gap-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Streak</p>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-600 border border-orange-100">
                  <Flame className="w-3.5 h-3.5 fill-orange-500" />
                  <span className="text-xs font-bold">{currentStreak} Days</span>
                </div>
             </div>
        </div>
      </div>

      {/* Notes Panel Overlay */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
             onClick={closeNote}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
               onClick={(e) => e.stopPropagation()}
               role="dialog"
               aria-labelledby="note-dialog-title"
               aria-modal="true">
            {/* Panel Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FileText className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 id="note-dialog-title" className="text-lg font-semibold text-slate-800">
                    Note for {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h3>
                  {isLoggedIn(selectedDate.getDate()) && (
                    <span className="text-xs text-emerald-600 font-medium">
                      ✓ You logged in this day
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={closeNote}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                aria-label="Close notes panel"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Textarea */}
            <div className="flex-1 p-6 overflow-y-auto">
              <textarea
                ref={textareaRef}
                value={noteContent}
                onChange={handleNoteChange}
                placeholder="Write your note here... (auto-saves after 1 second)"
                className="w-full h-full min-h-[300px] p-4 bg-slate-50 rounded-lg border border-slate-200 
                           focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent
                           resize-none font-mono text-sm text-slate-700 placeholder-slate-400"
                aria-label="Note content"
              />
            </div>

            {/* Panel Footer */}
            <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                {isSaving && (
                  <span className="text-sm text-slate-600 flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-sm text-emerald-600 flex items-center gap-1">
                    <Save className="w-4 h-4" />
                    Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-sm text-red-600">
                    Error saving note
                  </span>
                )}
              </div>
              <div className="flex gap-3">
                {noteContent && (
                  <button
                    onClick={handleDeleteNote}
                    className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    Delete Note
                  </button>
                )}
                <button
                  onClick={handleManualSave}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium
                             flex items-center gap-2"
                  aria-label="Save note manually"
                >
                  <Save className="w-4 h-4" />
                  Save Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityCalendar;
