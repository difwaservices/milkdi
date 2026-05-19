const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];
const EXTENSIONS = ['.tsx', '.ts'];

const COLOR_MAP = {
    // Brand Primary
    '#15803D': 'primary',
    '#14532D': 'primary-dark',
    '#BBF7D0': 'primary-light',
    '#F0FDF4': 'primary-soft',
    
    // Brand Amber / old colors mappings just in case
    '#D97706': 'primary',
    '#B45309': 'primary-dark',
    '#FDE68A': 'primary-light',
    '#FFFBEB': 'primary-soft',
    
    // Text
    '#0F172A': 'text-title',
    '#334155': 'text-body',
    '#64748B': 'text-muted',
    '#94A3B8': 'text-muted-light',
    '#374151': 'gray-700', // standard tailwind
    
    // Status Success
    '#059669': 'status-success',
    '#ECFDF5': 'status-success-bg',
    '#A7F3D0': 'status-success-border',
    
    // Status Danger
    '#DC2626': 'status-danger',
    '#FEF2F2': 'status-danger-bg',
    '#FECACA': 'status-danger-border',
    '#EF4444': 'red-500',
    
    // Status Info
    '#0369A1': 'status-info',
    '#F0F9FF': 'status-info-bg',
    '#BAE6FD': 'status-info-border',
    '#7DD3FC': 'sky-300'
};

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // 1. Replace style={{ color: "#..." }}
    const colorRegex = /style=\{\{\s*color:\s*['"](#[0-9a-fA-F]+)['"]\s*\}\}/g;
    content = content.replace(colorRegex, (match, hex) => {
        const twClass = COLOR_MAP[hex.toUpperCase()] || COLOR_MAP[hex];
        if (twClass) {
            return `className="text-${twClass}"`;
        }
        return match;
    });

    // 2. Replace style={{ background: "#..." }}
    const bgRegex = /style=\{\{\s*background:\s*['"](#[0-9a-fA-F]+)['"]\s*\}\}/g;
    content = content.replace(bgRegex, (match, hex) => {
        const twClass = COLOR_MAP[hex.toUpperCase()] || COLOR_MAP[hex];
        if (twClass) {
            return `className="bg-${twClass}"`;
        }
        return match;
    });

    // 3. Complex styles style={{ background: "#...", color: "#..." }}
    const complexRegex = /style=\{\{\s*background:\s*['"](#[0-9a-fA-F]+)['"]\s*,\s*color:\s*['"](#[0-9a-fA-F]+)['"]\s*\}\}/g;
    content = content.replace(complexRegex, (match, bgHex, colorHex) => {
        const bgClass = COLOR_MAP[bgHex.toUpperCase()] || COLOR_MAP[bgHex];
        const colorClass = COLOR_MAP[colorHex.toUpperCase()] || COLOR_MAP[colorHex];
        if (bgClass && colorClass) {
            return `className="bg-${bgClass} text-${colorClass}"`;
        }
        return match;
    });

    // 4. If an element already has a className and a style with a mapped color, merge them
    // This is hard to do with pure regex cleanly for all cases, but we can catch the most common ones.
    // E.g., className="something" style={{ color: "#HEX" }}
    // We'll write a simple regex for this specific pattern on the same line
    const mergeRegex = /className=['"]([^'"]+)['"]\s*style=\{\{\s*(color|background):\s*['"](#[0-9a-fA-F]+)['"]\s*\}\}/g;
    content = content.replace(mergeRegex, (match, classes, type, hex) => {
        const twClass = COLOR_MAP[hex.toUpperCase()] || COLOR_MAP[hex];
        if (twClass) {
            const prefix = type === 'color' ? 'text' : 'bg';
            return `className="${classes} ${prefix}-${twClass}"`;
        }
        return match;
    });

    // Also handle reversed order: style={{ color: "#HEX" }} className="something"
    const mergeReversedRegex = /style=\{\{\s*(color|background):\s*['"](#[0-9a-fA-F]+)['"]\s*\}\}\s*className=['"]([^'"]+)['"]/g;
    content = content.replace(mergeReversedRegex, (match, type, hex, classes) => {
        const twClass = COLOR_MAP[hex.toUpperCase()] || COLOR_MAP[hex];
        if (twClass) {
            const prefix = type === 'color' ? 'text' : 'bg';
            return `className="${classes} ${prefix}-${twClass}"`;
        }
        return match;
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            walkDir(fullPath);
        } else if (EXTENSIONS.includes(path.extname(fullPath))) {
            processFile(fullPath);
        }
    }
}

DIRECTORIES.forEach(dir => {
    const fullDir = path.join(__dirname, dir);
    if (fs.existsSync(fullDir)) {
        walkDir(fullDir);
    }
});

console.log('Refactoring complete.');
