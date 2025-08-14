import json
from collections import defaultdict

questions = json.load(open('M:\\OneDrive\\Documents\\GitHub\\excel_to_json\\data\\questions.json'))
dup_dict = defaultdict(list)
for q in questions:
    text = q['question']
    if text is not None:
        normalized = text.strip().lower()
        dup_dict[normalized].append(q['id'])
duplicates = {k: v for k, v in dup_dict.items() if len(v) > 1}
if duplicates:
    for text, ids in duplicates.items():
        print(f'Duplicate question: "{text}" with IDs: {ids}')
else:
    print('No duplicates found')