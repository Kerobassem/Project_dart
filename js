// Global Variables
let currentSlide = 1;
const slideNames = [
    'Introduction',
    'Big-O Notation',
    'Arrays/Lists',
    'Linked Lists',
    'Stacks & Queues',
    'Hash Maps',
    'Trees & Graphs',
    'Use Cases',
    'Challenges',
    'Takeaways',
    'References',
    'Team Members'
];
const totalSlides = slideNames.length;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initNav();
    initTheme();
    restoreLastSlide();
    enhanceCodeBlocks();
    updateButtons();
    setupKeyboardNav();
});

// Initialize Navigation Buttons
function initNav() {
    const navButtons = document.getElementById('navButtons');
    navButtons.innerHTML = ''; // Clear existing buttons
    
    for (let i = 1; i <= totalSlides; i++) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn' + (i === currentSlide ? ' active' : '');
        btn.textContent = `${i}. ${slideNames[i-1]}`;
        btn.onclick = () => goToSlide(i);
        btn.setAttribute('aria-label', `Go to slide ${i}: ${slideNames[i-1]}`);
        navButtons.appendChild(btn);
    }
}


// Navigate to Specific Slide
function goToSlide(n) {
    if (n < 1 || n > totalSlides) return;
    
    const currentSlideElement = document.getElementById(`slide${currentSlide}`);
    if (currentSlideElement) {
        currentSlideElement.classList.remove('active');
    }
    
    // Remove active class from current nav button
    const navButtons = document.querySelectorAll('.nav-btn');
    if (navButtons[currentSlide - 1]) {
        navButtons[currentSlide - 1].classList.remove('active');
    }
    
    // Update current slide
    currentSlide = n;
    
    // Add active class to new slide
    const newSlideElement = document.getElementById(`slide${currentSlide}`);
    if (newSlideElement) {
        newSlideElement.classList.add('active');
    }
    
    // Add active class to new nav button
    if (navButtons[currentSlide - 1]) {
        navButtons[currentSlide - 1].classList.add('active');
    }
    
    // Update navigation buttons
    updateButtons();
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Store current slide in localStorage
    localStorage.setItem('currentSlide', currentSlide);
}

// Change Slide (Relative)
function changeSlide(direction) {
    const newSlide = currentSlide + direction;
    if (newSlide >= 1 && newSlide <= totalSlides) {
        goToSlide(newSlide);
    }
}

// Update Navigation Button States
function updateButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 1;
        prevBtn.setAttribute('aria-disabled', currentSlide === 1);
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides;
        nextBtn.setAttribute('aria-disabled', currentSlide === totalSlides);
    }
}

// Theme Toggle Functionality
function initTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme, themeIcon);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme, themeIcon);
        });
    }
}

// Update Theme Icon
function updateThemeIcon(theme, iconElement) {
    if (iconElement) {
        iconElement.textContent = theme === 'light' ? '🌙' : '☀️';
    }
}

// Keyboard Navigation
function setupKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeSlide(1);
                break;
            case 'Home':
                e.preventDefault();
                goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                goToSlide(totalSlides);
                break;
            case 'Escape':
                // Optional: Could add a feature like fullscreen toggle
                break;
        }
    });
}

// Restore Last Viewed Slide (Optional Enhancement)
function restoreLastSlide() {
    const savedSlide = localStorage.getItem('currentSlide');
    if (savedSlide) {
        const slideNum = parseInt(savedSlide);
        if (slideNum >= 1 && slideNum <= totalSlides) {
            goToSlide(slideNum);
        }
    }
}

