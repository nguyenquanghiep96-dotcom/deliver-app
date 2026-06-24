import json

found_content = ""

with open('/Users/hiep/.gemini/antigravity/brain/3fc04826-0a52-47fb-803f-d8277a34b793/.system_generated/logs/transcript.jsonl', 'r') as f:
    for line in f:
        try:
            data = json.loads(line)
            # if it's a view_file response or run_command response
            if 'output' in data.get('content', ''):
                content = data['content']
                if 'function BuildingDetailsContainer({ stop }: any)' in content and 'export default function StopDetail()' in content:
                    found_content = content
        except:
            pass

if found_content:
    # Try to extract just the source code part if it's inside a JSON string or shell output
    with open('/tmp/recovered3.txt', 'w') as out:
        out.write(found_content)
        print("Recovered full file content")
