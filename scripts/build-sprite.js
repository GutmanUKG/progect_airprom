const SVGSpriter = require('svg-sprite');
const fs = require('fs');
const path = require('path');

const spriter = new SVGSpriter({
  dest: 'dist/img',
  mode: {
    symbol: {
      dest: '.',
      sprite: 'sprite.svg'
    }
  },
  shape: {
    transform: []
  }
});

const svgDir = path.resolve(__dirname, '../src/svg');
const distDir = path.resolve(__dirname, '../dist/img');

// Создаём папку dist/img если её нет
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Читаем все SVG файлы
if (fs.existsSync(svgDir)) {
  const files = fs.readdirSync(svgDir).filter(f => f.endsWith('.svg'));

  files.forEach(file => {
    const filePath = path.join(svgDir, file);
    spriter.add(filePath, file, fs.readFileSync(filePath, 'utf-8'));
  });

  // Компилируем спрайт
  spriter.compile((error, result) => {
    if (error) {
      console.error('Error:', error);
      return;
    }

    for (const mode in result) {
      for (const resource in result[mode]) {
        const file = result[mode][resource];
        fs.writeFileSync(path.join(distDir, 'sprite.svg'), file.contents);
        console.log('✓ Sprite created: dist/img/sprite.svg');
      }
    }
  });
} else {
  console.log('No SVG directory found at src/svg');
}