// Enhance .code-block elements into a VSCode-like editor with line numbers
function enhanceCodeBlocks() {
    const blocks = document.querySelectorAll('.code-block');
    blocks.forEach(block => {
        if (block.dataset.enhanced === 'true') return;

        // Compute number of lines based on rendered text
        const text = block.innerText.replace(/\r/g, '');
        const lines = text.split('\n');
        const lineCount = lines.length;

        // Create editor container
        const editor = document.createElement('div');
        editor.className = 'code-editor';

        const gutter = document.createElement('div');
        gutter.className = 'gutter';

        for (let i = 1; i <= lineCount; i++) {
            const line = document.createElement('div');
            line.className = 'line';
            line.textContent = i;
            gutter.appendChild(line);
        }

        const content = document.createElement('div');
        content.className = 'code-content';
        // Preserve the existing HTML (syntax-colored spans)
        content.innerHTML = block.innerHTML;

        // Create toolbar and output
        const toolbar = document.createElement('div');
        toolbar.className = 'code-toolbar';

        const runBtn = document.createElement('button');
        runBtn.className = 'btn run';
        runBtn.textContent = 'Run ▶';

        const clearBtn = document.createElement('button');
        clearBtn.className = 'btn clear';
        clearBtn.textContent = 'Clear';

        toolbar.appendChild(runBtn);
        toolbar.appendChild(clearBtn);

        const output = document.createElement('div');
        output.className = 'code-output';
        output.innerHTML = '<div class="line">(Output will appear here)</div>';

        // Replace original block with editor and attach elements
        block.parentNode.replaceChild(editor, block);
        editor.appendChild(gutter);
        const editorInner = document.createElement('div');
        editorInner.style.display = 'flex';
        editorInner.style.flexDirection = 'column';
        editorInner.style.width = '100%';
        editorInner.appendChild(toolbar);
        editorInner.appendChild(content);
        editorInner.appendChild(output);
        editor.appendChild(editorInner);

        // Sync vertical scroll so line numbers follow the code
        content.addEventListener('scroll', () => {
            gutter.scrollTop = content.scrollTop;
        });

        // Run / Clear handlers
        runBtn.addEventListener('click', () => {
            output.innerHTML = '';
            const codeText = content.innerText;
            try {
                const resultLines = runDartSnippet(codeText);
                if (resultLines.length === 0) {
                    output.innerHTML = '<div class="line">(No output)</div>';
                } else {
                    resultLines.forEach(l => {
                        const d = document.createElement('div');
                        d.className = 'line';
                        d.textContent = l;
                        output.appendChild(d);
                    });
                }
            } catch (err) {
                output.innerHTML = '<div class="line">Error: ' + err.message + '</div>';
            }
        });

        clearBtn.addEventListener('click', () => {
            output.innerHTML = '<div class="line">(Output cleared)</div>';
        });

        // Mark as enhanced so we don't process it again
        editor.dataset.enhanced = 'true';
    });
}

