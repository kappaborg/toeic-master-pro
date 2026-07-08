/**
 * Floating Button Drag Utility
 *
 * Single shared implementation for every draggable floating button
 * (home button, game controls, settings). Replaces three divergent
 * copies that used document-level mousemove/mouseup listeners and
 * native HTML5 drag, both of which caused buttons to "stick" to the
 * cursor when the release event was missed.
 *
 * Design:
 * - Pointer Events + setPointerCapture: pointerup/pointercancel are
 *   ALWAYS delivered to the button, even if the cursor leaves the
 *   window — a drag can never be left dangling.
 * - 6px movement threshold: below it the gesture is a click and the
 *   button's normal onclick fires; above it the gesture is a drag and
 *   the resulting click is swallowed, so dragging the home button no
 *   longer navigates home.
 * - Position is persisted per-button and clamped to the viewport on
 *   restore, drag, and window resize.
 */
(function () {
    'use strict';

    const EDGE_PADDING = 8;      // px kept between button and viewport edge
    const DRAG_THRESHOLD = 6;    // px of movement that turns a click into a drag

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    window.makeFloatingDraggable = function (button, storageKey) {
        if (!button || button.dataset.dragBound === 'true') return;
        button.dataset.dragBound = 'true';

        let pointerId = null;
        let dragging = false;
        let suppressClick = false;
        let startX = 0, startY = 0, startLeft = 0, startTop = 0;

        function applyPosition(left, top) {
            const maxLeft = window.innerWidth - button.offsetWidth - EDGE_PADDING;
            const maxTop = window.innerHeight - button.offsetHeight - EDGE_PADDING;
            button.style.position = 'fixed';
            button.style.left = clamp(left, EDGE_PADDING, maxLeft) + 'px';
            button.style.top = clamp(top, EDGE_PADDING, maxTop) + 'px';
            button.style.right = 'auto';
            button.style.bottom = 'auto';
            button.style.transform = 'none';
            button.style.margin = '0';
        }

        // Restore saved position
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
            if (saved && Number.isFinite(saved.left) && Number.isFinite(saved.top)) {
                applyPosition(saved.left, saved.top);
            }
        } catch (e) {
            localStorage.removeItem(storageKey);
        }

        // Keep the button on screen when the window shrinks
        window.addEventListener('resize', () => {
            if (button.style.position === 'fixed' && button.style.left) {
                const rect = button.getBoundingClientRect();
                applyPosition(rect.left, rect.top);
            }
        });

        // Kill native HTML5 drag (the ghost-image drag that follows the
        // cursor) and let Pointer Events own the touch gesture
        button.setAttribute('draggable', 'false');
        button.addEventListener('dragstart', (e) => e.preventDefault());
        button.style.touchAction = 'none';
        button.style.cursor = 'grab';
        button.style.userSelect = 'none';

        // Swallow the click that follows a completed drag. Capture-phase
        // listeners at the target run before bubble/onclick handlers.
        button.addEventListener('click', (e) => {
            if (suppressClick) {
                suppressClick = false;
                e.preventDefault();
                e.stopImmediatePropagation();
            }
        }, true);

        button.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 && e.pointerType === 'mouse') return;
            pointerId = e.pointerId;
            dragging = false;
            startX = e.clientX;
            startY = e.clientY;
            const rect = button.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            try {
                button.setPointerCapture(pointerId);
            } catch (err) { /* capture can fail if the pointer is gone */ }
        });

        button.addEventListener('pointermove', (e) => {
            if (pointerId === null || e.pointerId !== pointerId) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            if (!dragging) {
                if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
                dragging = true;
                button.classList.add('dragging');
                button.style.cursor = 'grabbing';
            }
            e.preventDefault();
            applyPosition(startLeft + dx, startTop + dy);
        });

        function release(e) {
            if (pointerId === null || e.pointerId !== pointerId) return;
            pointerId = null;
            button.style.cursor = 'grab';
            if (dragging) {
                dragging = false;
                suppressClick = true;
                button.classList.remove('dragging');
                const rect = button.getBoundingClientRect();
                try {
                    localStorage.setItem(storageKey, JSON.stringify({
                        left: rect.left,
                        top: rect.top
                    }));
                } catch (err) { /* storage full — position just won't persist */ }
            }
        }
        button.addEventListener('pointerup', release);
        button.addEventListener('pointercancel', release);
    };

    console.log('🎯 Floating drag utility loaded');
})();
