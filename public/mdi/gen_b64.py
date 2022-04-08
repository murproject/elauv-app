import os
import base64

directory = '.'
output = 'const b64icons = {\n'

for filename in os.listdir(directory):
    f = os.path.join(directory, filename)
    if f.endswith('.svg') and os.path.isfile(f):
        with open(f, 'r') as file:
            data = file.read().encode('utf-8')
            item_name = filename.replace('.svg', '')
            item_base64 = base64.b64encode(data).decode("utf-8")
            item_line = f"  '{item_name}': '{item_base64}',\n"
            output += item_line

output += "}\n"

with open('mdi_icons_base64.js', 'w') as file:
    file.write(output)