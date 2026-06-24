import json
import re

with open('/Users/hiep/.gemini/antigravity/brain/3fc04826-0a52-47fb-803f-d8277a34b793/.system_generated/logs/transcript.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            content = json.dumps(data)
            if 'function BuildingDetailsContainer' in content:
                match = re.search(r'(function AddressInfo[\s\S]*?)function MainContainer', content)
                if match:
                    extracted = match.group(1).replace('\\n', '\n').replace('\\"', '"').replace('\\\\', '\\')
                    with open('/tmp/recovered.txt', 'w') as out:
                        out.write(extracted)
                        print(f"Extracted {len(extracted)} bytes")
                    break
        except Exception as e:
            pass
