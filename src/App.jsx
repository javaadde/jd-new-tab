
import React, { useState, useEffect } from "react";
import './App.css';

import { TodoList, Bookmarks, GoogleApps, SearchEngine, Clock, AiTools } from './components';
import { searchEngines } from './components/searchEngines';

function App() {
  const [bookmarks, setBookmarks] = useState([]);

  // Fetch bookmarks when component mounts
  useEffect(() => {
    console.log('Chrome object:', typeof chrome !== "undefined" ? "Available" : "Not available");
    console.log('Chrome bookmarks API:', typeof chrome !== "undefined" && chrome.bookmarks ? "Available" : "Not available");

    const fetchBookmarks = () => {
      if (typeof chrome !== "undefined" && chrome.bookmarks) {
        console.log('Attempting to fetch bookmarks...');
        
        // First try getRecent
        chrome.bookmarks.getRecent(20, (recent) => {
          console.log('Recent bookmarks:', recent);
          if (recent && recent.length > 0) {
            const formattedBookmarks = recent.map(bookmark => ({
              id: bookmark.id,
              title: bookmark.title || new URL(bookmark.url).hostname,
              url: bookmark.url
            }));
            console.log('Setting recent bookmarks:', formattedBookmarks);
            setBookmarks(formattedBookmarks);
          } else {
            // If no recent bookmarks, try getting all bookmarks
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              console.log('Full bookmark tree:', bookmarkTreeNodes);
              
              const processBookmarks = (nodes) => {
                let bookmarksList = [];
                nodes.forEach((node) => {
                  if (node.url) {
                    bookmarksList.push({
                      id: node.id,
                      title: node.title || new URL(node.url).hostname,
                      url: node.url
                    });
                  }
                  if (node.children) {
                    bookmarksList = bookmarksList.concat(processBookmarks(node.children));
                  }
                });
                return bookmarksList;
              };

              const allBookmarks = processBookmarks(bookmarkTreeNodes);
              console.log('Processed bookmarks:', allBookmarks);
              setBookmarks(allBookmarks);
            });
          }
        });
      } else {
        console.error('Chrome bookmarks API not available');
      }
    };

    // Add a small delay to ensure Chrome APIs are fully loaded
    setTimeout(fetchBookmarks, 1000);
  }, []);

  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [showTodoList, setShowTodoList] = useState(false);
  const [showGoogleApps, setShowGoogleApps] = useState(false);

  // Load todos from storage when component mounts
  useEffect(() => {
    // Load initial todos
    if (chrome?.storage?.local) {
      chrome.storage.local.get(['todos'], (result) => {
        if (result.todos && Array.isArray(result.todos)) {
          setTodos(result.todos);
        }
      });

      // Listen for changes from other tabs
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local' && changes.todos?.newValue) {
          setTodos(changes.todos.newValue);
        }
      });
    }
  }, []);

  // Save todos whenever they change
  useEffect(() => {
    if (chrome?.storage?.local && todos.length >= 0) {
      chrome.storage.local.set({ todos }, () => {
        if (chrome.runtime.lastError) {
          console.error('Error saving todos:', chrome.runtime.lastError);
        }
      });
    }
  }, [todos]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [searchEngine, setSearchEngine] = useState("google");
  const [showEngineDropdown, setShowEngineDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Load todos from chrome.storage.local if available, otherwise from localStorage
    const loadTodos = async () => {
      try {
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
          chrome.storage.local.get(["todos"], (result) => {
            if (result && result.todos && Array.isArray(result.todos)) {
              setTodos(result.todos);
            }
          });
        } else {
          const raw = localStorage.getItem("todos");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) setTodos(parsed);
          }
        }
      } catch (err) {
        console.error("Failed to load todos:", err);
      }
    };

    loadTodos();
  }, []);

  // Persist todos whenever they change
  useEffect(() => {
    try {
      if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ todos }, () => {
          // optional callback
        });
      } else {
        localStorage.setItem("todos", JSON.stringify(todos));
      }
    } catch (err) {
      console.error("Failed to save todos:", err);
    }
  }, [todos]);

  const searchEngines = [
    { 
      id: "google", 
      name: "Google", 
      url: "https://www.google.com/search?q=",
      icon: "M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z",
      colors: ["#4285F4", "#34A853", "#FBBC05", "#EA4335"] // Google's brand colors
    },
    { 
      id: "duck", 
      name: "DuckDuckGo", 
      url: "https://duckduckgo.com/?q=",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.66 13.67c-.39.42-.9.77-1.49 1.05-.58.27-1.22.46-1.91.56-.69.1-1.37.15-2.05.15-.68 0-1.36-.05-2.05-.15-.69-.1-1.33-.29-1.91-.56-.59-.28-1.1-.63-1.49-1.05-.39-.42-.59-.88-.59-1.37 0-.49.2-.95.59-1.37.39-.42.9-.77 1.49-1.05.58-.27 1.22-.46 1.91-.56.69-.1 1.37-.15 2.05-.15.68 0 1.36.05 2.05.15.69.1 1.33.29 1.91.56.59.28 1.1.63 1.49 1.05.39.42.59.88.59 1.37 0 .49-.2.95-.59 1.37z"
    },
    { 
      id: "bing", 
      name: "Bing", 
      url: "https://www.bing.com/search?q=",
      icon: "M21.293 12.647h-3.917V1.016L8.83 4.525l-.294 15.734 5.393 2.725V13.53c.35.035.717.06 1.092.06 1.161 0 2.269-.184 3.31-.522l2.962 7.915V12.647zm-6.413-1.305c-.69.138-1.434.207-2.216.207-.736 0-1.438-.069-2.082-.207-.644-.138-1.219-.334-1.725-.59-.506-.254-.92-.564-1.242-.929-.322-.365-.483-.777-.483-1.236 0-.46.161-.871.483-1.236.322-.366.736-.676 1.242-.931.506-.254 1.081-.45 1.725-.588.644-.138 1.346-.207 2.082-.207.782 0 1.525.069 2.216.207.69.138 1.3.334 1.817.588.518.255.932.565 1.242.93.311.366.472.777.472 1.237 0 .46-.161.871-.472 1.236-.31.365-.724.675-1.242.93-.518.255-1.127.451-1.817.59z"
    },
    { 
      id: "brave", 
      name: "Brave", 
      url: "https://search.brave.com/search?q=",
      icon: "M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4c1.486 0 2.791.782 3.534 1.958a4.01 4.01 0 0 1-.67 4.892 4 4 0 0 1-5.728 0 4.01 4.01 0 0 1-.67-4.892A4.002 4.002 0 0 1 12 5z"
    },
    {
      id: "youtube",
      name: "YouTube",
      url: "https://www.youtube.com/results?search_query=",
      icon: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
    },
    { 
      id: "reddit", 
      name: "Reddit", 
      url: "https://www.reddit.com/search/?q=",
      icon: "M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"
    },
    {
      id: "wikipedia",
      name: "Wikipedia",
      url: "https://en.wikipedia.org/wiki/Special:Search?search=",
      icon: "M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .084-.103.135-.208.135l-.572.01c-.488.009-.769.77-.295 1.161.097.082.415.496.618.762l4.875 10.652 1.297-2.63-1.161-2.517c-1.028-2.246-1.624-3.353-1.901-3.846-.142-.253-.265-.43-.374-.533-.109-.103-.264-.17-.463-.201-.236-.035-.356-.084-.356-.17v-.434L7.051 7.3l4.837-.443 .049.045v.434c0 .084-.103.135-.208.135l-.572.011c-.488.009-.769.77-.295 1.161.097.082.415.496.618.762l3.886 8.484 1.081-2.276.049-3.986c0-2.984-1.516-4.434-1.516-4.434 0-1.948 4.242-2.073 4.242-2.073l.098.054v.438c-.209 0-1.074.084-1.074.084-.865.079-1.052.513-1.052.513l.166 7.025-.001.064z"
    },
  ];

  const googleApps = [
    {
      name: "Account",
      url: "https://myaccount.google.com/",
      icon: "M12 4c-4.42 0-8 3.58-8 8c0 1.95.7 3.73 1.86 5.12a9.95 9.95 0 0 1 12.28 0A7.96 7.96 0 0 0 20 12c0-4.42-3.58-8-8-8m0 9c-1.93 0-3.5-1.57-3.5-3.5S10.07 6 12 6s3.5 1.57 3.5 3.5S13.93 13 12 13M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-1.74 0-3.34-.56-4.65-1.5C8.66 17.56 10.26 17 12 17s3.34.56 4.65 1.5c-1.31.94-2.91 1.5-4.65 1.5m6.14-2.88a9.95 9.95 0 0 0-12.28 0A7.96 7.96 0 0 1 4 12c0-4.42 3.58-8 8-8s8 3.58 8 8c0 1.95-.7 3.73-1.86 5.12M12 5.93c-1.93 0-3.5 1.57-3.5 3.5s1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5s-1.57-3.5-3.5-3.5m0 5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5s1.5.67 1.5 1.5s-.67 1.5-1.5 1.5",
    },
    {
      name: "Search",
      url: "https://google.com/",
      icon: "M4.376 8.068A6 6 0 0 0 4.056 10c0 .734.132 1.437.376 2.086a5.946 5.946 0 0 0 8.57 3.045h.001a5.96 5.96 0 0 0 2.564-3.043H10.22V8.132h9.605a10 10 0 0 1-.044 3.956a10 10 0 0 1-3.52 5.71A9.96 9.96 0 0 1 10 20A9.998 9.998 0 0 1 1.118 5.401A10 10 0 0 1 10 0c2.426 0 4.651.864 6.383 2.302l-3.24 2.652a5.948 5.948 0 0 0-8.767 3.114",
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/",
      icon: "M12 4c.855 0 1.732.022 2.582.058l1.004.048l.961.057l.9.061l.822.064a3.8 3.8 0 0 1 3.494 3.423l.04.425l.075.91c.07.943.122 1.971.122 2.954s-.052 2.011-.122 2.954l-.075.91l-.04.425a3.8 3.8 0 0 1-3.495 3.423l-.82.063l-.9.062l-.962.057l-1.004.048A62 62 0 0 1 12 20a62 62 0 0 1-2.582-.058l-1.004-.048l-.961-.057l-.9-.062l-.822-.063a3.8 3.8 0 0 1-3.494-3.423l-.04-.425l-.075-.91A41 41 0 0 1 2 12c0-.983.052-2.011.122-2.954l.075-.91l.04-.425A3.8 3.8 0 0 1 5.73 4.288l.821-.064l.9-.061l.962-.057l1.004-.048A62 62 0 0 1 12 4m-2 5.575v4.85c0 .462.5.75.9.52l4.2-2.425a.6.6 0 0 0 0-1.04l-4.2-2.424a.6.6 0 0 0-.9.52Z",
    },
    {
      name: "Gmail",
      url: "https://mail.google.com/",
      icon: "M20 18h-2V9.25L12 13L6 9.25V18H4V6h1.2l6.8 4.25L18.8 6H20m0-2H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2",
    },
    {
      name: "YTMusic",
      url: "https://music.youtube.com/",
      icon: "M8.217 8.286C9.265 7.254 10.514 6.743 12 6.743s2.735.51 3.783 1.543s1.562 2.258 1.562 3.714s-.514 2.68-1.562 3.713s-2.297 1.543-3.783 1.543s-2.735-.51-3.783-1.543S6.655 13.455 6.655 12s.514-2.682 1.562-3.714m6.977 3.715L10 14.91V9.088zM19.071 18.966Q22.001 16.08 22 12q0-4.081-2.929-6.967Q16.141 2.147 12 2.147T4.929 5.033T2 12q0 4.08 2.929 6.966q2.93 2.886 7.071 2.886q4.142 0 7.071-2.886M12 5.433c-1.827 0-3.407.644-4.702 1.92C6.002 8.63 5.345 10.19 5.345 12c0 1.809.657 3.37 1.953 4.646c1.295 1.276 2.874 1.92 4.702 1.92s3.407-.644 4.702-1.92c1.296-1.276 1.953-2.837 1.953-4.646c0-1.81-.657-3.37-1.953-4.647c-1.295-1.276-2.875-1.92-4.702-1.92",
    },
    {
      name: "Maps",
      url: "https://maps.google.com/",
      icon: "M4.456 12.367c-.515-1.143-.829-2.42-.83-3.994.001-2.05.739-3.927 1.962-5.383A8.354 8.354 0 0 1 12 0c.882 0 1.732.137 2.53.39a8.393 8.393 0 0 1 4.9 4.124c-.006.008 0 0 0 0a8.334 8.334 0 0 1 .943 3.859c0 5.078-3.256 7.061-6.05 11.429C12.625 22.426 13.096 24 12 24c-1.096 0-.625-1.574-2.323-4.198-1.955-3.058-4.057-4.854-5.221-7.435Zm5.096-6.059-.008.01a3.202 3.202 0 0 0 4.893 4.133l.03-.035a3.202 3.202 0 0 0-4.915-4.107z",
    },
    {
      name: "Play",
      url: "https://play.google.com/",
      icon: "M14.222 9.374c1.037-.61 1.037-2.137 0-2.748L11.528 5.04 8.32 8l3.207 2.96zm-3.595 2.116L7.583 8.68 1.03 14.73c.201 1.029 1.36 1.61 2.303 1.055zM1 13.396V2.603L6.846 8zM1.03 1.27l6.553 6.05 3.044-2.81L3.333.215C2.39-.341 1.231.24 1.03 1.27",
    },
    {
      name: "Drive",
      url: "https://drive.google.com/",
      icon: "M12.01 1.485c-2.082 0-3.754.02-3.743.047.01.02 1.708 3.001 3.774 6.62l3.76 6.574h3.76c2.081 0 3.753-.02 3.742-.047-.005-.02-1.708-3.001-3.775-6.62l-3.76-6.574zm-4.76 1.73a789.828 789.861 0 0 0-3.63 6.319L0 15.868l1.89 3.298 1.885 3.297 3.62-6.335 3.618-6.33-1.88-3.287C8.1 4.704 7.255 3.22 7.25 3.214zm2.259 12.653-.203.348c-.114.198-.96 1.672-1.88 3.287a423.93 423.948 0 0 1-1.698 2.97c-.01.026 3.24.042 7.222.042h7.244l1.796-3.157c.992-1.734 1.85-3.23 1.906-3.323l.104-.167h-7.249z",
    },
    {
      name: "Photos",
      url: "https://photos.google.com/",
      icon: "M192 88a63.7 63.7 0 0 1-14 40h-50V24a64 64 0 0 1 64 64M64 168a64 64 0 0 0 64 64V128H78a63.7 63.7 0 0 0-14 40M232 120h-39.51A72 72 0 0 0 128 16a8 8 0 0 0-8 8v39.51A72 72 0 0 0 16 128a8 8 0 0 0 8 8h39.51A72 72 0 0 0 128 240a8 8 0 0 0 8-8v-39.51A72 72 0 0 0 240 128a8 8 0 0 0-8-8M120 223.43A56.09 56.09 0 0 1 72 168a55.3 55.3 0 0 1 10-32h38ZM120 120H32.57A56.09 56.09 0 0 1 88 72a55.3 55.3 0 0 1 32 10Zm16-87.43A56.09 56.09 0 0 1 184 88a55.3 55.3 0 0 1-10 32h-38ZM168 184a55.3 55.3 0 0 1-32-10v-38h87.43A56.09 56.09 0 0 1 168 184",
      viewBox: "0 0 256 256",
    },
    {
      name: "Translate",
      url: "https://translate.google.com/",
      icon: "m12 22-1-3H4q-.825 0-1.412-.587T2 17V4q0-.825.588-1.412T4 2h6l.875 3H20q.875 0 1.438.563T22 7v13q0 .825-.562 1.413T20 22zm-4.85-7.4q1.725 0 2.838-1.112T11.1 10.6q0-.2-.012-.362t-.063-.338h-3.95v1.55H9.3q-.2.7-.763 1.088t-1.362.387q-.975 0-1.675-.7T4.8 10.5t.7-1.725 1.675-.7q.45 0 .85.163t.725.487L9.975 7.55Q9.45 7 8.712 6.7T7.15 6.4q-1.675 0-2.863 1.188T3.1 10.5t1.188 2.913T7.15 14.6m6.7.5.55-.525q-.35-.425-.637-.825t-.563-.85zm1.25-1.275q.7-.825 1.063-1.575t.487-1.175h-3.975l.3 1.05h1q.2.375.475.813t.65.887M13 21h7q.45 0 .725-.288T21 20V7q0-.45-.275-.725T20 6h-8.825l1.175 4.05h1.975V9h1.025v1.05H19v1.025h-1.275q-.25.95-.75 1.85T15.8 14.6l2.725 2.675L17.8 18l-2.7-2.7-.9.925L15 19z",
    },
    {
      name: "Calendar",
      url: "https://calendar.google.com/",
      icon: "M18.316 5.684H24v12.632h-5.684zM5.684 24h12.632v-5.684H5.684zM18.316 5.684V0H1.895A1.894 1.894 0 0 0 0 1.895v16.421h5.684V5.684zm-7.207 6.25v-.065q.407-.216.687-.617c.28-.401.279-.595.279-.982q0-.568-.3-1.025a2.05 2.05 0 0 0-.832-.714 2.7 2.7 0 0 0-1.197-.257q-.9 0-1.481.467-.579.467-.793 1.078l1.085.452q.13-.374.413-.633.284-.258.767-.257.495 0 .816.264a.86.86 0 0 1 .322.703q0 .495-.36.778t-.886.284h-.567v1.085h.633q.611 0 1.02.327.407.327.407.843 0 .505-.387.832c-.387.327-.565.327-.924.327q-.527 0-.897-.311-.372-.312-.521-.881l-1.096.452q.268.923.977 1.401.707.479 1.538.477a2.84 2.84 0 0 0 1.293-.291q.574-.29.902-.794.327-.505.327-1.149q0-.643-.344-1.105a2.07 2.07 0 0 0-.881-.689m2.093-1.931.602.913L15 10.045v5.744h1.187V8.446h-.827zM22.105 0h-3.289v5.184H24V1.895A1.894 1.894 0 0 0 22.105 0m-3.289 23.5 4.684-4.684h-4.684zM0 22.105C0 23.152.848 24 1.895 24h3.289v-5.184H0z",
    },
    {
      name: "Meet",
      url: "https://meet.google.com/",
      icon: "M2 18L2 32 12 32 12 18zM39 9v4.31l-10 9V16H14V6h22C37.66 6 39 7.34 39 9zM29 27.69l10 9V41c0 1.66-1.34 3-3 3H14V34h15V27.69zM12 34v10H5c-1.657 0-3-1.343-3-3v-7H12zM12 6L12 16 2 16zM29 25L39 16 39 34zM49 9.25v31.5c0 .87-1.03 1.33-1.67.75L41 35.8V14.2l6.33-5.7C47.97 7.92 49 8.38 49 9.25z",
      viewBox: "0 0 50 50",
    },
    {
      name: "Chat",
      url: "https://chat.google.com/",
      icon: "M1.637 0C.733 0 0 .733 0 1.637v16.5c0 .904.733 1.636 1.637 1.636h3.955v3.323c0 .804.97 1.207 1.539.638l3.963-3.96h11.27c.903 0 1.636-.733 1.636-1.637V5.592L18.408 0Zm3.955 5.592h12.816v8.59H8.455l-2.863 2.863Z",
    },
  ];

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
      setNewTodo("");
    }
  };

  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const engine = searchEngines.find((e) => e.id === searchEngine);
      window.location.href = engine.url + encodeURIComponent(searchQuery);
    }
  };

  return (
    <>
      <div className="container">
        <div className="min-h-screen w-[100vw] bg-black text-white relative overflow-hidden">
          <TodoList
            todos={todos}
            newTodo={newTodo}
            setNewTodo={setNewTodo}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            showTodoList={showTodoList}
            setShowTodoList={setShowTodoList}
          />

          <div className="fixed top-6 right-6 z-50 flex gap-3">
            <button
              onClick={() => {
                setShowBookmarks(!showBookmarks);
                if (!showBookmarks) setShowGoogleApps(false);
              }}
              className="px-5 py-0 bg-gray-800 cursor-pointer border border-gray-700 hover:bg-zinc-800 rounded-full text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg
                width="22"
                height="20"
                viewBox="0 0 24 24"
                fill="white"
                stroke="white"
                strokeWidth="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              <span>Bookmarks</span>
            </button>

            <button
              onClick={() => {
                setShowGoogleApps(!showGoogleApps);
                if (!showGoogleApps) setShowBookmarks(false);
              }}
              className="px-4 py-2 cursor-pointer rounded-full text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                <circle cx="6" cy="6" r="2" />
                <circle cx="12" cy="6" r="2" />
                <circle cx="18" cy="6" r="2" />
                <circle cx="6" cy="12" r="2" />
                <circle cx="12" cy="12" r="2" />
                <circle cx="18" cy="12" r="2" />
                <circle cx="6" cy="18" r="2" />
                <circle cx="12" cy="18" r="2" />
                <circle cx="18" cy="18" r="2" />
              </svg>
            </button>
          </div>

          <GoogleApps googleApps={googleApps} showGoogleApps={showGoogleApps} />

          <Bookmarks bookmarks={bookmarks} showBookmarks={showBookmarks} setShowBookmarks={setShowBookmarks} />

          <div className="flex flex-col items-center justify-center mt-[13%] px-8">
            <Clock />
            <SearchEngine
              searchEngines={searchEngines}
              searchEngine={searchEngine}
              setSearchEngine={setSearchEngine}
              showEngineDropdown={showEngineDropdown}
              setShowEngineDropdown={setShowEngineDropdown}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
            />
          </div>

          <AiTools />

          <div className="fixed bottom-5 right-8">
            <a href="https://javaadde.github.io/portfolio" target="_blank">
              <button className="px-6 py-4 text-xl bg-gray-800 rounded-full border cursor-pointer border-gray-700">
                portfolio
              </button>
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