// Basic Dart snippet runner (supports simple lists, add/remove, prints, for-in loops and `.contains`, `.length`)
function runDartSnippet(code) {
    const env = {}; // variable storage
    const outputs = [];

    const lines = code.split(/\n/).map(l => l.trim()).filter(l => l.length > 0);

    function parseLiteral(lit) {
        if (/^'.*'$/.test(lit) || /^".*"$/.test(lit)) return lit.slice(1, -1);
        if (/^\d+$/.test(lit)) return parseInt(lit, 10);
        if (/^\d+\.\d+$/.test(lit)) return parseFloat(lit);
        if (lit === 'true') return true;
        if (lit === 'false') return false;
        return lit; // variable name fallback
    }

    for (let i = 0; i < lines.length; i++) {
        const ln = lines[i];

        // List declaration: List<String> users = ['Alice', 'Bob']; or var users = ['A','B'];
        let m = ln.match(/(?:List<[^>]+>|var|final)\s+(\w+)\s*=\s*\[(.*)\];?/);
        if (m) {
            const name = m[1];
            const itemsRaw = m[2].trim();
            const items = itemsRaw.length === 0 ? [] : itemsRaw.split(/,(?![^\[]*\])/).map(s => s.trim()).map(parseLiteral);
            env[name] = items;
            continue;
        }

        // Map declaration like Map<String, dynamic> userCache = {};
        m = ln.match(/(?:Map<[^>]+>|var|final)\s+(\w+)\s*=\s*\{\s*\};?/);
        if (m) {
            env[m[1]] = {};
            continue;
        }

        // Map insert: userCache['id'] = { 'name': 'John' };
        m = ln.match(/(\w+)\s*\[\s*['"]([^'"]+)['"]\s*\]\s*=\s*\{(.*)\};?/);
        if (m) {
            const mapName = m[1];
            const key = m[2];
            const inner = m[3];
            // parse simple object of string/number pairs
            const obj = {};
            inner.split(',').map(p => p.trim()).filter(Boolean).forEach(pair => {
                const kv = pair.split(/:(.+)/);
                if (kv.length === 2) {
                    const k = kv[0].replace(/['"]+/g,'').trim();
                    const v = kv[1].trim();
                    obj[k] = parseLiteral(v);
                }
            });
            env[mapName] = env[mapName] || {};
            env[mapName][key] = obj;
            continue;
        }

        // Add/insert/removeAt/remove/clear on lists
        m = ln.match(/(\w+)\.add\((.+)\);?/);
        if (m) {
            const name = m[1];
            const val = parseLiteral(m[2].trim());
            env[name].push(val);
            continue;
        }
        m = ln.match(/(\w+)\.insert\((\d+),\s*(.+)\);?/);
        if (m) {
            const name = m[1];
            const idx = parseInt(m[2], 10);
            const val = parseLiteral(m[3].trim());
            env[name].splice(idx, 0, val);
            continue;
        }
        m = ln.match(/(\w+)\.removeAt\((\d+)\);?/);
        if (m) {
            const name = m[1];
            const idx = parseInt(m[2], 10);
            env[name].splice(idx, 1);
            continue;
        }
        m = ln.match(/(\w+)\.remove\((.+)\);?/);
        if (m) {
            const name = m[1];
            const val = parseLiteral(m[2].trim());
            const idx = env[name].indexOf(val);
            if (idx !== -1) env[name].splice(idx,1);
            continue;
        }
        m = ln.match(/(\w+)\.clear\(\);?/);
        if (m) {
            env[m[1]] = [];
            continue;
        }

        // contains check: bool hasAlice = users.contains('Alice');
        m = ln.match(/(?:bool\s+)?(\w+)\s*=\s*(\w+)\.contains\((.+)\);?/);
        if (m) {
            const varName = m[1];
            const list = m[2];
            const val = parseLiteral(m[3].trim());
            env[varName] = (env[list] || []).includes(val);
            continue;
        }

        // for (var user in users) { print(user); }
        m = ln.match(/for\s*\(var\s+(\w+)\s+in\s+(\w+)\)\s*\{?/);
        if (m) {
            const iterVar = m[1];
            const listName = m[2];
            const listVal = env[listName] || [];
            // look ahead for print inside block
            let j = i+1;
            for (; j < lines.length; j++) {
                const inner = lines[j];
                if (/\}/.test(inner)) break;
                const pm = inner.match(/print\((.+)\);?/);
                if (pm) {
                    const expr = pm[1].trim();
                    if (expr === iterVar) {
                        listVal.forEach(v => outputs.push(String(v)));
                    } else if (/^['"].*['"]$/.test(expr)) {
                        outputs.push(parseLiteral(expr));
                    }
                }
            }
            i = j; // advance
            continue;
        }

        // print(...) statements
        m = ln.match(/print\((.+)\);?/);
        if (m) {
            const expr = m[1].trim();
            // users[0] access
            let pm = expr.match(/(\w+)\[(\d+)\]/);
            if (pm) {
                const name = pm[1];
                const idx = parseInt(pm[2], 10);
                outputs.push(String((env[name] || [])[idx]));
                continue;
            }
            // map access userCache['id']
            pm = expr.match(/(\w+)\[['"]([^'\"]+)['"]\]/);
            if (pm) {
                const name = pm[1];
                const key = pm[2];
                outputs.push(JSON.stringify(env[name] && env[name][key] ? env[name][key] : null));
                continue;
            }
            // property length
            pm = expr.match(/(\w+)\.length/);
            if (pm) {
                const name = pm[1];
                outputs.push(String((env[name] || []).length));
                continue;
            }
            // boolean/variable
            if (/^['"].*['"]$/.test(expr)) {
                outputs.push(parseLiteral(expr));
                continue;
            }
            if (/^\d+$/.test(expr)) { outputs.push(expr); continue; }
            // variable
            if (env.hasOwnProperty(expr)) {
                const val = env[expr];
                outputs.push(typeof val === 'object' ? JSON.stringify(val) : String(val));
                continue;
            }
            outputs.push('(Could not evaluate: ' + expr + ')');
            continue;
        }

        // Fallback: ignore other lines
    }

    return outputs;
}


// Touch/Swipe Support for Mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            changeSlide(1);
        } else {
            // Swipe right - previous slide
            changeSlide(-1);
        }
    }
}

// Print Functionality (Optional)
function printPresentation() {
    // Show all slides for printing
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => {
        slide.style.display = 'block';
        slide.style.pageBreakAfter = 'always';
    });
    
    window.print();
    
    // Restore normal view after printing
    setTimeout(() => {
        slides.forEach((slide, index) => {
            slide.style.display = index + 1 === currentSlide ? 'block' : 'none';
            slide.style.pageBreakAfter = 'auto';
        });
    }, 100);
}

// Export functions for use in HTML
window.goToSlide = goToSlide;
window.changeSlide = changeSlide;
window.printPresentation = printPresentation;
