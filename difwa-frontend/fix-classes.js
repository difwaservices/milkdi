const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['app', 'components'];
const EXTENSIONS = ['.tsx', '.ts'];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    
    // Fix duplicate className attributes
    // e.g., className="font-bold" className="text-primary" -> className="font-bold text-primary"
    const duplicateClassRegex = /className=['"]([^'"]+)['"]\s+className=['"]([^'"]+)['"]/g;
    
    // Run it a few times in case there are triple classNames
    for (let i = 0; i < 3; i++) {
        content = content.replace(duplicateClassRegex, 'className="$1 $2"');
    }

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Fixed duplicates: ${filePath}`);
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

console.log('Fix complete.');
