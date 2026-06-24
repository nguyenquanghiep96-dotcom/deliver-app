import json
import re

found_content = ""

with open('/Users/hiep/.gemini/antigravity/brain/3fc04826-0a52-47fb-803f-d8277a34b793/.system_generated/logs/transcript.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            if 'output' in data.get('content', ''):
                content = data['content']
                if 'function BuildingImagesContainer' in content and 'export default function StopDetail()' in content:
                    found_content = content
        except:
            pass

if found_content:
    with open('/tmp/recovered_full.txt', 'w') as out:
        out.write(found_content)
        print("Recovered full file!")
