const fs = require('fs');
const lines = fs.readFileSync('/Users/hiep/.gemini/antigravity/brain/3fc04826-0a52-47fb-803f-d8277a34b793/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

for (const line of lines) {
  if (line.includes('function BuildingDetailsContainer')) {
    try {
      const parsed = JSON.parse(line);
      const text = JSON.stringify(parsed);
      const match = text.match(/(function AddressInfo[\s\S]*?)function MainContainer/);
      if (match) {
        let content = match[1];
        content = content.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        fs.writeFileSync('/tmp/recovered2.txt', content);
      }
    } catch (e) {}
  }
}
