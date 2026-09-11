/* eslint-disable react/prop-types */
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

const PALETTE = [
  { color: '#ef4444', name: 'Red' },
  { color: '#f97316', name: 'Orange' },
  { color: '#f5b82e', name: 'Amber' },
  { color: '#d4df4f', name: 'Lime' },
  { color: '#31a65a', name: 'Green' },
  { color: '#18a98c', name: 'Teal' },
  { color: '#2f8bd3', name: 'Blue' },
  { color: '#7957e5', name: 'Violet' },
  { color: '#d9437f', name: 'Pink' },
];

const DEFAULT_COLOR = '#7957e5';
const COLOR_STORAGE_KEY = 'agney-blog-marker-color-v1';
const HIGHLIGHT_STORAGE_PREFIX = 'agney-blog-highlights-v1:';

const safeRead = (key, fallback) => {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const safeWrite = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Highlighting remains available for the current page when storage is unavailable.
  }
};

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `highlight-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const hexToRgba = (hex, alpha) => {
  const normalized = hex.replace('#', '');
  const value = Number.parseInt(normalized, 16);
  if (Number.isNaN(value) || normalized.length !== 6) {
    return `rgba(121, 87, 229, ${alpha})`;
  }
  const red = (value >> 16) & 255;
  const green = (value >> 8) & 255;
  const blue = value & 255;
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
};

const createTextRange = (root, start, end) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  let node = walker.nextNode();
  while (node) {
    if (node.data.length) nodes.push(node);
    node = walker.nextNode();
  }

  const locate = (value, isEnd) => {
    let offset = 0;
    for (const textNode of nodes) {
      const nextOffset = offset + textNode.data.length;
      const isInside = isEnd ? value <= nextOffset : value < nextOffset;
      if (value >= offset && isInside) {
        return [textNode, value - offset];
      }
      offset = nextOffset;
    }
    const lastNode = nodes.at(-1);
    return lastNode && value === offset
      ? [lastNode, lastNode.data.length]
      : null;
  };

  const startPoint = locate(start, false);
  const endPoint = locate(end, true);
  if (!startPoint || !endPoint) return null;

  const range = document.createRange();
  range.setStart(startPoint[0], startPoint[1]);
  range.setEnd(endPoint[0], endPoint[1]);
  return range;
};

const textOffsetAtBoundary = (root, container, containerOffset) => {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();
  let offset = 0;

  while (node) {
    if (node === container) {
      return offset + Math.min(containerOffset, node.data.length);
    }
    offset += node.data.length;
    node = walker.nextNode();
  }

  // Element boundaries are uncommon for text selection, but can occur when a
  // selection begins beside an inline element. Range provides a safe fallback.
  try {
    const before = document.createRange();
    before.selectNodeContents(root);
    before.setEnd(container, containerOffset);
    return before.toString().length;
  } catch {
    return null;
  }
};

const matchingContextLength = (a, b, fromEnd = false) => {
  const first = fromEnd ? [...a].reverse() : [...a];
  const second = fromEnd ? [...b].reverse() : [...b];
  let matches = 0;
  while (matches < first.length && first[matches] === second[matches]) {
    matches += 1;
  }
  return matches;
};

const resolveAnchor = (root, highlight) => {
  const fullText = root.textContent || '';
  if (fullText.slice(highlight.start, highlight.end) === highlight.text) {
    return highlight;
  }
  if (!highlight.text) return null;

  let cursor = 0;
  let bestMatch = null;
  while (cursor <= fullText.length) {
    const index = fullText.indexOf(highlight.text, cursor);
    if (index === -1) break;
    const before = fullText.slice(Math.max(0, index - highlight.prefix.length), index);
    const after = fullText.slice(index + highlight.text.length, index + highlight.text.length + highlight.suffix.length);
    const score =
      matchingContextLength(before, highlight.prefix, true) +
      matchingContextLength(after, highlight.suffix);
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { index, score };
    }
    cursor = index + 1;
  }

  if (!bestMatch) return null;
  return {
    ...highlight,
    start: bestMatch.index,
    end: bestMatch.index + highlight.text.length,
  };
};

const selectionToAnchor = (root) => {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return null;

  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return null;
  }

  const start = textOffsetAtBoundary(root, range.startContainer, range.startOffset);
  const end = textOffsetAtBoundary(root, range.endContainer, range.endOffset);
  if (start === null || end === null || end <= start) return null;
  const fullText = root.textContent || '';
  const text = fullText.slice(start, end);

  if (!text.trim()) return null;
  return {
    id: 'draft',
    start,
    end,
    text,
    prefix: fullText.slice(Math.max(0, start - 28), start),
    suffix: fullText.slice(end, end + 28),
  };
};

const buildSegments = (root, highlights, draft) => {
  const rootRect = root.getBoundingClientRect();
  const items = draft ? [...highlights, { ...draft, isDraft: true }] : highlights;

  return items.flatMap((highlight) => {
    const resolved = resolveAnchor(root, highlight);
    if (!resolved) return [];
    const range = createTextRange(root, resolved.start, resolved.end);
    if (!range) return [];

    return Array.from(range.getClientRects())
      .filter((rect) => rect.width > 1 && rect.height > 4)
      .map((rect, index) => ({
        color: highlight.color,
        height: Math.max(8, rect.height - 2),
        id: `${highlight.id}-${index}`,
        isDraft: Boolean(highlight.isDraft),
        left: rect.left - rootRect.left - 2,
        rotation: ((index + resolved.start) % 5 - 2) * 0.08,
        top: rect.top - rootRect.top + 1,
        width: rect.width + 4,
      }));
  });
};

const MarkerIcon = ({ color }) => (
  <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22">
    <path d="M7.2 3.1h7.9l2.1 2.1-8.8 8.9-4.3-4.3 3.1-6.7Z" fill="currentColor" />
    <path d="m4.1 9.8 4.3 4.3-2.2 2.2-4.3-4.3 2.2-2.2Z" fill="currentColor" opacity=".7" />
    <path d="M3 19.2h15.5" stroke={color} strokeLinecap="round" strokeWidth="3" />
  </svg>
);

const TextHighlighter = ({ darkMode, rootRef, storageKey }) => {
  const scopedStorageKey = useMemo(
    () => `${HIGHLIGHT_STORAGE_PREFIX}${storageKey}`,
    [storageKey]
  );
  const [highlights, setHighlights] = useState(() => {
    const stored = safeRead(`${HIGHLIGHT_STORAGE_PREFIX}${storageKey}`, []);
    return Array.isArray(stored) ? stored : [];
  });
  const [currentColor, setCurrentColor] = useState(() => {
    try {
      return window.localStorage.getItem(COLOR_STORAGE_KEY) || DEFAULT_COLOR;
    } catch {
      return DEFAULT_COLOR;
    }
  });
  const [draft, setDraft] = useState(null);
  const [isArmed, setIsArmed] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState(null);
  const [segments, setSegments] = useState([]);
  const [status, setStatus] = useState('');
  const draftRef = useRef(null);
  const historyRef = useRef([]);
  const pointerSelectingRef = useRef(false);

  const updateDraft = useCallback((nextDraft) => {
    draftRef.current = nextDraft;
    setDraft(nextDraft);
  }, []);

  const clearBrowserSelection = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount) selection.removeAllRanges();
  }, []);

  const applyMutation = useCallback((updater) => {
    setHighlights((current) => {
      historyRef.current.push(current);
      if (historyRef.current.length > 30) historyRef.current.shift();
      return typeof updater === 'function' ? updater(current) : updater;
    });
  }, []);

  const commitHighlight = useCallback((pending, color) => {
    if (!pending) return;

    applyMutation((current) => {
      const existingIndex = current.findIndex(
        (highlight) => highlight.start === pending.start && highlight.end === pending.end
      );
      const nextHighlight = {
        ...pending,
        id: existingIndex >= 0 ? current[existingIndex].id : makeId(),
        color,
        createdAt: Date.now(),
      };

      if (existingIndex < 0) return [...current, nextHighlight];
      return current.map((highlight, index) => (
        index === existingIndex ? nextHighlight : highlight
      ));
    });
    updateDraft(null);
    clearBrowserSelection();
    setStatus('Highlight saved in this browser. Marker stays on.');
  }, [applyMutation, clearBrowserSelection, updateDraft]);

  const selectColor = useCallback((color) => {
    setCurrentColor(color);
    try {
      window.localStorage.setItem(COLOR_STORAGE_KEY, color);
    } catch {
      // Keep the selected color in memory when storage is unavailable.
    }

    const pending = draftRef.current;
    if (pending) {
      commitHighlight(pending, color);
    } else {
      setStatus(`${PALETTE.find((item) => item.color === color)?.name || 'Custom'} marker selected.`);
    }
  }, [commitHighlight]);

  const commitExistingSelection = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const anchor = selectionToAnchor(root);
    if (anchor) commitHighlight({ ...anchor, color: currentColor }, currentColor);
  }, [commitHighlight, currentColor, rootRef]);

  const toggleMarker = useCallback(() => {
    if (isArmed) {
      setIsArmed(false);
      updateDraft(null);
      setStatus('Marker off. Text selection is back to normal.');
      return;
    }

    setIsArmed(true);
    setIsOpen(true);
    setStatus('Marker on. Select text to highlight it.');
    requestAnimationFrame(commitExistingSelection);
  }, [commitExistingSelection, isArmed, updateDraft]);

  const openToolbar = useCallback(() => {
    setIsOpen(true);
    setIsArmed(true);
    setStatus('Marker on. Select text to highlight it.');
    requestAnimationFrame(commitExistingSelection);
  }, [commitExistingSelection]);

  const undo = useCallback(() => {
    if (draftRef.current) {
      updateDraft(null);
      clearBrowserSelection();
      setStatus('Selection cancelled.');
      return;
    }

    setHighlights((current) => {
      const previous = historyRef.current.pop();
      if (previous) {
        setStatus('Last change undone.');
        return previous;
      }
      if (current.length) {
        setStatus('Last highlight removed.');
        return current.slice(0, -1);
      }
      return current;
    });
  }, [clearBrowserSelection, updateDraft]);

  const clearAll = useCallback(() => {
    if (!highlights.length && !draftRef.current) return;
    updateDraft(null);
    clearBrowserSelection();
    applyMutation([]);
    setStatus('All highlights removed. Use undo to restore them.');
  }, [applyMutation, clearBrowserSelection, highlights.length, updateDraft]);

  const closeToolbar = useCallback(() => {
    updateDraft(null);
    clearBrowserSelection();
    setIsArmed(false);
    setIsOpen(false);
  }, [clearBrowserSelection, updateDraft]);

  const recomputeSegments = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    setSegments(buildSegments(root, highlights, draft));
  }, [draft, highlights, rootRef]);

  useEffect(() => {
    setPortalRoot(rootRef.current);
  }, [rootRef]);

  useEffect(() => {
    safeWrite(scopedStorageKey, highlights);
  }, [highlights, scopedStorageKey]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isArmed) return undefined;

    let frame = null;
    let settleTimer = null;

    const cancelScheduledCommit = () => {
      if (settleTimer !== null) {
        window.clearTimeout(settleTimer);
        settleTimer = null;
      }
    };

    const commitCurrentSelection = () => {
      const anchor = selectionToAnchor(root);
      if (anchor) {
        commitHighlight({ ...anchor, color: currentColor }, currentColor);
      } else {
        updateDraft(null);
      }
    };

    const inspectSelection = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const anchor = selectionToAnchor(root);
        if (anchor) {
          updateDraft({ ...anchor, color: currentColor });
          // Keyboard selection and mobile selection handles do not always emit a
          // useful pointerup. Commit once the selection has remained still.
          if (!pointerSelectingRef.current) {
            cancelScheduledCommit();
            settleTimer = window.setTimeout(commitCurrentSelection, 520);
          }
        } else if (!pointerSelectingRef.current) {
          cancelScheduledCommit();
          updateDraft(null);
        }
        frame = null;
      });
    };

    const beginPointerSelection = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      pointerSelectingRef.current = true;
      cancelScheduledCommit();
      updateDraft(null);
    };

    const finishPointerSelection = () => {
      if (!pointerSelectingRef.current) return;
      pointerSelectingRef.current = false;
      cancelScheduledCommit();
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(commitCurrentSelection);
    };

    const cancelPointerSelection = () => {
      pointerSelectingRef.current = false;
      cancelScheduledCommit();
      updateDraft(null);
    };

    root.addEventListener('pointerdown', beginPointerSelection);
    document.addEventListener('pointerup', finishPointerSelection);
    document.addEventListener('pointercancel', cancelPointerSelection);
    document.addEventListener('selectionchange', inspectSelection);
    return () => {
      root.removeEventListener('pointerdown', beginPointerSelection);
      document.removeEventListener('pointerup', finishPointerSelection);
      document.removeEventListener('pointercancel', cancelPointerSelection);
      document.removeEventListener('selectionchange', inspectSelection);
      if (frame !== null) cancelAnimationFrame(frame);
      cancelScheduledCommit();
      pointerSelectingRef.current = false;
    };
  }, [commitHighlight, currentColor, isArmed, rootRef, updateDraft]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape' && (isOpen || draftRef.current)) {
        closeToolbar();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [closeToolbar, isOpen]);

  useLayoutEffect(() => {
    const frame = requestAnimationFrame(recomputeSegments);
    return () => cancelAnimationFrame(frame);
  }, [recomputeSegments]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let frame = null;
    const schedule = () => {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(recomputeSegments);
    };
    const resizeObserver = new ResizeObserver(schedule);
    const mutationObserver = new MutationObserver((records) => {
      const onlyOverlayChanged = records.every((record) => {
        const target = record.target.nodeType === Node.ELEMENT_NODE
          ? record.target
          : record.target.parentElement;
        return target?.closest?.('.blog-marker-layer');
      });
      if (!onlyOverlayChanged) schedule();
    });

    resizeObserver.observe(root);
    mutationObserver.observe(root, { childList: true, characterData: true, subtree: true });
    window.addEventListener('resize', schedule, { passive: true });
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener('resize', schedule);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [recomputeSegments, rootRef]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    root.classList.toggle('has-marker-draft', Boolean(draft));
    return () => root.classList.remove('has-marker-draft');
  }, [draft, rootRef]);

  const canUndo = Boolean(draft || highlights.length || historyRef.current.length);
  const markerAlpha = darkMode ? 0.55 : 0.42;

  const overlay = portalRoot
    ? createPortal(
        <div className="blog-marker-layer" aria-hidden="true">
          {segments.map((segment, index) => (
            <span
              className={`blog-marker-stroke${segment.isDraft ? ' is-draft' : ''}`}
              key={segment.id}
              style={{
                '--marker-delay': `${Math.min(index * 16, 120)}ms`,
                '--marker-rotation': `${segment.rotation}deg`,
                background: `linear-gradient(92deg, ${hexToRgba(segment.color, markerAlpha * 0.82)}, ${hexToRgba(segment.color, markerAlpha)} 8%, ${hexToRgba(segment.color, markerAlpha * 0.92)} 91%, ${hexToRgba(segment.color, markerAlpha * 0.76)})`,
                height: `${segment.height}px`,
                left: `${segment.left}px`,
                top: `${segment.top}px`,
                width: `${segment.width}px`,
              }}
            />
          ))}
        </div>,
        portalRoot
      )
    : null;

  return (
    <>
      {overlay}

      {!isOpen && (
        <button
          aria-label="Open highlighting tools and turn marker on"
          className={`blog-marker-launcher${darkMode ? ' is-dark' : ''}`}
          onClick={openToolbar}
          onPointerDown={(event) => event.preventDefault()}
          style={{ '--marker-color': currentColor }}
          title="Turn marker on"
          type="button"
        >
          <MarkerIcon color={currentColor} />
        </button>
      )}

      <div
        aria-hidden={!isOpen}
        aria-label="Highlighting tools"
        className={`blog-marker-toolbar${isOpen ? ' is-open' : ''}${darkMode ? ' is-dark' : ''}`}
        role="toolbar"
      >
        <button
          aria-label="Close highlighting tools"
          className="blog-marker-action blog-marker-close"
          onClick={closeToolbar}
          tabIndex={isOpen ? 0 : -1}
          title="Close"
          type="button"
        >
          <span aria-hidden="true">‹</span>
        </button>

        <span className="blog-marker-divider" />

        <button
          aria-label={isArmed ? 'Turn marker off' : 'Turn marker on'}
          aria-pressed={isArmed}
          className={`blog-marker-action blog-marker-tool${isArmed ? ' is-selected' : ''}`}
          onClick={toggleMarker}
          onPointerDown={(event) => event.preventDefault()}
          style={{
            '--marker-color': currentColor,
            '--marker-tint': hexToRgba(currentColor, darkMode ? 0.24 : 0.16),
          }}
          tabIndex={isOpen ? 0 : -1}
          title={isArmed ? 'Marker on — click to turn off' : 'Marker off — click to turn on'}
          type="button"
        >
          <MarkerIcon color={currentColor} />
        </button>

        <div className="blog-marker-colors" aria-label="Marker colors">
          {PALETTE.map(({ color, name }) => (
            <button
              aria-label={`${name} marker`}
              aria-pressed={currentColor === color}
              className="blog-marker-swatch"
              key={color}
              onClick={() => selectColor(color)}
              onPointerDown={(event) => event.preventDefault()}
              style={{ '--swatch-color': color }}
              tabIndex={isOpen ? 0 : -1}
              title={name}
              type="button"
            >
              {currentColor === color && <span aria-hidden="true">✓</span>}
            </button>
          ))}

          <label className="blog-marker-custom" title="Custom marker color">
            <span className="sr-only">Custom marker color</span>
            <input
              aria-label="Custom marker color"
              onChange={(event) => selectColor(event.target.value)}
              tabIndex={isOpen ? 0 : -1}
              type="color"
              value={currentColor}
            />
          </label>
        </div>

        <span className="blog-marker-divider" />

        <button
          aria-label="Undo last highlight"
          className="blog-marker-action"
          disabled={!canUndo}
          onClick={undo}
          onPointerDown={(event) => event.preventDefault()}
          tabIndex={isOpen ? 0 : -1}
          title="Undo"
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19">
            <path d="M9.2 7H5v-4M5.4 7.2A8 8 0 1 1 4 15" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </button>

        <button
          aria-label="Remove all highlights from this post"
          className="blog-marker-action"
          disabled={!draft && !highlights.length}
          onClick={clearAll}
          onPointerDown={(event) => event.preventDefault()}
          tabIndex={isOpen ? 0 : -1}
          title="Clear all"
          type="button"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" width="19" height="19">
            <path d="M8 7h8m-7 0 .5 11h5L15 7m-5-3h4l1 3H9l1-3Z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
          </svg>
        </button>

        <span aria-live="polite" className="sr-only">{status}</span>
      </div>
    </>
  );
};

export default TextHighlighter;
