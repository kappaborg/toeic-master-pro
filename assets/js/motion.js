// Motion layer — modern micro-interactions for TOEIC Master Pro.
// Dependency-free. All effects honor prefers-reduced-motion (live via
// matchMedia) and the in-app html.reduce-motion setting. CSS lives in
// professional-ui.css under the "MOTION PASS" section.
(function () {
    'use strict';

    var mq = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

    var appMotion = window.appMotion || {};
    appMotion.reduced = mq ? mq.matches : false;
    window.appMotion = appMotion;

    function isReduced() {
        return appMotion.reduced || document.documentElement.classList.contains('reduce-motion');
    }

    // Add a one-shot utility class; drop it when its animation finishes
    // so the same effect can replay later. No timers involved.
    function oneShot(el, cls) {
        if (!el || !el.classList || isReduced()) return;
        el.classList.remove(cls); // restartable
        // force style recalc so re-adding retriggers the animation
        void el.offsetWidth; // eslint-disable-line no-unused-expressions
        el.classList.add(cls);
        el.addEventListener('animationend', function handler(e) {
            if (e.target !== el) return; // ignore bubbled child animations
            el.classList.remove(cls);
            el.removeEventListener('animationend', handler);
        });
    }

    appMotion.pop = function (el) { oneShot(el, 'm-pop'); };
    appMotion.shake = function (el) { oneShot(el, 'm-shake'); };
    appMotion.bump = function (el) { oneShot(el, 'm-bump'); };

    // ---- Entrance decoration for freshly inserted screens ----
    // Screens are swapped via innerHTML; CSS entrance animations fire on
    // insertion by themselves, so this only decorates quiz cards that are
    // NOT already choreographed by a parent (.module-shell/.reading-layout
    // children have their own staggered rules).
    function decorate(node) {
        if (node.nodeType !== 1) return;
        var cards = [];
        if (node.matches && node.matches('.quiz-card')) cards.push(node);
        if (node.querySelectorAll) {
            cards.push.apply(cards, node.querySelectorAll('.quiz-card'));
        }
        for (var i = 0; i < cards.length; i++) {
            var card = cards[i];
            if (card.dataset.mDecorated) continue; // idempotent
            card.dataset.mDecorated = '1';
            var p = card.parentElement;
            var choreographed = p && (p.classList.contains('module-shell') ||
                p.classList.contains('reading-layout') ||
                p.classList.contains('m-stagger'));
            if (!choreographed) card.classList.add('m-fade-up');
        }
    }

    // Counters that should visually "bump" when their text changes.
    var COUNTER_SEL = '.reading-chip strong, .module-stat-value, .dashboard-stat-value, .vocab-counter';

    // Answer-state classes -> effect (class-attribute watching, scoped
    // to #toeicModuleContent only, see observer wiring below).
    function onClassChange(el, oldValue) {
        var was = oldValue || '';
        var gained = function (cls) {
            return el.classList.contains(cls) && was.indexOf(cls) === -1;
        };
        if (gained('reading-answer-correct') || gained('is-correct')) appMotion.pop(el);
        else if (gained('reading-answer-incorrect') || gained('is-wrong')) appMotion.shake(el);
    }

    var observers = [];

    function handleMutations(records) {
        if (isReduced()) return;
        for (var i = 0; i < records.length; i++) {
            var r = records[i];
            if (r.type === 'attributes') {
                onClassChange(r.target, r.oldValue);
            } else if (r.type === 'childList') {
                for (var j = 0; j < r.addedNodes.length; j++) decorate(r.addedNodes[j]);
                var t = r.target;
                if (t.nodeType === 1 && t.matches && t.matches(COUNTER_SEL)) {
                    appMotion.bump(t); // text content swapped -> pop the counter
                }
            }
        }
    }

    function connect() {
        if (observers.length || typeof MutationObserver === 'undefined') return;
        var moduleRoot = document.getElementById('toeicModuleContent');
        if (moduleRoot) {
            var mo = new MutationObserver(handleMutations);
            mo.observe(moduleRoot, {
                childList: true,
                subtree: true,
                attributes: true,           // class watching only under the
                attributeFilter: ['class'], // module container (cheap scope)
                attributeOldValue: true
            });
            observers.push(mo);
        }
        var main = document.querySelector('main');
        if (main && main !== moduleRoot) {
            var mo2 = new MutationObserver(handleMutations);
            mo2.observe(main, { childList: true, subtree: true }); // entrances only
            observers.push(mo2);
        }
    }

    function disconnect() {
        for (var i = 0; i < observers.length; i++) observers[i].disconnect();
        observers = [];
    }

    appMotion.connect = connect;
    appMotion.disconnect = disconnect;

    // Keep `reduced` live; observers pause entirely while reduced.
    function onPreference() {
        appMotion.reduced = mq ? mq.matches : false;
        if (isReduced()) disconnect(); else connect();
    }
    if (mq) {
        if (typeof mq.addEventListener === 'function') mq.addEventListener('change', onPreference);
        else if (typeof mq.addListener === 'function') mq.addListener(onPreference); // older Safari
    }

    // ---- Pressed feel: one delegated listener for the whole app ----
    var PRESS_SEL = '.btn, .module-action-btn, .reading-option, .flashcard-btn, ' +
        '.flashcard-reveal-btn, .module-back-btn, .quiz-option-btn, .game-card';
    document.addEventListener('click', function (e) {
        if (isReduced() || !e.target || !e.target.closest) return;
        var el = e.target.closest(PRESS_SEL);
        if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true') return;
        oneShot(el, 'm-press');
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onPreference, { once: true });
    } else {
        onPreference();
    }
})();
